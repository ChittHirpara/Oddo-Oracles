import { Badge } from "@/components/ui/badge";
import { Shield, Users, User } from "lucide-react";
import { UserRole } from "@/lib/auth-context";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const variants = {
    admin: {
      icon: Shield,
      label: "Admin",
      className: "bg-role-admin text-role-admin-foreground",
    },
    manager: {
      icon: Users,
      label: "Manager",
      className: "bg-role-manager text-role-manager-foreground",
    },
    employee: {
      icon: User,
      label: "Employee",
      className: "bg-role-employee text-role-employee-foreground",
    },
  };

  const config = variants[role];
  const Icon = config.icon;

  return (
    <Badge
      className={`${config.className} ${className}`}
      data-testid={`badge-role-${role}`}
    >
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
