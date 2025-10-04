import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/dashboard-admin";
import ManagerDashboard from "@/pages/dashboard-manager";
import EmployeeDashboard from "@/pages/dashboard-employee";
import SubmitExpensePage from "@/pages/submit-expense";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/auth" />;
  }

  return <>{children}</>;
}

function DashboardRouter() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminDashboard />;
  } else if (user?.role === "manager") {
    return <ManagerDashboard />;
  } else {
    return <EmployeeDashboard />;
  }
}

function AppLayout() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route>
          <Redirect to="/auth" />
        </Route>
      </Switch>
    );
  }

  const style = {
    "--sidebar-width": "20rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                data-testid="button-logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-8 bg-background">
            <div className="max-w-7xl mx-auto">
              <Switch>
                <Route path="/" component={DashboardRouter} />
                <Route path="/submit" component={SubmitExpensePage} />
                <Route path="/my-expenses" component={EmployeeDashboard} />
                <Route path="/expenses" component={AdminDashboard} />
                <Route path="/approvals" component={ManagerDashboard} />
                <Route path="/team">
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Team Management</h2>
                    <p className="text-muted-foreground mt-2">Coming soon...</p>
                  </div>
                </Route>
                <Route path="/rules">
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Approval Rules</h2>
                    <p className="text-muted-foreground mt-2">Coming soon...</p>
                  </div>
                </Route>
                <Route path="/analytics">
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Analytics</h2>
                    <p className="text-muted-foreground mt-2">Coming soon...</p>
                  </div>
                </Route>
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <AppLayout />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
