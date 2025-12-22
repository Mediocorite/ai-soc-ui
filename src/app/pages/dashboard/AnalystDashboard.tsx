import { motion } from "motion/react";

export function AnalystDashboard() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="mb-4">Analyst Command Center</h1>
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Integration with Sentinel AI Alert Feed and AIChat in progress...
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-primary animate-pulse rounded-full" />
            System Initializing
          </div>
        </div>
      </motion.div>
    </div>
  );
}
