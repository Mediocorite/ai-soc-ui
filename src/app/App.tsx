import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { LoginPage } from "./components/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
