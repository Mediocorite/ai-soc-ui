import React, { useState, useEffect } from "react";
import type { Alert } from "../../../../types/dashboard";
import { SEVERITY_COLORS } from "../../data/constants";
import { geminiService } from "../../../../services/geminiService";

interface AlertDetailsProps {
  alert: Alert;
  onAction: (status: Alert["status"]) => void;
}

const AlertDetails: React.FC<AlertDetailsProps> = ({ alert, onAction }) => {
  const [summary, setSummary] = useState<{
    what: string;
    why: string;
    evidence: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "summary" | "timeline" | "entities"
  >("summary");

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      const res = await geminiService.generateAlertSummary(alert);
      setSummary(res);
      setLoading(false);
    };
    fetchSummary();
  }, [alert.id, alert]);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded border uppercase ${
              SEVERITY_COLORS[alert.severity]
            }`}
          >
            {alert.severity} Severity
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            ID: {alert.id}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {alert.title}
        </h1>
        <div className="text-sm text-slate-400 flex items-center gap-4">
          <span>Detected: {new Date(alert.timestamp).toLocaleString()}</span>
          <span>•</span>
          <span className="text-indigo-400 font-medium">
            Confidence: {(alert.confidenceScore * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-6 border-b border-border">
          {(["summary", "timeline", "entities"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? "text-indigo-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[300px]">
          {activeTab === "summary" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-20 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-20 bg-muted rounded animate-pulse" />
                </div>
              ) : (
                summary && (
                  <>
                    <div>
                      <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                        What happened
                      </h3>
                      <p className="text-slate-300 leading-relaxed">
                        {summary.what}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                        Why it matters
                      </h3>
                      <p className="text-slate-300 leading-relaxed">
                        {summary.why}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                        Evidence & Insights
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {summary.evidence}
                      </p>
                    </div>
                  </>
                )
              )}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {alert.timeline.map((event, idx: number) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                    {idx !== alert.timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-muted my-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-500">
                        {event.timestamp}
                      </span>
                      <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                        {event.category}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "entities" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {alert.entities.map((entity, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-card border border-border rounded-lg flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] text-indigo-400 uppercase font-bold block mb-1">
                      {entity.type}
                    </span>
                    <span className="text-sm text-foreground font-mono">
                      {entity.value}
                    </span>
                  </div>
                  <button className="text-[10px] text-slate-500 hover:text-white underline">
                    Pivoting...
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-auto pt-8 border-t border-border flex gap-4">
          <button
            onClick={() => onAction("Closed - Noise")}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-sm transition-all"
          >
            Mark as Noise
          </button>
          <button
            onClick={() => onAction("In Progress")}
            className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20 font-medium text-sm transition-all"
          >
            Investigate Further
          </button>
          <button
            onClick={() => onAction("Escalated")}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium text-sm shadow-lg shadow-red-900/20 transition-all"
          >
            Escalate Incident
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDetails;
