import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";
import { Sparkles, Lock, Mail } from "lucide-react";
import { motion } from "motion/react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("SOC Analyst");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, selectedRole);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center"
            >
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
            </motion.div>
          </div>

          <h1 className="text-center mb-2">Welcome Back</h1>
          <p className="text-center text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
            Sign in to your AI SOC
          </p>

          <form
            data-testid="login-form"
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5"
          >
            <div>
              <label htmlFor="email" className="block mb-2 text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-foreground">Role (Demo)</label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    "SOC Analyst",
                    "SOC Lead",
                    "CISO",
                    "Security Engineer",
                    "Threat Researcher",
                    "Compliance & GRC",
                    "Platform Admin",
                  ] as UserRole[]
                ).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-2 rounded-lg border transition-all text-sm sm:text-base ${
                      selectedRole === role
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          <p className="text-center text-muted-foreground mt-4 sm:mt-6 text-xs sm:text-sm">
            Demo app - any email/password works
          </p>
        </div>
      </motion.div>
    </div>
  );
}
