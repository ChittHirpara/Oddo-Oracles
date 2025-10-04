import AuthPage from "../auth-page";
import { AuthProvider } from "@/lib/auth-context";

export default function AuthPageExample() {
  return (
    <AuthProvider>
      <AuthPage />
    </AuthProvider>
  );
}
