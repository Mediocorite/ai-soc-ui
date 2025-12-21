import { createContext, useContext, useState, type ReactNode } from "react";

export type UserRole =
  | "SOC Analyst"
  | "SOC Lead"
  | "CISO"
  | "Security Engineer"
  | "Threat Researcher"
  | "Compliance/GRC"
  | "Platform Admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
