import {
  Home,
  Receipt,
  CheckSquare,
  Users,
  Settings,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useLocation, Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { RoleBadge } from "./role-badge";
import { Separator } from "@/components/ui/separator";

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const adminItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "All Expenses", url: "/expenses", icon: FileText },
    { title: "Team Management", url: "/team", icon: Users },
    { title: "Approval Rules", url: "/rules", icon: Settings },
    { title: "Analytics", url: "/analytics", icon: TrendingUp },
  ];

  const managerItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Pending Approvals", url: "/approvals", icon: CheckSquare },
    { title: "Team Expenses", url: "/expenses", icon: FileText },
    { title: "My Expenses", url: "/my-expenses", icon: Receipt },
  ];

  const employeeItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "My Expenses", url: "/my-expenses", icon: Receipt },
    { title: "Submit Expense", url: "/submit", icon: FileText },
  ];

  const items =
    user?.role === "admin"
      ? adminItems
      : user?.role === "manager"
      ? managerItems
      : employeeItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
            <Receipt className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">ExpenseFlow</h2>
            <p className="text-xs text-muted-foreground">
              {user?.companyCurrency || "USD"}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6">
        <div className="space-y-2">
          <div className="text-sm font-medium">{user?.name}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
          {user && <RoleBadge role={user.role} />}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
