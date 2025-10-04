import { ApprovalStepper, ApprovalStep } from "../approval-stepper";

const mockSteps: ApprovalStep[] = [
  {
    id: "1",
    approver: {
      name: "John Smith",
      role: "Direct Manager",
      avatar: undefined,
    },
    status: "approved",
    comment: "Approved. Valid business expense.",
    timestamp: "2024-01-15T10:30:00",
  },
  {
    id: "2",
    approver: {
      name: "Lisa Anderson",
      role: "Finance Manager",
      avatar: undefined,
    },
    status: "current",
  },
  {
    id: "3",
    approver: {
      name: "Robert Brown",
      role: "CFO",
      avatar: undefined,
    },
    status: "pending",
  },
];

export default function ApprovalStepperExample() {
  return (
    <div className="p-6 max-w-2xl">
      <ApprovalStepper steps={mockSteps} />
    </div>
  );
}
