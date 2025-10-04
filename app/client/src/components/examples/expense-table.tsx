import { ExpenseTable, Expense } from "../expense-table";

const mockExpenses: Expense[] = [
  {
    _id: "1",
    employee: { name: "Sarah Johnson", avatar: undefined },
    amount: 1250.00,
    currency: "USD",
    category: "Travel",
    description: "Flight to client meeting in NYC",
    date: "2024-01-15",
    status: "approved",
  },
  {
    _id: "2",
    employee: { name: "Michael Chen", avatar: undefined },
    amount: 85.50,
    currency: "USD",
    category: "Meals",
    description: "Team dinner with prospects",
    date: "2024-01-14",
    status: "pending",
  },
  {
    _id: "3",
    employee: { name: "Emily Davis", avatar: undefined },
    amount: 450.00,
    currency: "USD",
    category: "Software",
    description: "Annual Adobe Creative Cloud subscription",
    date: "2024-01-12",
    status: "in-review",
  },
  {
    _id: "4",
    employee: { name: "James Wilson", avatar: undefined },
    amount: 2100.00,
    currency: "USD",
    category: "Equipment",
    description: "New laptop for development work",
    date: "2024-01-10",
    status: "rejected",
  },
];

export default function ExpenseTableExample() {
  return (
    <div className="p-6">
      <ExpenseTable
        expenses={mockExpenses}
        onView={(expense) => console.log("View expense:", expense)}
      />
    </div>
  );
}
