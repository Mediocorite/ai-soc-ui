import { motion } from "motion/react";

export function LeadDashboard() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="mb-4">SOC Lead Overview</h1>
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Integration with SLA Monitoring and Analyst Workload views in
            progress...
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ey-blue/10 text-ey-blue rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-ey-blue animate-pulse rounded-full" />
            Commander Intelligence Loading
          </div>
        </div>
      </motion.div>
    </div>
  );
}
