import { ExpenseTableEnhanced, Expense } from "../expense-table-enhanced";

const mockExpenses: Expense[] = [
  {
    _id: "1",
    employee: { name: "Sarah Johnson" },
    amount: 1250.0,
    currency: "USD",
    category: "Travel",
    description: "Flight to client meeting in NYC",
    date: "2024-01-15",
    status: "pending",
  },
  {
    _id: "2",
    employee: { name: "Michael Chen" },
    amount: 85.5,
    currency: "USD",
    category: "Meals",
    description: "Team dinner with prospects",
    date: "2024-01-14",
    status: "approved",
  },
];

export default function ExpenseTableEnhancedExample() {
  return (
    <div className="p-6">
      <ExpenseTableEnhanced
        expenses={mockExpenses}
        showInlineActions={true}
        onView={(e) => console.log("View:", e)}
        onApprove={(e) => console.log("Approve:", e)}
        onReject={(e) => console.log("Reject:", e)}
      />
    </div>
  );
}
