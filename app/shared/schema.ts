import { z } from "zod";

export type UserRole = "admin" | "manager" | "employee";
export type ExpenseStatus = "pending" | "approved" | "rejected" | "in-review";
export type ApprovalRuleType = "percentage" | "specific_approver" | "hybrid";

export interface Company {
  _id: string;
  name: string;
  country: string;
  currency: string;
  createdAt: Date;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  companyId?: string;
  managerId?: string;
  createdAt: Date;
}

export interface Expense {
  _id: string;
  employeeId: string;
  companyId: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: Date;
  receiptUrl?: string;
  status: ExpenseStatus;
  currentApproverIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalRule {
  _id: string;
  companyId: string;
  name: string;
  type: ApprovalRuleType;
  minAmount?: number;
  maxAmount?: number;
  percentageThreshold?: number;
  specificApproverId?: string;
  approverSequence: string[];
  isManagerApprover: boolean;
  createdAt: Date;
}

export interface ApprovalStep {
  _id: string;
  expenseId: string;
  approverId: string;
  sequence: number;
  status: "pending" | "approved" | "rejected";
  comment?: string;
  timestamp?: Date;
}

export const insertCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  country: z.string().min(1, "Country is required"),
  currency: z.string().min(1, "Currency is required"),
});

export const insertUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["admin", "manager", "employee"]),
  companyId: z.string().optional(),
  managerId: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertExpenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().min(1, "Currency is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().or(z.date()),
  receiptUrl: z.string().optional(),
});

export const approvalActionSchema = z.object({
  expenseId: z.string().min(1, "Expense ID is required"),
  action: z.enum(["approve", "reject"]),
  comment: z.string().optional(),
});

export const insertApprovalRuleSchema = z.object({
  name: z.string().min(1, "Rule name is required"),
  type: z.enum(["percentage", "specific_approver", "hybrid"]),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  percentageThreshold: z.number().min(0).max(100).optional(),
  specificApproverId: z.string().optional(),
  approverSequence: z.array(z.string()),
  isManagerApprover: z.boolean().default(true),
});

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["admin", "manager", "employee"]),
  managerId: z.string().optional(),
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type ApprovalAction = z.infer<typeof approvalActionSchema>;
export type InsertApprovalRule = z.infer<typeof insertApprovalRuleSchema>;
export type UpdateUserRole = z.infer<typeof updateUserRoleSchema>;
