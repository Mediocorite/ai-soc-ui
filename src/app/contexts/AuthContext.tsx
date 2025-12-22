import { useState, type ReactNode } from "react";
import type { User, UserRole } from "../types/auth";
import { AuthContext } from "../hooks/useAuth";

const roleHierarchy: Record<UserRole, number> = {
  "SOC Analyst": 1,
  "SOC Lead": 2,
  "Security Engineer": 3,
  "Threat Researcher": 4,
  "Compliance/GRC": 5,
  CISO: 6,
  "Platform Admin": 7,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: string = "",
    role: UserRole = "SOC Analyst"
  ) => {
    // Mock authentication - in production, this would call your backend
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };

    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
