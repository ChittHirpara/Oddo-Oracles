import { CheckCircle2, Circle, XCircle, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ApprovalStep {
  id: string;
  approver: {
    name: string;
    role: string;
    avatar?: string;
  };
  status: "pending" | "approved" | "rejected" | "current";
  comment?: string;
  timestamp?: string;
}

interface ApprovalStepperProps {
  steps: ApprovalStep[];
}

export function ApprovalStepper({ steps }: ApprovalStepperProps) {
  return (
    <div className="space-y-4" data-testid="component-approval-stepper">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        const getStatusIcon = () => {
          switch (step.status) {
            case "approved":
              return <CheckCircle2 className="h-5 w-5 text-status-approved" />;
            case "rejected":
              return <XCircle className="h-5 w-5 text-status-rejected" />;
            case "current":
              return <Clock className="h-5 w-5 text-status-review" />;
            default:
              return <Circle className="h-5 w-5 text-muted-foreground" />;
          }
        };

        return (
          <div key={step.id} className="relative">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-card">
                  {getStatusIcon()}
                </div>
                {!isLast && (
                  <div className="w-0.5 h-full min-h-[60px] bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={step.approver.avatar} />
                    <AvatarFallback>
                      {step.approver.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{step.approver.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {step.approver.role}
                    </div>
                    {step.comment && (
                      <div className="mt-2 text-sm bg-muted p-3 rounded-md">
                        {step.comment}
                      </div>
                    )}
                    {step.timestamp && (
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(step.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
