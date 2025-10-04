import { useState } from "react";
import { ApprovalModal } from "../approval-modal";
import { Button } from "@/components/ui/button";
import { Expense } from "../expense-table";
import { ApprovalStep } from "../approval-stepper";

const mockExpense: Expense = {
  _id: "1",
  employee: { name: "Sarah Johnson" },
  amount: 1250.0,
  currency: "USD",
  category: "Travel",
  description: "Flight to client meeting in NYC",
  date: "2024-01-15",
  status: "pending",
};

const mockSteps: ApprovalStep[] = [
  {
    id: "1",
    approver: { name: "John Smith", role: "Direct Manager" },
    status: "approved",
    comment: "Approved. Valid business expense.",
    timestamp: "2024-01-15T10:30:00",
  },
  {
    id: "2",
    approver: { name: "Lisa Anderson", role: "Finance Manager" },
    status: "current",
  },
];

export default function ApprovalModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setIsOpen(true)}>Open Approval Modal</Button>
      <ApprovalModal
        expense={mockExpense}
        approvalSteps={mockSteps}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApprove={(comment) => console.log("Approved:", comment)}
        onReject={(comment) => console.log("Rejected:", comment)}
      />
    </div>
  );
}
