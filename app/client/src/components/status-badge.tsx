import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, Eye } from "lucide-react";

export type ExpenseStatus = "pending" | "approved" | "rejected" | "in-review";

interface StatusBadgeProps {
  status: ExpenseStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-status-pending text-status-pending-foreground",
    },
    approved: {
      icon: CheckCircle2,
      label: "Approved",
      className: "bg-status-approved text-status-approved-foreground",
    },
    rejected: {
      icon: XCircle,
      label: "Rejected",
      className: "bg-status-rejected text-status-rejected-foreground",
    },
    "in-review": {
      icon: Eye,
      label: "In Review",
      className: "bg-status-review text-status-review-foreground",
    },
  };

  const config = variants[status];
  const Icon = config.icon;

  return (
    <Badge
      className={`${config.className} ${className}`}
      data-testid={`badge-status-${status}`}
    >
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
