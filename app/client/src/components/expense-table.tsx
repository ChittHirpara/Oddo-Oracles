import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge, ExpenseStatus } from "./status-badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Expense {
  _id: string;
  employee: {
    name: string;
    avatar?: string;
  };
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  status: ExpenseStatus;
}

interface ExpenseTableProps {
  expenses: Expense[];
  onView?: (expense: Expense) => void;
}

export function ExpenseTable({ expenses, onView }: ExpenseTableProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-md border border-card-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense._id} data-testid={`row-expense-${expense._id}`}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={expense.employee.avatar} />
                    <AvatarFallback>
                      {expense.employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{expense.employee.name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {expense.description}
              </TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell className="font-mono font-medium">
                {formatCurrency(expense.amount, expense.currency)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(expense.date)}
              </TableCell>
              <TableCell>
                <StatusBadge status={expense.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView?.(expense)}
                    data-testid={`button-view-${expense._id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid={`button-download-${expense._id}`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
