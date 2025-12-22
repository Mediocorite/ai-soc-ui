import { useAuth } from "../../hooks/useAuth";
import { getRoleConfig } from "../../config/roleConfig";
import SocAnalystDashboard from "./soc-analyst-dashboard";
import CISODashboard from "./ciso-dashboard";
import SocLeadDashboard from "./soc-lead-dashboard";
import PlatformAdminDashboard from "./platform-admin-dashboard";
import SecurityEngineerDashboard from "./security-engineer-dashboard";
import ThreatResearcherDashboard from "./threat-researcher-dashboard";
import ComplianceGRCDashboard from "./compliance-grc-dashboard";

export function DashboardHub() {
  const { user } = useAuth();
  const config = getRoleConfig(user?.role);

  switch (config.dashboard) {
    case "SOCAnalystDashboard":
      return <SocAnalystDashboard />;
    case "CISODashboard":
      return <CISODashboard />;
    case "SOCLeadDashboard":
      return <SocLeadDashboard />;
    case "PlatformAdminDashboard":
      return <PlatformAdminDashboard />;
    case "SecurityEngineerDashboard":
      return <SecurityEngineerDashboard />;
    case "ThreatResearcherDashboard":
      return <ThreatResearcherDashboard />;
    case "ComplianceGRCDashboard":
      return <ComplianceGRCDashboard />;
    default:
      return <SocAnalystDashboard />;
  }
}
