import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  count?: number;
  variant?: "default" | "primary" | "warning" | "success";
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  count,
  variant = "default",
}: QuickActionCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "border-primary/50 bg-primary/5 hover:bg-primary/10";
      case "warning":
        return "border-status-pending/50 bg-status-pending/5 hover:bg-status-pending/10";
      case "success":
        return "border-status-approved/50 bg-status-approved/5 hover:bg-status-approved/10";
      default:
        return "hover-elevate";
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all ${getVariantStyles()}`}
      onClick={onClick}
      data-testid={`card-quick-action-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-md bg-background flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              {count !== undefined && (
                <div className="text-3xl font-bold">{count}</div>
              )}
            </div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
