import { createBrowserHistory } from "@tanstack/react-router";
import {
  Router,
  RootRoute,
  Route,
  RouterProvider,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { LoginPage } from "./components/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { useAuth } from "./contexts/AuthContext";

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
  component: () => <div className="p-6">AI Studio (coming soon)</div>,
});

const analyticsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "analytics",
  component: () => <div className="p-6">Analytics</div>,
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
