import { StatCard } from "@/components/stat-card";
import { ExpenseTableEnhanced, Expense } from "@/components/expense-table-enhanced";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, Users, AlertTriangle, TrendingDown } from "lucide-react";
import { useState } from "react";
import { ApprovalModal } from "@/components/approval-modal";
import { PageHeader } from "@/components/page-header";
import { FilterToolbar } from "@/components/filter-toolbar";
import { QuickActionCard } from "@/components/quick-action-card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export default function ManagerDashboard() {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<any>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingData, isLoading } = useQuery({
    queryKey: ["/api/expenses/pending"],
    queryFn: () => apiRequest("/api/expenses/pending"),
  });

  const { data: approvalStepsData } = useQuery({
    queryKey: ["/api/expenses", selectedExpense?._id, "approvals"],
    queryFn: () => apiRequest(`/api/expenses/${selectedExpense?._id}/approvals`),
    enabled: !!selectedExpense,
  });

  const approveMutation = useMutation({
    mutationFn: (data: { expenseId: string; action: string; comment?: string }) =>
      apiRequest("/api/expenses/approve", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses/pending"] });
      toast({
        title: "Success",
        description: "Expense has been processed.",
      });
    },
  });

  const pendingExpenses = pendingData?.expenses || [];
  const approvalSteps = approvalStepsData?.steps || [];

  const filteredExpenses = pendingExpenses.filter((expense: any) => {
    if (statusFilter !== "all" && expense.status !== statusFilter) return false;
    if (categoryFilter !== "all" && expense.category !== categoryFilter) return false;
    if (searchValue && !expense.description.toLowerCase().includes(searchValue.toLowerCase())) return false;
    return true;
  });

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleApprove = (expense: Expense) => {
    approveMutation.mutate({
      expenseId: expense._id,
      action: "approve",
    });
  };

  const handleReject = (expense: Expense) => {
    approveMutation.mutate({
      expenseId: expense._id,
      action: "reject",
    });
  };

  const handleModalApprove = (comment: string) => {
    if (selectedExpense) {
      approveMutation.mutate({
        expenseId: selectedExpense._id,
        action: "approve",
        comment,
      });
      setIsModalOpen(false);
    }
  };

  const handleModalReject = (comment: string) => {
    if (selectedExpense) {
      approveMutation.mutate({
        expenseId: selectedExpense._id,
        action: "reject",
        comment,
      });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manager Dashboard"
        description="Review and approve team expenses efficiently"
        role="manager"
        stats={[
          { label: "Pending", value: pendingExpenses.length.toString(), icon: Clock },
          { label: "Approved Today", value: "12", icon: CheckCircle2 },
          { label: "Team Members", value: "15", icon: Users },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActionCard
          title="Urgent Approvals"
          description="Expenses pending for 5+ days"
          icon={AlertTriangle}
          count={3}
          variant="warning"
          onClick={() => console.log("Navigate to urgent")}
        />
        <QuickActionCard
          title="Quick Approve"
          description="Auto-approve eligible expenses"
          icon={CheckCircle2}
          variant="success"
          onClick={() => console.log("Quick approve")}
        />
        <QuickActionCard
          title="Team Overview"
          description="View team spending patterns"
          icon={TrendingDown}
          variant="default"
          onClick={() => console.log("Navigate to team")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Approvals"
          value={pendingExpenses.length.toString()}
          icon={Clock}
          subtitle="Requires action"
        />
        <StatCard
          title="Approved Today"
          value="12"
          icon={CheckCircle2}
        />
        <StatCard
          title="Rejected This Week"
          value="3"
          icon={XCircle}
        />
        <StatCard
          title="Team Members"
          value="15"
          icon={Users}
        />
      </div>

      <Card className="border-status-pending/50 bg-status-pending/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Approvals
          </CardTitle>
          <CardDescription>
            Review and take action on expenses awaiting your approval
          </CardDescription>
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
            <ExpenseTableEnhanced
              expenses={filteredExpenses}
              showInlineActions={true}
              onView={handleViewExpense}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </CardContent>
      </Card>

      <ApprovalModal
        expense={selectedExpense}
        approvalSteps={approvalSteps}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleModalApprove}
        onReject={handleModalReject}
      />
    </div>
  );
}
