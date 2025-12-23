import { useState, useEffect } from "react";
import type { ExecutiveSummary } from "../../types/dashboard";
import { geminiService } from "../../services/geminiService";
import { DOMAIN_RISKS, RAW_DATA, INCIDENT_HIGHLIGHTS } from "./data/constants";
import type { RiskMetric } from "../../types/dashboard";
import RiskCard from "./components/executive/RiskCard";
import TrendChart from "./components/executive/TrendChart";
import Modal from "./components/executive/Modal";

export default function CISODashboard() {
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<RiskMetric | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const narrative = await geminiService.generateExecutiveNarrative(
          DOMAIN_RISKS,
          RAW_DATA,
          INCIDENT_HIGHLIGHTS
        );
        setSummary(narrative);
      } catch (error) {
        console.error("Failed to fetch executive summary:", error);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  const mockTrendData = [
    { date: "May 01", incidents: 4, mttr: 12 },
    { date: "May 05", incidents: 7, mttr: 15 },
    { date: "May 10", incidents: 5, mttr: 11 },
    { date: "May 15", incidents: 8, mttr: 14 },
    { date: "May 20", incidents: 6, mttr: 10 },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-ey-blue/10">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Executive SOC Intelligence
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Strategic overview of global security posture
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-ey-blue/20 outline-none text-foreground">
              <option>Last 30 Days</option>
              <option>Quarter to Date</option>
              <option>Last 12 Months</option>
            </select>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="bg-ey-blue text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#002874] transition-all shadow-lg shadow-ey-blue/20 flex items-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Risk Profile */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground uppercase tracking-widest">
              Domain Risk Profile
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Aggregated Health Scores
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOMAIN_RISKS.map((metric, idx) => (
              <RiskCard key={idx} metric={metric} onClick={setSelectedMetric} />
            ))}
          </div>
        </section>

        {/* AI Insights & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* AI Perspective */}
          <div className="lg:col-span-1 bg-card p-8 rounded-3xl border border-border shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-ey-yellow rounded-lg flex items-center justify-center">
                <span className="text-ey-blue font-black text-xs">AI</span>
              </div>
              <h3 className="font-bold text-foreground uppercase tracking-wider text-sm">
                Strategic Narrative
              </h3>
            </div>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="prose prose-slate dark:prose-invert prose-sm">
                  <h4 className="font-bold text-foreground mb-2">
                    {summary?.headline}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed italic border-l-2 border-ey-yellow pl-4">
                    {summary?.narrative}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-xl border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
                    Strategic Recommendation
                  </p>
                  <p className="text-sm text-ey-blue dark:text-ey-yellow font-medium">
                    {summary?.strategicRecommendation}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Impact:
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        summary?.impactLevel === "High"
                          ? "bg-red-100 text-red-700"
                          : summary?.impactLevel === "Moderate"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {summary?.impactLevel}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trend Charts */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <TrendChart
              title="Incident Volume Trend"
              data={mockTrendData}
              type="bar"
              dataKey="incidents"
              color="#00338D"
            />
            <TrendChart
              title="Mean Time to Resolution (min)"
              data={mockTrendData}
              type="line"
              dataKey="mttr"
              color="#FFE600"
            />
          </div>
        </div>

        {/* Strategic Incident Highlights */}
        <section className="bg-foreground text-background dark:bg-card dark:text-foreground rounded-3xl p-8 border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold">
                Strategic Incident Highlights
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Critical events impacting organizational risk
              </p>
            </div>
            <button className="text-sm font-bold text-ey-yellow hover:underline">
              View All Observations →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INCIDENT_HIGHLIGHTS.map((incident) => (
              <div
                key={incident.id}
                className="bg-background/5 p-6 rounded-2xl border border-border/50 hover:bg-background/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-ey-yellow uppercase tracking-widest bg-ey-yellow/10 px-2 py-1 rounded">
                    {incident.status}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {incident.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{incident.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {incident.summary}
                </p>
                <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Impact: {incident.impact}
                  </span>
                  <button className="text-xs font-bold text-white/50 hover:text-white transition-colors">
                    Report Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modals */}
      <Modal
        isOpen={!!selectedMetric}
        onClose={() => setSelectedMetric(null)}
        title={selectedMetric?.domain || ""}
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted p-6 rounded-2xl border border-border">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Domain Score
              </p>
              <p className="text-4xl font-black text-foreground">
                {selectedMetric?.score}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                selectedMetric?.status === "Healthy"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {selectedMetric?.status}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-foreground border-b border-border pb-2">
              Recent Factors
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Infrastructure Drift
                </span>
                <span className="text-red-600 dark:text-red-400 font-bold">
                  -4 pts
                </span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Training Completion
                </span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">
                  STABLE
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Executive Report"
      >
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Choose the format and detail level for the strategic security
            briefing. Reports include AI-generated executive narratives and data
            visualizations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="p-4 border-2 border-border rounded-2xl hover:border-ey-blue dark:hover:border-ey-yellow hover:bg-muted transition-all text-left">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-3">
                <span className="text-red-700 dark:text-red-400 font-bold text-xs">
                  PDF
                </span>
              </div>
              <p className="font-bold text-foreground">Standard Brief</p>
              <p className="text-xs text-muted-foreground mt-1">
                Executive summary + KPIs
              </p>
            </button>
            <button className="p-4 border-2 border-border rounded-2xl hover:border-ey-blue dark:hover:border-ey-yellow hover:bg-muted transition-all text-left">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
                <span className="text-blue-700 dark:text-blue-400 font-bold text-xs">
                  PPTX
                </span>
              </div>
              <p className="font-bold text-foreground">Board Deck</p>
              <p className="text-xs text-muted-foreground mt-1">
                Full visualization pack
              </p>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
