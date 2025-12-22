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

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRole: UserRole) => boolean;
}
