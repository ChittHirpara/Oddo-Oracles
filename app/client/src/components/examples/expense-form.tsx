import { ExpenseForm } from "../expense-form";

export default function ExpenseFormExample() {
  return (
    <div className="p-6 max-w-3xl">
      <ExpenseForm
        onSubmit={(data) => {
          console.log("Form submitted:", data);
          alert("Expense submitted successfully!");
        }}
        defaultCurrency="USD"
      />
    </div>
  );
}
