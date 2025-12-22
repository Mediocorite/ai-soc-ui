import { createBrowserHistory } from "@tanstack/react-router";
import {
  Router,
  RootRoute,
  Route,
  RouterProvider,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { LoginPage } from "./pages/login/page";
import { Sidebar } from "./components/layout/Sidebar";
import { Dashboard } from "./pages/dashboard/page";
import { AIStudioPage } from "./pages/ai-studio/page";
import { AnalyticsPage } from "./pages/analytics/page";
import { useAuth } from "./hooks/useAuth";

// Root layout component that uses Auth to guard pages and render layout
function RootLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

// Create TanStack Router routes
const rootRoute = new RootRoute({ component: RootLayout });

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const aiStudioRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "ai-studio",
  component: AIStudioPage,
});

const analyticsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "analytics",
  component: AnalyticsPage,
});

// Build route tree and router
const routeTree = rootRoute.addChildren([
  dashboardRoute,
  aiStudioRoute,
  analyticsRoute,
]);

const history = createBrowserHistory({ window });

const router = new Router({ routeTree, history });

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

export { Link };
