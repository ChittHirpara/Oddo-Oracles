import { AppSidebar } from "../app-sidebar";
import { AuthProvider } from "@/lib/auth-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

function SidebarWithAuth() {
  const { login } = useAuth();

  useEffect(() => {
    login("admin@company.com", "password");
  }, [login]);

  return <AppSidebar />;
}

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "20rem",
  };

  return (
    <AuthProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <SidebarWithAuth />
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
