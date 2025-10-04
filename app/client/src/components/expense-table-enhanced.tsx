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
import { Eye, CheckCircle2, XCircle, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface ExpenseTableEnhancedProps {
  expenses: Expense[];
  onView?: (expense: Expense) => void;
  onApprove?: (expense: Expense) => void;
  onReject?: (expense: Expense) => void;
  showInlineActions?: boolean;
}

export function ExpenseTableEnhanced({
  expenses,
  onView,
  onApprove,
  onReject,
  showInlineActions = false,
}: ExpenseTableEnhancedProps) {
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
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Employee</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                No expenses found
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense._id} data-testid={`row-expense-${expense._id}`} className="hover-elevate">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-2 border-border">
                      <AvatarImage src={expense.employee.avatar} />
                      <AvatarFallback className="text-xs font-medium">
                        {expense.employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{expense.employee.name}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">{expense.description}</div>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-sm">
                    {expense.category}
                  </div>
                </TableCell>
                <TableCell className="font-mono font-semibold">
                  {formatCurrency(expense.amount, expense.currency)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(expense.date)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={expense.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {showInlineActions && expense.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onApprove?.(expense)}
                          className="text-status-approved hover:bg-status-approved/10"
                          data-testid={`button-approve-inline-${expense._id}`}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReject?.(expense)}
                          className="text-status-rejected hover:bg-status-rejected/10"
                          data-testid={`button-reject-inline-${expense._id}`}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`button-actions-${expense._id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(expense)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
