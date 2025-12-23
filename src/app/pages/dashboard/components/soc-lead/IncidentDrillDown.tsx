import React, { useEffect, useState } from "react";
import type { Incident } from "../../../../types/dashboard";
import { Severity } from "../../../../types/dashboard";
import { MOCK_TIMELINE } from "../../data/constants";
import { geminiService } from "../../../../services/geminiService";
import SLATimer from "./SLATimer";
import IncidentChat from "./IncidentChat";

interface IncidentDrillDownProps {
  incident: Incident;
  onBack: () => void;
}

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  const colors = {
    [Severity.CRITICAL]: "bg-red-500/10 text-red-500 border-red-500/20",
    [Severity.HIGH]: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    [Severity.MEDIUM]: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    [Severity.LOW]: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-bold border ${colors[severity]}`}
    >
      {severity}
    </span>
  );
};

const IncidentDrillDown: React.FC<IncidentDrillDownProps> = ({
  incident,
  onBack,
}) => {
  const [aiBrief, setAiBrief] = useState<string>("Generating AI briefing...");
  const timeline = MOCK_TIMELINE.filter((e) => e.incidentId === incident.id);

  useEffect(() => {
    const fetchBrief = async () => {
      const brief = await geminiService.getIncidentBrief(incident, timeline);
      setAiBrief(brief);
    };
    fetchBrief();
  }, [incident.id, incident, timeline]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            title="Go back to incidents list"
            className="p-2 hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border"
          >
            <svg
              className="w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {incident.id}
              </span>
              <SeverityBadge severity={incident.severity} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {incident.title}
            </h2>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col sm:flex-row items-center gap-6 sm:gap-6">
          <div className="text-center sm:text-right">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-tighter">
              Status
            </p>
            <p className="font-bold text-foreground">{incident.status}</p>
          </div>
          <div className="hidden sm:block h-8 w-px bg-border" />
          <div className="text-center sm:text-right">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-tighter">
              SLA Deadline
            </p>
            <SLATimer deadline={incident.slaDeadline} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Intelligence Card */}
          <div className="bg-ey-blue/10 dark:bg-ey-blue/20 border border-ey-blue/20 dark:border-border/50 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-ey-blue dark:text-ey-yellow group-hover:scale-110 transition-transform">
              <svg
                className="w-24 h-24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
              </svg>
            </div>
            <h3 className="text-ey-blue dark:text-ey-yellow font-black mb-3 flex items-center uppercase tracking-tighter">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Sentinel AI Briefing
            </h3>
            <div className="text-foreground/90 dark:text-foreground leading-relaxed text-sm">
              {aiBrief}
            </div>
          </div>

          {/* Timeline View */}
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground">
                Operational Timeline
              </h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {timeline.length > 0 ? (
                    timeline.map((event, idx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {idx !== timeline.length - 1 && (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  event.type === "SYSTEM_ALERT"
                                    ? "bg-red-500"
                                    : event.type === "STATUS_CHANGE"
                                    ? "bg-blue-500"
                                    : "bg-slate-400"
                                }`}
                              >
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  {event.type === "SYSTEM_ALERT" ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  )}
                                </svg>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-foreground font-medium">
                                  {event.message}
                                </p>
                                {event.actor && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Action by {event.actor}
                                  </p>
                                )}
                              </div>
                              <div className="text-right text-xs whitespace-nowrap text-muted-foreground font-medium">
                                {new Date(event.timestamp).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 italic">
                      No operational events logged yet.
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Support Chat Panel */}
          <IncidentChat incident={incident} timeline={timeline} />

          {/* Summary Card */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 text-foreground">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Incident Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Category
                </label>
                <p className="text-sm font-medium text-foreground">
                  {incident.category}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Detection Summary
                </label>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  {incident.summary}
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Assigned Analyst
                </label>
                <div className="flex items-center mt-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3 border border-border">
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      SJ
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Sarah Jenkins
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Senior SOC Analyst
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Intervention Signals */}
          <div className="bg-amber-500/10 rounded-xl border border-amber-500/20 p-6">
            <h3 className="text-amber-600 dark:text-amber-500 font-black mb-4 flex items-center uppercase tracking-tighter">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Intervention Required?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-4 w-4 rounded-full bg-amber-500/80 flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-sm text-amber-900 dark:text-amber-200">
                  Analyst has isolation capability
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-4 w-4 rounded-full bg-red-500/20 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  </div>
                </div>
                <p className="ml-3 text-sm text-red-500 font-bold uppercase tracking-tighter">
                  SLA Breach Risk: HIGH
                </p>
              </li>
            </ul>
            <button className="w-full mt-6 bg-amber-600 text-white font-bold py-2.5 rounded-lg hover:bg-amber-700 transition-colors shadow-sm">
              Initiate Oversight Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDrillDown;
