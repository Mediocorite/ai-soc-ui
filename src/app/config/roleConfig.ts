import {
  Home,
  Sparkles,
  BarChart3,
  Users,
  Settings,
  FileText,
  Database,
  Shield,
  Zap,
  Eye,
  Lock,
  AlertCircle,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import type { UserRole } from "../types/auth";

export type DashboardType =
  | "SOCAnalystDashboard"
  | "SOCLeadDashboard"
  | "PlatformAdminDashboard"
  | "CISODashboard"
  | "SecurityEngineerDashboard"
  | "ThreatResearcherDashboard"
  | "ComplianceGRCDashboard";

export interface NavItemConfig {
  icon: any;
  label: string;
  shortcut: string;
  href: string;
}

export interface RoleConfiguration {
  dashboard: DashboardType;
  navigation: NavItemConfig[];
}

const COMMON_NAV: NavItemConfig[] = [
  { icon: Home, label: "Dashboard", shortcut: "D", href: "/" },
];

const ANALYST_NAV: NavItemConfig[] = [
  ...COMMON_NAV,
  { icon: Sparkles, label: "AI Studio", shortcut: "A", href: "/ai-studio" },
  { icon: AlertCircle, label: "Incidents", shortcut: "I", href: "/incidents" },
  { icon: Database, label: "Data", shortcut: "T", href: "/data" },
];

const LEAD_NAV: NavItemConfig[] = [
  ...ANALYST_NAV,
  { icon: BarChart3, label: "Analytics", shortcut: "L", href: "/analytics" },
  { icon: Users, label: "Team", shortcut: "M", href: "/team" },
];

const ADMIN_NAV: NavItemConfig[] = [
  ...LEAD_NAV,
  { icon: Settings, label: "Settings", shortcut: "S", href: "/settings" },
];

export const roleConfig: Record<UserRole, RoleConfiguration> = {
  "SOC Analyst": {
    dashboard: "SOCAnalystDashboard",
    navigation: ANALYST_NAV,
  },
  "SOC Lead": {
    dashboard: "SOCLeadDashboard",
    navigation: LEAD_NAV,
  },
  "Platform Admin": {
    dashboard: "PlatformAdminDashboard",
    navigation: ADMIN_NAV,
  },
  CISO: {
    dashboard: "CISODashboard",
    navigation: [
      ...COMMON_NAV,
      { icon: Lock, label: "Security", shortcut: "P", href: "/security" },
    ],
  },
  "Security Engineer": {
    dashboard: "SecurityEngineerDashboard",
    navigation: LEAD_NAV,
  },
  "Threat Researcher": {
    dashboard: "ThreatResearcherDashboard",
    navigation: ANALYST_NAV,
  },
  "Compliance/GRC": {
    dashboard: "ComplianceGRCDashboard",
    navigation: [
      ...COMMON_NAV,
      {
        icon: CheckCircle,
        label: "Compliance",
        shortcut: "C",
        href: "/compliance",
      },
    ],
  },
};

export const defaultRoleConfig: RoleConfiguration = {
  dashboard: "SOCAnalystDashboard",
  navigation: COMMON_NAV,
};

export function getRoleConfig(role?: UserRole): RoleConfiguration {
  if (!role || !roleConfig[role]) {
    return defaultRoleConfig;
  }
  return roleConfig[role];
}
