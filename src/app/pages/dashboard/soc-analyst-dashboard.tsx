import { useState } from "react";
import type { Alert } from "../../types/dashboard";
import { MOCK_ALERTS } from "./data/constants";
import AlertFeed from "./components/soc-analyst/AlertFeed";
import AlertDetails from "./components/soc-analyst/AlertDetails";
import AIChat from "./components/soc-analyst/AIChat";

export default function SocAnalystDashboard() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleAlertAction = (status: Alert["status"]) => {
    if (selectedAlert) {
      setActionFeedback(`Alert ${selectedAlert.id} marked as ${status}`);
      setTimeout(() => setActionFeedback(null), 3000);
      setSelectedAlert(null);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      <AlertFeed
        alerts={MOCK_ALERTS}
        selectedId={selectedAlert?.id || ""}
        onSelect={setSelectedAlert}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
        {actionFeedback && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-500/20 animate-in fade-in slide-in-from-top-4">
            {actionFeedback}
          </div>
        )}

        {selectedAlert ? (
          <AlertDetails alert={selectedAlert} onAction={handleAlertAction} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-600 p-8 text-center">
            <div className="max-w-md">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-500"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-400 mb-2">
                No Alert Selected
              </h2>
              <p className="text-sm">
                Select an alert from the queue to begin AI-assisted
                investigation and response.
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedAlert && <AIChat key={selectedAlert.id} alert={selectedAlert} />}
    </div>
  );
}
