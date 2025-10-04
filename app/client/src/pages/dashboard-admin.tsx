import { StatCard } from "@/components/stat-card";
import { ExpenseTableEnhanced, Expense } from "@/components/expense-table-enhanced";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, CheckCircle2, Users, Plus, Settings, TrendingUp, AlertCircle } from "lucide-react";
import { useState } from "react";
import { ApprovalModal } from "@/components/approval-modal";
import { PageHeader } from "@/components/page-header";
import { FilterToolbar } from "@/components/filter-toolbar";
import { QuickActionCard } from "@/components/quick-action-card";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export default function AdminDashboard() {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<any>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: expensesData, isLoading } = useQuery({
    queryKey: ["/api/expenses"],
    queryFn: () => apiRequest("/api/expenses"),
  });

  const { data: approvalStepsData } = useQuery({
    queryKey: ["/api/expenses", selectedExpense?._id, "approvals"],
    queryFn: () => apiRequest(`/api/expenses/${selectedExpense?._id}/approvals`),
    enabled: !!selectedExpense,
  });

  const expenses = expensesData?.expenses || [];
  const approvalSteps = approvalStepsData?.steps || [];

  const pendingCount = expenses.filter((e: any) => e.status === "pending" || e.status === "in-review").length;
  const approvedCount = expenses.filter((e: any) => e.status === "approved").length;
  const totalAmount = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter((expense: any) => {
    if (statusFilter !== "all" && expense.status !== statusFilter) return false;
    if (categoryFilter !== "all" && expense.category !== categoryFilter) return false;
    if (searchValue && !expense.description.toLowerCase().includes(searchValue.toLowerCase())) return false;
    return true;
  });

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="Comprehensive expense management and team oversight"
        role="admin"
        actions={
          <>
            <Button variant="outline" data-testid="button-add-user">
              <Users className="h-4 w-4 mr-2" />
              Add User
            </Button>
            <Button data-testid="button-configure-rules">
              <Settings className="h-4 w-4 mr-2" />
              Configure Rules
            </Button>
          </>
        }
        stats={[
          { label: "Total Expenses", value: `$${(totalAmount / 1000).toFixed(1)}K`, icon: DollarSign },
          { label: "Pending", value: pendingCount.toString(), icon: Clock },
          { label: "Approved", value: approvedCount.toString(), icon: CheckCircle2 },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActionCard
          title="Review Compliance"
          description="Check policy violations and flagged items"
          icon={AlertCircle}
          count={5}
          variant="warning"
          onClick={() => console.log("Navigate to compliance")}
        />
        <QuickActionCard
          title="Approval Settings"
          description="Configure workflows and thresholds"
          icon={Settings}
          variant="default"
          onClick={() => console.log("Navigate to settings")}
        />
        <QuickActionCard
          title="Analytics"
          description="View spending trends and insights"
          icon={TrendingUp}
          variant="success"
          onClick={() => console.log("Navigate to analytics")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total This Month"
          value={`$${totalAmount.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Pending Approval"
          value={pendingCount.toString()}
          icon={Clock}
          subtitle="Requires action"
        />
        <StatCard
          title="Approved This Month"
          value={approvedCount.toString()}
          icon={CheckCircle2}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Active Employees"
          value="42"
          icon={Users}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            onExport={() => console.log("Exporting...")}
          />
          {isLoading ? (
            <div className="text-center py-12">Loading expenses...</div>
          ) : (
            <ExpenseTableEnhanced
              expenses={filteredExpenses}
              onView={handleViewExpense}
            />
          )}
        </CardContent>
      </Card>

      <ApprovalModal
        expense={selectedExpense}
        approvalSteps={approvalSteps}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={(comment) => console.log("Approved:", comment)}
        onReject={(comment) => console.log("Rejected:", comment)}
      />
    </div>
  );
}
