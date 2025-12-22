import { ReactNode } from "react";
import { useAuth } from "./contexts/AuthContext";

interface RequireAuthProps {
  children: ReactNode;
  requiredRole?: string; // will tighten to UserRole after role normalization
  onUnauthenticated?: () => void;
}

// Lightweight guard component that checks authentication and permission.
// When TanStack Router is wired, this can be used as a route `component`/`loader`
// to redirect unauthenticated users to `/login` and to enforce RBAC via `requiredRole`.
export function RequireAuth({
  children,
  requiredRole,
  onUnauthenticated,
}: RequireAuthProps) {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    onUnauthenticated?.();
    return null;
  }

  if (requiredRole && !hasPermission(requiredRole as any)) {
    // Deny access UI — can be replaced with redirect when router is wired
    return <div className="p-8">Access denied: insufficient permissions</div>;
  }

  return <>{children}</>;
}

export default RequireAuth;
