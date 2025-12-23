import React, { useState, useEffect } from "react";
import type { Incident } from "../../../../types/dashboard";
import { Severity, AnalystStatus } from "../../../../types/dashboard";
import { MOCK_INCIDENTS, MOCK_ANALYSTS } from "../../data/constants";
import { geminiService } from "../../../../services/geminiService";
import SLATimer from "./SLATimer";
import Modal from "./Modal";

interface DashboardProps {
  onSelectIncident: (incident: Incident) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectIncident }) => {
  const [aiHealth, setAiHealth] = useState<string>(
    "Analyzing SOC telemetry..."
  );
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      const summary = await geminiService.getSOCHealthSummary(
        MOCK_INCIDENTS,
        MOCK_ANALYSTS
      );
      setAiHealth(summary);
    };
    fetchHealth();
  }, []);

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL:
        return "text-red-600";
      case Severity.HIGH:
        return "text-orange-500";
      case Severity.MEDIUM:
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  const renderKPIPopupContent = () => {
    switch (activeModal) {
      case "Active Incidents":
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Historical volume vs current capacity
            </p>
            <div className="flex h-32 items-end space-x-1 border-b border-border pb-2">
              {[40, 60, 45, 90, 100, 80, 75].map((h, i) => (
                <div
                  key={i}
                  className="flex-grow bg-blue-100 rounded-t-sm hover:bg-ey-blue transition-colors cursor-help"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-muted rounded-xl border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  Current Capacity
                </p>
                <p className="text-xl font-black text-foreground">74%</p>
              </div>
              <div className="p-3 bg-muted rounded-xl border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  Avg. Life Cycle
                </p>
                <p className="text-xl font-black text-foreground">4.2h</p>
              </div>
            </div>
          </div>
        );
      case "SLA Breaches":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm font-bold text-red-800 mb-1">
                Critical Breach Alert
              </p>
              <p className="text-xs text-red-600">
                INC-2024-002 has exceeded remediation SLA by 10m 15s.
              </p>
            </div>
            <h4 className="text-xs font-bold text-slate-400 uppercase mt-4">
              Root Cause Analysis
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="text-ey-blue dark:text-ey-yellow mr-2">•</span>{" "}
                High analyst workload (Analyst Rodriguez at 120% capacity)
              </li>
              <li className="text-sm text-muted-foreground flex items-start">
                <span className="text-ey-blue dark:text-ey-yellow mr-2">•</span>{" "}
                Dependency delay on external Firewall vendor response
              </li>
            </ul>
          </div>
        );
      case "Analyst On-Duty":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase">
                Shift Roster (AM)
              </p>
              <span className="text-xs text-blue-600 font-bold">
                Swap Requested
              </span>
            </div>
            {MOCK_ANALYSTS.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
              >
                <div className="flex items-center">
                  <div className="h-6 w-6 bg-muted rounded-full flex items-center justify-center text-[10px] font-bold mr-2">
                    {a.name[0]}
                  </div>
                  <span className="text-sm text-foreground font-medium">
                    {a.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    a.status === "AVAILABLE"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <p className="text-sm text-slate-500 italic">
            Detailed operational metrics currently loading...
          </p>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Modal for Card Drill-Down */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={`${activeModal} - Command Details`}
      >
        {renderKPIPopupContent()}
      </Modal>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Active Incidents",
            value: MOCK_INCIDENTS.length,
            icon: "M13 10V3L4 14h7v7l9-11h-7z",
            color: "bg-blue-500",
          },
          {
            label: "SLA Breaches",
            value: 1,
            sub: "Last 24h",
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            color: "bg-red-500",
          },
          {
            label: "Avg. Response",
            value: "18.4m",
            sub: "Target: <20m",
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            color: "bg-emerald-500",
          },
          {
            label: "Analyst On-Duty",
            value: 4,
            sub: "3 Busy / 1 Available",
            icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
            color: "bg-indigo-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            onClick={() => setActiveModal(stat.label)}
            className="bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-md hover:border-ey-blue/30 dark:hover:border-ey-yellow/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
                <h4 className="text-3xl font-black text-foreground mt-2">
                  {stat.value}
                </h4>
                {stat.sub && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.sub}
                  </p>
                )}
              </div>
              <div
                className={`${stat.color} p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={stat.icon}
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Health Intelligence */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
          </svg>
        </div>
        <div className="flex items-start space-x-4">
          <div className="bg-ey-blue p-2.5 rounded-lg text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="flex-grow">
            <h3 className="font-bold text-foreground mb-1">
              Commander's Intelligence Brief
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm italic">
              "{aiHealth}"
            </p>
          </div>
          <button
            onClick={() => setActiveModal("AI Analysis")}
            className="text-ey-blue text-xs font-bold uppercase tracking-widest hover:underline"
          >
            Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Active Incidents Table */}
        <div className="xl:col-span-2 bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 gap-4">
            <h3 className="font-black text-foreground uppercase tracking-tight">
              Active Command Incidents
            </h3>
            <div className="flex space-x-2">
              <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded border border-red-100 uppercase">
                1 High Risk
              </span>
              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded border border-emerald-100 uppercase">
                Normal Load
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="text-xs font-semibold text-muted-foreground bg-muted/50 uppercase">
                <tr>
                  <th className="px-6 py-4">Incident Details</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Lead Analyst</th>
                  <th className="px-6 py-4 border-r border-border/10">
                    SLA Control
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {MOCK_INCIDENTS.map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => onSelectIncident(inc)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground group-hover:text-ey-blue dark:group-hover:text-ey-yellow transition-colors">
                          {inc.id}
                        </span>
                        <span className="font-bold text-foreground leading-tight mt-0.5">
                          {inc.title}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {inc.category} • Opened{" "}
                          {new Date(inc.openedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`h-2 w-2 rounded-full mr-2 ${
                            inc.severity === Severity.CRITICAL
                              ? "bg-red-600"
                              : inc.severity === Severity.HIGH
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <span
                          className={`text-xs font-black uppercase ${getSeverityColor(
                            inc.severity
                          )}`}
                        >
                          {inc.severity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center mr-2 text-[10px] font-bold text-muted-foreground border border-border">
                          {MOCK_ANALYSTS.find((a) => a.id === inc.analystId)
                            ?.name.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {
                            MOCK_ANALYSTS.find((a) => a.id === inc.analystId)
                              ?.name
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <SLATimer deadline={inc.slaDeadline} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analyst Workload View */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
            <h3 className="font-black text-foreground uppercase tracking-tight">
              Team Readiness
            </h3>
            <button
              onClick={() => setActiveModal("Analyst On-Duty")}
              className="text-ey-blue hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
              title="View Analyst On-Duty Details"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-6">
            {MOCK_ANALYSTS.map((analyst) => (
              <div key={analyst.id} className="group">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border font-bold text-muted-foreground">
                        {analyst.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                          analyst.status === AnalystStatus.AVAILABLE
                            ? "bg-emerald-500"
                            : analyst.status === AnalystStatus.BUSY
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-bold text-foreground">
                        {analyst.name}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                        {analyst.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-foreground">
                      {analyst.activeIncidents}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                      Active Cases
                    </p>
                  </div>
                </div>
                {/* Visual Workload Bar */}
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      analyst.activeIncidents > 3
                        ? "bg-red-500"
                        : analyst.activeIncidents > 1
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${Math.min(analyst.activeIncidents * 25, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-border">
              <button
                onClick={() => setActiveModal("Analyst On-Duty")}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-border text-muted-foreground text-xs font-bold hover:border-ey-blue/30 dark:hover:border-ey-yellow/30 hover:text-foreground transition-all uppercase tracking-widest"
              >
                Manage Resource Allocation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
