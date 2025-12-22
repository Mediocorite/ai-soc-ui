import { useAuth } from "../../hooks/useAuth";
import { getRoleConfig } from "../../config/roleConfig";
import { StandardDashboard } from "./StandardDashboard";
import { AnalystDashboard } from "./AnalystDashboard";
import { LeadDashboard } from "./LeadDashboard";

export function DashboardHub() {
  const { user } = useAuth();
  const config = getRoleConfig(user?.role);

  switch (config.dashboard) {
    case "analyst":
      return <AnalystDashboard />;
    case "lead":
      return <LeadDashboard />;
    default:
      return <StandardDashboard />;
  }
}
