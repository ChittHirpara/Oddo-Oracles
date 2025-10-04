import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseForm } from "@/components/expense-form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export default function SubmitExpensePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("/api/expenses", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          date: new Date(data.date).toISOString(),
          amount: parseFloat(data.amount),
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses/my"] });
      toast({
        title: "Expense Submitted",
        description: "Your expense has been submitted for approval.",
      });
      setTimeout(() => {
        setLocation("/my-expenses");
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Submit Expense</h1>
        <p className="text-muted-foreground mt-1">
          Create a new expense claim for reimbursement
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>
            Fill in the details below. Upload a receipt for automatic field population via OCR.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
