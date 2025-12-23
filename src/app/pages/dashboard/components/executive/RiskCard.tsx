import type { RiskMetric } from "../../../../types/dashboard";

interface RiskCardProps {
  metric: RiskMetric;
  onClick: (metric: RiskMetric) => void;
}

const RiskCard: React.FC<RiskCardProps> = ({ metric, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "text-red-600 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-700";
      case "Warning":
        return "text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700";
      case "Healthy":
        return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700";
      default:
        return "text-muted-foreground bg-muted border-border hover:border-accent";
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "↗";
    if (trend === "down") return "↘";
    return "→";
  };

  return (
    <button
      onClick={() => onClick(metric)}
      className={`w-full text-left p-6 rounded-xl border transition-all duration-300 hover:shadow-lg group ${getStatusColor(
        metric.status
      )}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
          {metric.domain}
        </h3>
        <span className="text-xl font-bold">{getTrendIcon(metric.trend)}</span>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-4xl font-bold tracking-tight">
          {metric.score}
        </span>
        <span className="text-sm font-medium opacity-80">/ 100</span>
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-xs font-medium uppercase tracking-widest opacity-70">
          Status: {metric.status}
        </p>
        <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">
          View Detail +
        </span>
      </div>
    </button>
  );
};

export default RiskCard;
