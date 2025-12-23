import type { Alert } from "../../../../types/dashboard";
import { SEVERITY_COLORS, SEVERITY_ORDER } from "../../data/constants";

interface AlertFeedProps {
  alerts: Alert[];
  selectedId: string;
  onSelect: (alert: Alert) => void;
}

const AlertFeed: React.FC<AlertFeedProps> = ({
  alerts,
  selectedId,
  onSelect,
}) => {
  const sortedAlerts = [...alerts].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  return (
    <div className="flex flex-col h-full bg-card border-r border-border lg:w-80 w-full shrink-0">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-bold text-foreground uppercase tracking-wider text-xs">
          Alert Queue
        </h2>
        <span className="bg-muted px-2 py-0.5 rounded text-[10px] text-muted-foreground font-mono">
          {alerts.length} Active
        </span>
      </div>
      <div className="overflow-y-auto flex-1 p-2 space-y-2">
        {sortedAlerts.map((alert) => (
          <button
            key={alert.id}
            onClick={() => onSelect(alert)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group ${
              selectedId === alert.id
                ? "bg-muted border-indigo-500 shadow-lg shadow-indigo-500/10"
                : "bg-background border-border hover:border-accent hover:bg-muted/50"
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                  SEVERITY_COLORS[alert.severity]
                }`}
              >
                {alert.severity}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(alert.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <h3
              className={`text-sm font-semibold mb-2 line-clamp-2 ${
                selectedId === alert.id
                  ? "text-foreground font-bold"
                  : "text-card-foreground"
              }`}
            >
              {alert.title}
            </h3>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${alert.confidenceScore * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {(alert.confidenceScore * 100).toFixed(0)}% AI
                </span>
              </div>
              <span
                className={`text-[10px] ${
                  alert.status === "Open" ? "text-indigo-400" : "text-slate-500"
                }`}
              >
                {alert.status}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlertFeed;
