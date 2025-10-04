import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  loginSchema,
  insertExpenseSchema,
  approvalActionSchema,
  insertApprovalRuleSchema,
  updateUserRoleSchema,
  insertCompanySchema,
  type User,
} from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

async function authMiddleware(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await storage.getUserById(req.session.userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  req.user = user;
  next();
}

function requireRole(roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  try {
    await storage.connect();
    console.log("✓ Database connected successfully");
  } catch (error) {
    console.warn("⚠ Using in-memory storage (MongoDB not available)");
  }

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { country, currency, ...userData } = req.body;
      
      const validatedUser = insertUserSchema.parse({
        ...userData,
        role: "employee",
      });

      const existingUser = await storage.getUserByEmail(validatedUser.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      let companyId = validatedUser.companyId;

      if (!companyId && country && currency) {
        const companyData = insertCompanySchema.parse({
          name: `${userData.name}'s Company`,
          country,
          currency,
        });
        const company = await storage.createCompany(companyData);
        companyId = company._id;

        validatedUser.role = "admin";
      }

      const user = await storage.createUser({
        ...validatedUser,
        companyId,
      });

      req.session.userId = user._id;

      let company = null;
      if (user.companyId) {
        company = await storage.getCompany(user.companyId);
      }

      const { password, ...userWithoutPassword } = user;
      res.json({
        user: {
          ...userWithoutPassword,
          companyCurrency: company?.currency || "USD",
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(credentials.email);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await storage.verifyPassword(user._id, credentials.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) {
            reject(err);
          } else {
            req.session.userId = user._id;
            resolve();
          }
        });
      });

      let company = null;
      if (user.companyId) {
        company = await storage.getCompany(user.companyId);
      }

      const { password, ...userWithoutPassword } = user;
      res.json({
        user: {
          ...userWithoutPassword,
          companyCurrency: company?.currency || "USD",
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    const { password, ...userWithoutPassword } = req.user!;
    let company = null;
    if (req.user!.companyId) {
      company = await storage.getCompany(req.user!.companyId);
    }
    res.json({
      user: {
        ...userWithoutPassword,
        companyCurrency: company?.currency || "USD",
      },
    });
  });

  app.post("/api/expenses", authMiddleware, async (req, res) => {
    try {
      const expenseData = insertExpenseSchema.parse(req.body);
      
      const expense = await storage.createExpense({
        ...expenseData,
        employeeId: req.user!._id,
        companyId: req.user!.companyId!,
      });

      const approvalRule = await storage.getApprovalRuleForExpense(
        expenseData.amount,
        req.user!.companyId!
      );

      if (approvalRule) {
        const approverIds = approvalRule.isManagerApprover && req.user!.managerId
          ? [req.user!.managerId, ...approvalRule.approverSequence]
          : approvalRule.approverSequence;

        for (let i = 0; i < approverIds.length; i++) {
          await storage.createApprovalStep({
            expenseId: expense._id,
            approverId: approverIds[i],
            sequence: i,
            status: i === 0 ? "pending" : "pending",
          });
        }

        if (approverIds.length > 0) {
          await storage.updateExpenseStatus(expense._id, "in-review", 0);
        }
      }

      res.json({ expense });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/expenses/my", authMiddleware, async (req, res) => {
    try {
      const expenses = await storage.getExpensesByEmployee(req.user!._id);
      
      const expensesWithEmployees = await Promise.all(
        expenses.map(async (expense) => {
          const employee = await storage.getUserById(expense.employeeId);
          return {
            ...expense,
            employee: {
              name: employee?.name || "Unknown",
              avatar: undefined,
            },
          };
        })
      );

      res.json({ expenses: expensesWithEmployees });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/expenses", authMiddleware, async (req, res) => {
    try {
      let expenses;

      if (req.user!.role === "admin") {
        expenses = await storage.getExpensesByCompany(req.user!.companyId!);
      } else if (req.user!.role === "manager") {
        const teamExpenses = await storage.getPendingExpensesForApprover(req.user!._id);
        const ownExpenses = await storage.getExpensesByEmployee(req.user!._id);
        expenses = [...teamExpenses, ...ownExpenses];
      } else {
        expenses = await storage.getExpensesByEmployee(req.user!._id);
      }

      const expensesWithEmployees = await Promise.all(
        expenses.map(async (expense) => {
          const employee = await storage.getUserById(expense.employeeId);
          return {
            ...expense,
            employee: {
              name: employee?.name || "Unknown",
              avatar: undefined,
            },
          };
        })
      );

      res.json({ expenses: expensesWithEmployees });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/expenses/pending", authMiddleware, async (req, res) => {
    try {
      const expenses = await storage.getPendingExpensesForApprover(req.user!._id);
      
      const expensesWithEmployees = await Promise.all(
        expenses.map(async (expense) => {
          const employee = await storage.getUserById(expense.employeeId);
          return {
            ...expense,
            employee: {
              name: employee?.name || "Unknown",
              avatar: undefined,
            },
          };
        })
      );

      res.json({ expenses: expensesWithEmployees });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/expenses/:id", authMiddleware, async (req, res) => {
    try {
      const expense = await storage.getExpenseById(req.params.id);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }

      const employee = await storage.getUserById(expense.employeeId);
      res.json({
        expense: {
          ...expense,
          employee: {
            name: employee?.name || "Unknown",
            avatar: undefined,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/expenses/:id/approvals", authMiddleware, async (req, res) => {
    try {
      const steps = await storage.getApprovalStepsByExpense(req.params.id);
      
      const stepsWithApprovers = await Promise.all(
        steps.map(async (step) => {
          const approver = await storage.getUserById(step.approverId);
          return {
            id: step._id,
            approver: {
              name: approver?.name || "Unknown",
              role: approver?.role || "Unknown",
              avatar: undefined,
            },
            status: step.status === "pending" && step.sequence === 0 ? "current" : step.status,
            comment: step.comment,
            timestamp: step.timestamp?.toISOString(),
          };
        })
      );

      res.json({ steps: stepsWithApprovers });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/expenses/approve", authMiddleware, async (req, res) => {
    try {
      const { expenseId, action, comment } = approvalActionSchema.parse(req.body);
      
      const expense = await storage.getExpenseById(expenseId);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }

      const steps = await storage.getApprovalStepsByExpense(expenseId);
      const currentStep = steps.find(
        (s) => s.approverId === req.user!._id && s.status === "pending"
      );

      if (!currentStep) {
        return res.status(403).json({ error: "Not authorized to approve this expense" });
      }

      await storage.updateApprovalStep(
        currentStep._id,
        action === "approve" ? "approved" : "rejected",
        comment
      );

      if (action === "reject") {
        await storage.updateExpenseStatus(expenseId, "rejected", expense.currentApproverIndex);
      } else {
        const nextStep = steps.find((s) => s.sequence === currentStep.sequence + 1);
        if (nextStep) {
          await storage.updateExpenseStatus(expenseId, "in-review", expense.currentApproverIndex + 1);
        } else {
          await storage.updateExpenseStatus(expenseId, "approved", expense.currentApproverIndex);
        }
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users", authMiddleware, requireRole(["admin"]), async (req, res) => {
    try {
      const users = await storage.getUsersByCompany(req.user!.companyId!);
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json({ users: usersWithoutPasswords });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/users", authMiddleware, requireRole(["admin"]), async (req, res) => {
    try {
      const userData = insertUserSchema.parse({
        ...req.body,
        companyId: req.user!.companyId,
        role: req.body.role || "employee",
      });

      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/users/role", authMiddleware, requireRole(["admin"]), async (req, res) => {
    try {
      const { userId, role, managerId } = updateUserRoleSchema.parse(req.body);
      await storage.updateUserRole(userId, role, managerId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/approval-rules", authMiddleware, requireRole(["admin"]), async (req, res) => {
    try {
      const rules = await storage.getApprovalRulesByCompany(req.user!.companyId!);
      res.json({ rules });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/approval-rules", authMiddleware, requireRole(["admin"]), async (req, res) => {
    try {
      const ruleData = insertApprovalRuleSchema.parse(req.body);
      const rule = await storage.createApprovalRule({
        ...ruleData,
        companyId: req.user!.companyId!,
      });
      res.json({ rule });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/countries", async (req, res) => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,currencies");
      const data = await response.json();
      
      const countries = data
        .filter((country: any) => country.currencies)
        .map((country: any) => ({
          name: country.name.common,
          currencies: Object.keys(country.currencies).map((code) => ({
            code,
            name: country.currencies[code].name,
            symbol: country.currencies[code].symbol,
          })),
        }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

      res.json({ countries });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  });

  app.get("/api/exchange-rates/:baseCurrency", async (req, res) => {
    try {
      const { baseCurrency } = req.params;
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      const data = await response.json();
      res.json({ rates: data.rates, base: data.base });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch exchange rates" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
