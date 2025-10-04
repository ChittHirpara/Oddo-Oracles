import { StatCard } from "@/components/stat-card";
import { ExpenseTableEnhanced, Expense } from "@/components/expense-table-enhanced";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, CheckCircle2, Plus, FileText, Receipt, History } from "lucide-react";
import { useLocation } from "wouter";
import { PageHeader } from "@/components/page-header";
import { QuickActionCard } from "@/components/quick-action-card";
import { useState } from "react";
import { FilterToolbar } from "@/components/filter-toolbar";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export default function EmployeeDashboard() {
  const [, setLocation] = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<any>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: expensesData, isLoading } = useQuery({
    queryKey: ["/api/expenses/my"],
    queryFn: () => apiRequest("/api/expenses/my"),
  });

  const myExpenses = expensesData?.expenses || [];

  const thisMonthExpenses = myExpenses.filter((e: any) => {
    const expenseDate = new Date(e.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  });

  const totalThisMonth = thisMonthExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  const pendingCount = myExpenses.filter((e: any) => e.status === "pending" || e.status === "in-review").length;
  const approvedCount = myExpenses.filter((e: any) => e.status === "approved").length;

  const filteredExpenses = myExpenses.filter((expense: any) => {
    if (statusFilter !== "all" && expense.status !== statusFilter) return false;
    if (categoryFilter !== "all" && expense.category !== categoryFilter) return false;
    if (searchValue && !expense.description.toLowerCase().includes(searchValue.toLowerCase())) return false;
    return true;
  });

  const recentExpenses = myExpenses.slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Dashboard"
        description="Track your expenses and submit new claims"
        role="employee"
        actions={
          <Button onClick={() => setLocation("/submit")} size="lg" data-testid="button-submit-expense">
            <Plus className="h-5 w-5 mr-2" />
            Submit Expense
          </Button>
        }
        stats={[
          { label: "This Month", value: `$${totalThisMonth.toFixed(0)}`, icon: DollarSign },
          { label: "Pending", value: pendingCount.toString(), icon: Clock },
          { label: "Approved", value: approvedCount.toString(), icon: CheckCircle2 },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActionCard
          title="Submit New Expense"
          description="Create a claim with receipt upload"
          icon={FileText}
          variant="primary"
          onClick={() => setLocation("/submit")}
        />
        <QuickActionCard
          title="Pending Review"
          description="Track approval status"
          icon={Clock}
          count={pendingCount}
          variant="warning"
          onClick={() => console.log("Filter to pending")}
        />
        <QuickActionCard
          title="Expense History"
          description="View all past claims"
          icon={History}
          variant="default"
          onClick={() => console.log("View history")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total This Month"
          value={`$${totalThisMonth.toFixed(2)}`}
          icon={DollarSign}
        />
        <StatCard
          title="Pending Review"
          value={pendingCount.toString()}
          icon={Clock}
          subtitle="Awaiting approval"
        />
        <StatCard
          title="Approved"
          value={approvedCount.toString()}
          icon={CheckCircle2}
          subtitle="This month"
        />
      </div>

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Reimbursement Timeline
              </CardTitle>
              <CardDescription className="mt-1">
                Track your recent expense claims and their approval status
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setLocation("/submit")} data-testid="button-new-claim">
              <Plus className="h-4 w-4 mr-2" />
              New Claim
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExpenses.map((expense: any, index: number) => (
              <div key={expense._id} className="flex items-center gap-4 p-4 rounded-lg bg-background border border-border hover-elevate">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-mono font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{expense.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: expense.currency,
                    }).format(expense.amount)}
                  </div>
                  <div className="mt-1">
                    <div className="inline-block">
                      {expense.status === "approved" && (
                        <div className="flex items-center gap-1 text-status-approved text-sm">
                          <CheckCircle2 className="h-3 w-3" />
                          Approved
                        </div>
                      )}
                      {expense.status === "pending" && (
                        <div className="flex items-center gap-1 text-status-pending text-sm">
                          <Clock className="h-3 w-3" />
                          Pending
                        </div>
                      )}
                      {expense.status === "in-review" && (
                        <div className="flex items-center gap-1 text-status-review text-sm">
                          <Clock className="h-3 w-3" />
                          In Review
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All My Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />
          {isLoading ? (
            <div className="text-center py-12">Loading expenses...</div>
          ) : (
            <ExpenseTableEnhanced expenses={filteredExpenses} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
