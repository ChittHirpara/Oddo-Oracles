import { MongoClient, Db, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import {
  type Company,
  type User,
  type Expense,
  type ApprovalRule,
  type ApprovalStep,
  type InsertCompany,
  type InsertUser,
  type InsertExpense,
  type InsertApprovalRule,
} from "@shared/schema";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "expense_management";

export interface IStorage {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  createCompany(company: InsertCompany): Promise<Company>;
  getCompany(id: string): Promise<Company | null>;

  createUser(user: InsertUser): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUsersByCompany(companyId: string): Promise<User[]>;
  updateUserRole(userId: string, role: string, managerId?: string): Promise<void>;
  verifyPassword(userId: string, password: string): Promise<boolean>;

  createExpense(expense: InsertExpense & { employeeId: string; companyId: string }): Promise<Expense>;
  getExpenseById(id: string): Promise<Expense | null>;
  getExpensesByEmployee(employeeId: string): Promise<Expense[]>;
  getExpensesByCompany(companyId: string): Promise<Expense[]>;
  getPendingExpensesForApprover(approverId: string): Promise<Expense[]>;
  updateExpenseStatus(expenseId: string, status: string, currentApproverIndex: number): Promise<void>;

  createApprovalRule(rule: InsertApprovalRule & { companyId: string }): Promise<ApprovalRule>;
  getApprovalRulesByCompany(companyId: string): Promise<ApprovalRule[]>;
  getApprovalRuleForExpense(amount: number, companyId: string): Promise<ApprovalRule | null>;

  createApprovalStep(step: Omit<ApprovalStep, "_id">): Promise<ApprovalStep>;
  getApprovalStepsByExpense(expenseId: string): Promise<ApprovalStep[]>;
  updateApprovalStep(stepId: string, status: string, comment?: string): Promise<void>;
}

class MemStorage implements IStorage {
  private companies: Map<string, Company> = new Map();
  private users: Map<string, User> = new Map();
  private expenses: Map<string, Expense> = new Map();
  private approvalRules: Map<string, ApprovalRule> = new Map();
  private approvalSteps: Map<string, ApprovalStep> = new Map();

  async connect(): Promise<void> {
    console.log("Using in-memory storage");
  }

  async disconnect(): Promise<void> {}

  async createCompany(company: InsertCompany): Promise<Company> {
    const id = randomUUID();
    const newCompany: Company = {
      _id: id,
      ...company,
      createdAt: new Date(),
    };
    this.companies.set(id, newCompany);
    return newCompany;
  }

  async getCompany(id: string): Promise<Company | null> {
    return this.companies.get(id) || null;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: User = {
      _id: id,
      ...user,
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find((u) => u.email === email) || null;
  }

  async getUsersByCompany(companyId: string): Promise<User[]> {
    return Array.from(this.users.values()).filter((u) => u.companyId === companyId);
  }

  async updateUserRole(userId: string, role: string, managerId?: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.role = role as any;
      if (managerId !== undefined) {
        user.managerId = managerId;
      }
    }
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }

  async createExpense(expense: InsertExpense & { employeeId: string; companyId: string }): Promise<Expense> {
    const id = randomUUID();
    const now = new Date();
    const newExpense: Expense = {
      _id: id,
      ...expense,
      date: typeof expense.date === "string" ? new Date(expense.date) : expense.date,
      status: "pending",
      currentApproverIndex: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.expenses.set(id, newExpense);
    return newExpense;
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    return this.expenses.get(id) || null;
  }

  async getExpensesByEmployee(employeeId: string): Promise<Expense[]> {
    return Array.from(this.expenses.values())
      .filter((e) => e.employeeId === employeeId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getExpensesByCompany(companyId: string): Promise<Expense[]> {
    return Array.from(this.expenses.values())
      .filter((e) => e.companyId === companyId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPendingExpensesForApprover(approverId: string): Promise<Expense[]> {
    const steps = Array.from(this.approvalSteps.values()).filter(
      (s) => s.approverId === approverId && s.status === "pending"
    );
    const expenseIds = steps.map((s) => s.expenseId);
    return Array.from(this.expenses.values()).filter((e) => expenseIds.includes(e._id));
  }

  async updateExpenseStatus(expenseId: string, status: string, currentApproverIndex: number): Promise<void> {
    const expense = this.expenses.get(expenseId);
    if (expense) {
      expense.status = status as any;
      expense.currentApproverIndex = currentApproverIndex;
      expense.updatedAt = new Date();
    }
  }

  async createApprovalRule(rule: InsertApprovalRule & { companyId: string }): Promise<ApprovalRule> {
    const id = randomUUID();
    const newRule: ApprovalRule = {
      _id: id,
      ...rule,
      createdAt: new Date(),
    };
    this.approvalRules.set(id, newRule);
    return newRule;
  }

  async getApprovalRulesByCompany(companyId: string): Promise<ApprovalRule[]> {
    return Array.from(this.approvalRules.values()).filter((r) => r.companyId === companyId);
  }

  async getApprovalRuleForExpense(amount: number, companyId: string): Promise<ApprovalRule | null> {
    return (
      Array.from(this.approvalRules.values()).find((r) => {
        if (r.companyId !== companyId) return false;
        if (r.minAmount !== undefined && amount < r.minAmount) return false;
        if (r.maxAmount !== undefined && amount > r.maxAmount) return false;
        return true;
      }) || null
    );
  }

  async createApprovalStep(step: Omit<ApprovalStep, "_id">): Promise<ApprovalStep> {
    const id = randomUUID();
    const newStep: ApprovalStep = {
      _id: id,
      ...step,
    };
    this.approvalSteps.set(id, newStep);
    return newStep;
  }

  async getApprovalStepsByExpense(expenseId: string): Promise<ApprovalStep[]> {
    return Array.from(this.approvalSteps.values())
      .filter((s) => s.expenseId === expenseId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  async updateApprovalStep(stepId: string, status: string, comment?: string): Promise<void> {
    const step = this.approvalSteps.get(stepId);
    if (step) {
      step.status = status as any;
      step.timestamp = new Date();
      if (comment) {
        step.comment = comment;
      }
    }
  }
}

export class MongoStorage implements IStorage {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<void> {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI not configured");
    }
    
    this.client = new MongoClient(MONGODB_URI);
    await this.client.connect();
    this.db = this.client.db(DB_NAME);
    console.log("Connected to MongoDB");

    await this.db.collection("companies").createIndex({ name: 1 });
    await this.db.collection("users").createIndex({ email: 1 }, { unique: true });
    await this.db.collection("users").createIndex({ companyId: 1 });
    await this.db.collection("expenses").createIndex({ employeeId: 1 });
    await this.db.collection("expenses").createIndex({ companyId: 1 });
    await this.db.collection("expenses").createIndex({ status: 1 });
    await this.db.collection("approvalSteps").createIndex({ expenseId: 1 });
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
  }

  private getDb(): Db {
    if (!this.db) throw new Error("Database not connected");
    return this.db;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const db = this.getDb();
    const result = await db.collection("companies").insertOne({
      ...company,
      createdAt: new Date(),
    });

    return {
      _id: result.insertedId.toString(),
      ...company,
      createdAt: new Date(),
    };
  }

  async getCompany(id: string): Promise<Company | null> {
    const db = this.getDb();
    const company = await db.collection("companies").findOne({ _id: new ObjectId(id) });
    if (!company) return null;

    return {
      _id: company._id.toString(),
      name: company.name,
      country: company.country,
      currency: company.currency,
      createdAt: company.createdAt,
    };
  }

  async createUser(user: InsertUser): Promise<User> {
    const db = this.getDb();
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const result = await db.collection("users").insertOne({
      ...user,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return {
      _id: result.insertedId.toString(),
      ...user,
      password: hashedPassword,
      createdAt: new Date(),
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const db = this.getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (!user) return null;

    return {
      _id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role,
      companyId: user.companyId,
      managerId: user.managerId,
      createdAt: user.createdAt,
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const db = this.getDb();
    const user = await db.collection("users").findOne({ email });
    if (!user) return null;

    return {
      _id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role,
      companyId: user.companyId,
      managerId: user.managerId,
      createdAt: user.createdAt,
    };
  }

  async getUsersByCompany(companyId: string): Promise<User[]> {
    const db = this.getDb();
    const users = await db.collection("users").find({ companyId }).toArray();

    return users.map((user) => ({
      _id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role,
      companyId: user.companyId,
      managerId: user.managerId,
      createdAt: user.createdAt,
    }));
  }

  async updateUserRole(userId: string, role: string, managerId?: string): Promise<void> {
    const db = this.getDb();
    const update: any = { role };
    if (managerId !== undefined) {
      update.managerId = managerId;
    }
    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: update });
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }

  async createExpense(expense: InsertExpense & { employeeId: string; companyId: string }): Promise<Expense> {
    const db = this.getDb();
    const now = new Date();

    const result = await db.collection("expenses").insertOne({
      ...expense,
      date: typeof expense.date === "string" ? new Date(expense.date) : expense.date,
      status: "pending",
      currentApproverIndex: 0,
      createdAt: now,
      updatedAt: now,
    });

    return {
      _id: result.insertedId.toString(),
      employeeId: expense.employeeId,
      companyId: expense.companyId,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
      description: expense.description,
      date: typeof expense.date === "string" ? new Date(expense.date) : expense.date,
      receiptUrl: expense.receiptUrl,
      status: "pending",
      currentApproverIndex: 0,
      createdAt: now,
      updatedAt: now,
    };
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    const db = this.getDb();
    const expense = await db.collection("expenses").findOne({ _id: new ObjectId(id) });
    if (!expense) return null;

    return {
      _id: expense._id.toString(),
      employeeId: expense.employeeId,
      companyId: expense.companyId,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      receiptUrl: expense.receiptUrl,
      status: expense.status,
      currentApproverIndex: expense.currentApproverIndex,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };
  }

  async getExpensesByEmployee(employeeId: string): Promise<Expense[]> {
    const db = this.getDb();
    const expenses = await db.collection("expenses").find({ employeeId }).sort({ createdAt: -1 }).toArray();

    return expenses.map((expense) => ({
      _id: expense._id.toString(),
      employeeId: expense.employeeId,
      companyId: expense.companyId,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      receiptUrl: expense.receiptUrl,
      status: expense.status,
      currentApproverIndex: expense.currentApproverIndex,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    }));
  }

  async getExpensesByCompany(companyId: string): Promise<Expense[]> {
    const db = this.getDb();
    const expenses = await db.collection("expenses").find({ companyId }).sort({ createdAt: -1 }).toArray();

    return expenses.map((expense) => ({
      _id: expense._id.toString(),
      employeeId: expense.employeeId,
      companyId: expense.companyId,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      receiptUrl: expense.receiptUrl,
      status: expense.status,
      currentApproverIndex: expense.currentApproverIndex,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    }));
  }

  async getPendingExpensesForApprover(approverId: string): Promise<Expense[]> {
    const db = this.getDb();
    const steps = await db.collection("approvalSteps").find({ approverId, status: "pending" }).toArray();

    const expenseIds = steps.map((step) => new ObjectId(step.expenseId));
    const expenses = await db.collection("expenses").find({ _id: { $in: expenseIds } }).toArray();

    return expenses.map((expense) => ({
      _id: expense._id.toString(),
      employeeId: expense.employeeId,
      companyId: expense.companyId,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      receiptUrl: expense.receiptUrl,
      status: expense.status,
      currentApproverIndex: expense.currentApproverIndex,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    }));
  }

  async updateExpenseStatus(expenseId: string, status: string, currentApproverIndex: number): Promise<void> {
    const db = this.getDb();
    await db.collection("expenses").updateOne(
      { _id: new ObjectId(expenseId) },
      { $set: { status, currentApproverIndex, updatedAt: new Date() } }
    );
  }

  async createApprovalRule(rule: InsertApprovalRule & { companyId: string }): Promise<ApprovalRule> {
    const db = this.getDb();
    const result = await db.collection("approvalRules").insertOne({
      ...rule,
      createdAt: new Date(),
    });

    return {
      _id: result.insertedId.toString(),
      ...rule,
      createdAt: new Date(),
    };
  }

  async getApprovalRulesByCompany(companyId: string): Promise<ApprovalRule[]> {
    const db = this.getDb();
    const rules = await db.collection("approvalRules").find({ companyId }).toArray();

    return rules.map((rule) => ({
      _id: rule._id.toString(),
      companyId: rule.companyId,
      name: rule.name,
      type: rule.type,
      minAmount: rule.minAmount,
      maxAmount: rule.maxAmount,
      percentageThreshold: rule.percentageThreshold,
      specificApproverId: rule.specificApproverId,
      approverSequence: rule.approverSequence,
      isManagerApprover: rule.isManagerApprover,
      createdAt: rule.createdAt,
    }));
  }

  async getApprovalRuleForExpense(amount: number, companyId: string): Promise<ApprovalRule | null> {
    const db = this.getDb();
    const rule = await db.collection("approvalRules").findOne({
      companyId,
      $or: [
        { minAmount: { $lte: amount }, maxAmount: { $gte: amount } },
        { minAmount: { $exists: false }, maxAmount: { $exists: false } },
      ],
    });

    if (!rule) return null;

    return {
      _id: rule._id.toString(),
      companyId: rule.companyId,
      name: rule.name,
      type: rule.type,
      minAmount: rule.minAmount,
      maxAmount: rule.maxAmount,
      percentageThreshold: rule.percentageThreshold,
      specificApproverId: rule.specificApproverId,
      approverSequence: rule.approverSequence,
      isManagerApprover: rule.isManagerApprover,
      createdAt: rule.createdAt,
    };
  }

  async createApprovalStep(step: Omit<ApprovalStep, "_id">): Promise<ApprovalStep> {
    const db = this.getDb();
    const result = await db.collection("approvalSteps").insertOne(step);

    return {
      _id: result.insertedId.toString(),
      ...step,
    };
  }

  async getApprovalStepsByExpense(expenseId: string): Promise<ApprovalStep[]> {
    const db = this.getDb();
    const steps = await db.collection("approvalSteps").find({ expenseId }).sort({ sequence: 1 }).toArray();

    return steps.map((step) => ({
      _id: step._id.toString(),
      expenseId: step.expenseId,
      approverId: step.approverId,
      sequence: step.sequence,
      status: step.status,
      comment: step.comment,
      timestamp: step.timestamp,
    }));
  }

  async updateApprovalStep(stepId: string, status: string, comment?: string): Promise<void> {
    const db = this.getDb();
    const update: any = { status, timestamp: new Date() };
    if (comment) {
      update.comment = comment;
    }
    await db.collection("approvalSteps").updateOne({ _id: new ObjectId(stepId) }, { $set: update });
  }
}

export const storage = MONGODB_URI ? new MongoStorage() : new MemStorage();
