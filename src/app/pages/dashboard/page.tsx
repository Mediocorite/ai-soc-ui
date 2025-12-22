// import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "motion/react";
import {
  Activity,
  TrendingUp,
  Users,
  Zap,
  ArrowUpRight,
  Brain,
  Clock,
  CheckCircle2,
  Menu,
} from "lucide-react";

export function Dashboard() {
  const { user, hasPermission } = useAuth();
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const stats = [
    {
      label: "AI Tasks Completed",
      value: "1,234",
      change: "+12%",
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Active Models",
      value: "8",
      change: "+2",
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Processing Time",
      value: "2.4s",
      change: "-15%",
      icon: Clock,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "API Calls",
      value: "45.2K",
      change: "+23%",
      icon: Activity,
      color: "from-orange-500 to-red-500",
    },
  ];

  const adminStats = [
    { label: "Total Users", value: "2,543", icon: Users },
    { label: "System Uptime", value: "99.9%", icon: TrendingUp },
    { label: "Active Sessions", value: "342", icon: Zap },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 md:hidden bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const event = new CustomEvent("toggleMobileSidebar");
              window.dispatchEvent(event);
            }}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <h2>Dashboard</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your AI workspace today.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-2 sm:p-3 rounded-xl bg-linear-to-br ${stat.color}`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center gap-1">
                      <ArrowUpRight size={12} />
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="mb-1">{stat.value}</h3>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Admin-only section */}
          {hasPermission("Platform Admin") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 sm:mb-8"
            >
              <div className="bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h2>Admin Dashboard</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {adminStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="bg-card/50 backdrop-blur rounded-lg p-4 border border-border"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <h3>{stat.value}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-lg"
          >
            <h2 className="mb-4">Recent AI Activity</h2>
            <div className="space-y-4">
              {[
                {
                  task: "Text Generation",
                  model: "GPT-4",
                  status: "Completed",
                  time: "2 min ago",
                },
                {
                  task: "Image Analysis",
                  model: "Vision AI",
                  status: "Completed",
                  time: "5 min ago",
                },
                {
                  task: "Data Processing",
                  model: "Custom ML",
                  status: "In Progress",
                  time: "8 min ago",
                },
                {
                  task: "Sentiment Analysis",
                  model: "NLP Engine",
                  status: "Completed",
                  time: "12 min ago",
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground">{activity.task}</p>
                      <p className="text-muted-foreground text-sm">
                        Model: {activity.model}
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                    <span
                      className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                        activity.status === "Completed"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {activity.status}
                    </span>
                    <p className="text-muted-foreground text-sm whitespace-nowrap">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Role-based message */}
          {hasPermission("SOC Analyst") && !hasPermission("Platform Admin") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 sm:mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 sm:p-6"
            >
              <p className="text-yellow-600 dark:text-yellow-400 text-sm sm:text-base">
                👁️ You're viewing as a <strong>Viewer</strong>. Some features
                are read-only.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
