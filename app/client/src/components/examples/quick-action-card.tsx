import { QuickActionCard } from "../quick-action-card";
import { Clock, CheckCircle2, FileText } from "lucide-react";

export default function QuickActionCardExample() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <QuickActionCard
        title="Pending Approvals"
        description="Review and approve team expenses"
        icon={Clock}
        count={8}
        variant="warning"
        onClick={() => console.log("Navigate to pending approvals")}
      />
      <QuickActionCard
        title="Submit Expense"
        description="Create a new expense claim"
        icon={FileText}
        variant="primary"
        onClick={() => console.log("Navigate to submit")}
      />
      <QuickActionCard
        title="Approved Today"
        description="View recently approved expenses"
        icon={CheckCircle2}
        count={12}
        variant="success"
        onClick={() => console.log("Navigate to approved")}
      />
    </div>
  );
}
