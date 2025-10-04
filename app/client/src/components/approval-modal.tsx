import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";
import { Expense } from "./expense-table";
import { ApprovalStepper, ApprovalStep } from "./approval-stepper";
import { Separator } from "@/components/ui/separator";

interface ApprovalModalProps {
  expense: Expense | null;
  approvalSteps: ApprovalStep[];
  isOpen: boolean;
  onClose: () => void;
  onApprove: (comment: string) => void;
  onReject: (comment: string) => void;
}

export function ApprovalModal({
  expense,
  isOpen,
  onClose,
  onApprove,
  onReject,
  approvalSteps,
}: ApprovalModalProps) {
  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(comment);
    setIsProcessing(false);
    setComment("");
    onClose();
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(comment);
    setIsProcessing(false);
    setComment("");
    onClose();
  };

  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Expense</DialogTitle>
          <DialogDescription>
            Review the expense details and provide your decision
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Employee</Label>
              <p className="font-medium mt-1">{expense.employee.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Amount</Label>
              <p className="font-medium font-mono mt-1">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: expense.currency,
                }).format(expense.amount)}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Category</Label>
              <p className="font-medium mt-1">{expense.category}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Date</Label>
              <p className="font-medium mt-1">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Description</Label>
            <p className="mt-1">{expense.description}</p>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-semibold mb-4 block">Approval Workflow</Label>
            <ApprovalStepper steps={approvalSteps} />
          </div>

          <Separator />

          <div>
            <Label htmlFor="comment">Your Comment</Label>
            <Textarea
              id="comment"
              placeholder="Add a comment (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2"
              data-testid="input-approval-comment"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            data-testid="button-cancel-approval"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isProcessing}
            data-testid="button-reject-expense"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isProcessing}
            className="bg-status-approved hover:bg-status-approved/90"
            data-testid="button-approve-expense"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
