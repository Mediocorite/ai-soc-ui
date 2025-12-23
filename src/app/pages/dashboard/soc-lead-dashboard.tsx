import { useState } from "react";
import type { Incident } from "../../types/dashboard";
import Dashboard from "./components/soc-lead/Dashboard";
import IncidentDrillDown from "./components/soc-lead/IncidentDrillDown";

export default function SocLeadDashboard() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-ey-blue dark:bg-ey-blue p-2 rounded-xl shadow-lg shadow-ey-blue/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-foreground uppercase flex items-center gap-2">
                Sentinel Command
                <span className="px-2 py-0.5 bg-ey-blue/10 dark:bg-ey-yellow/10 text-ey-blue dark:text-ey-yellow text-[10px] rounded border border-ey-blue/20 dark:border-ey-yellow/20 tracking-normal font-black">
                  L.E.A.D v2
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Oversight & Coordination • Operational Status: Optimal
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-6 px-4 py-2 bg-muted/50 rounded-xl border border-border/50">
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  System Node
                </p>
                <p className="text-xs font-black text-foreground uppercase">
                  DC-US-EAST-1
                </p>
              </div>
              <div className="h-8 w-px bg-border/50" />
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  AI Support
                </p>
                <p className="text-xs font-black text-emerald-500 uppercase">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full px-6 py-8">
        {selectedIncident ? (
          <IncidentDrillDown
            incident={selectedIncident}
            onBack={() => setSelectedIncident(null)}
          />
        ) : (
          <Dashboard onSelectIncident={setSelectedIncident} />
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="bg-card border-t border-border py-3 px-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex space-x-6">
          <span>Server: Sentinel-US-East-1</span>
          <span>Uptime: 99.998%</span>
          <span>DB Latency: 12ms</span>
        </div>
        <div className="flex items-center text-ey-blue dark:text-ey-yellow">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          AI Agent "Command" is Active
        </div>
      </footer>
    </div>
  );
}
