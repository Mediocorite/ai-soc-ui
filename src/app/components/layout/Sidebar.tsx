import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { UserRole } from "../../types/auth";
import { Link as RouterLink } from "../../router";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Sparkles,
  BarChart3,
  Settings,
  Users,
  FileText,
  Database,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  LogOut,
  Zap,
  Shield,
  Eye,
  X,
  Lock,
  AlertCircle,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import { getRoleConfig } from "../../config/roleConfig";

// navItems are now managed in src/app/config/roleConfig.ts

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user, logout, hasPermission } = useAuth();
  const { theme, setTheme } = useTheme();

  // Track viewport changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Close mobile menu when switching to desktop
      if (!mobile && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    // Debounce resize handler
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [isMobileOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Cmd/Ctrl + K is pressed
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isMobile) {
          setIsMobileOpen((prev) => !prev);
        } else {
          setIsCollapsed((prev) => !prev);
        }
        return;
      }

      // Check if Cmd/Ctrl + Shift + L is pressed for theme toggle
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "l") {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
        return;
      }

      // Navigation shortcuts (Cmd/Ctrl + Shift + Key)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        const { navigation } = getRoleConfig(user?.role);
        const item = navigation.find(
          (item) => item.shortcut.toLowerCase() === e.key.toLowerCase()
        );
        if (item) {
          e.preventDefault();
          setActiveItem(item.label);
          setIsMobileOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme, setTheme, hasPermission, isMobile]);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const roleIconMap: Partial<Record<UserRole, React.ElementType>> = {
    CISO: Lock,
    "Compliance/GRC": CheckCircle,
    "Platform Admin": Briefcase,
    "SOC Analyst": AlertCircle,
    "SOC Lead": Shield,
    "Security Engineer": Zap,
    "Threat Researcher": Eye,
  };

  // If user is logged in, use their role's icon; otherwise, default to Eye (viewer)
  const RoleIcon = user?.role ? roleIconMap[user.role] || Eye : Eye;

  const handleNavClick = (label: string) => {
    setActiveItem(label);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: isMobile ? -280 : 0 }}
        animate={{
          x: isMobile ? (isMobileOpen ? 0 : -280) : 0,
          width: !isMobile && isCollapsed ? 80 : 280,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed md:relative h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50"
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-linear-to-br from-sidebar-primary to-sidebar-primary/60 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-sidebar-foreground">AI Workspace</h3>
                  <p className="text-sidebar-foreground/60 text-xs">
                    {user?.role
                      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      : "User"}{" "}
                    Access
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop collapse button */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="hidden md:block p-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sidebar-foreground"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </motion.button>

          {/* Mobile close button */}
          <motion.button
            onClick={() => setIsMobileOpen(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sidebar-foreground"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {getRoleConfig(user?.role).navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.label;

              return (
                <motion.div key={item.label} whileHover={{ x: 4 }}>
                  <RouterLink
                    to={item.href}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                    onClick={() => handleNavClick(item.label)}
                  >
                    <Icon size={20} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs bg-sidebar-accent text-sidebar-accent-foreground rounded border border-sidebar-border font-medium">
                          ⌘⇧{item.shortcut}
                        </kbd>
                      </>
                    )}
                  </RouterLink>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions - Only visible when not collapsed */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-6 p-4 bg-linear-to-br from-sidebar-primary/10 to-sidebar-primary/5 rounded-xl border border-sidebar-border"
              >
                <h4 className="text-sidebar-foreground mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                    New AI Task
                  </button>
                  <p className="text-xs text-sidebar-foreground/60 text-center">
                    Press ⌘K to toggle sidebar
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 360 }}
              transition={{ duration: 0.3 }}
              className="relative shrink-0"
            >
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full border-2 border-sidebar-primary"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-sidebar-primary rounded-full flex items-center justify-center border-2 border-sidebar">
                <RoleIcon
                  size={10}
                  className="text-sidebar-primary-foreground"
                />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="truncate text-sidebar-foreground">
                    {user?.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {user?.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-1">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sidebar-foreground"
                title="Toggle theme (⌘⇧L)"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>

              {!isCollapsed && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={logout}
                  className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
