import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/auth-context";

interface PageHeaderProps {
  title: string;
  description: string;
  role?: UserRole;
  actions?: React.ReactNode;
  stats?: {
    label: string;
    value: string;
    icon?: LucideIcon;
  }[];
}

export function PageHeader({ title, description, role, actions, stats }: PageHeaderProps) {
  const getRoleGradient = () => {
    switch (role) {
      case "admin":
        return "from-role-admin/10 to-transparent";
      case "manager":
        return "from-role-manager/10 to-transparent";
      case "employee":
        return "from-role-employee/10 to-transparent";
      default:
        return "from-primary/5 to-transparent";
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getRoleGradient()} border-l-4 ${
      role === "admin" ? "border-role-admin" :
      role === "manager" ? "border-role-manager" :
      role === "employee" ? "border-role-employee" :
      "border-primary"
    } rounded-lg p-8 mb-8`}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3">
              {stat.icon && (
                <div className="h-10 w-10 rounded-md bg-card flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
