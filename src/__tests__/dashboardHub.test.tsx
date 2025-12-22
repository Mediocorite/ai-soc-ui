import React from "react";
import { renderWithAuth, screen } from "../test-utils";
import { DashboardHub } from "../app/pages/dashboard/DashboardHub";
import { useAuth } from "../app/hooks/useAuth";

test("DashboardHub renders AnalystDashboard for SOC Analyst", async () => {
  function LoginAsAnalyst() {
    const { login } = useAuth();
    React.useEffect(() => {
      login("analyst@example.com", "SOC Analyst");
    }, [login]);
    return null;
  }

  renderWithAuth(
    <>
      <LoginAsAnalyst />
      <DashboardHub />
    </>
  );

  const heading = await screen.findByText(/Analyst Command Center/i);
  expect(heading).toBeInTheDocument();
});

test("DashboardHub renders LeadDashboard for SOC Lead", async () => {
  function LoginAsLead() {
    const { login } = useAuth();
    React.useEffect(() => {
      login("lead@example.com", "SOC Lead");
    }, [login]);
    return null;
  }

  renderWithAuth(
    <>
      <LoginAsLead />
      <DashboardHub />
    </>
  );

  const heading = await screen.findByText(/SOC Lead Overview/i);
  expect(heading).toBeInTheDocument();
});

test("DashboardHub renders StandardDashboard for Platform Admin", async () => {
  function LoginAsAdmin() {
    const { login } = useAuth();
    React.useEffect(() => {
      login("admin@example.com", "Platform Admin");
    }, [login]);
    return null;
  }

  renderWithAuth(
    <>
      <LoginAsAdmin />
      <DashboardHub />
    </>
  );

  const heading = await screen.findByText(/Welcome back/i);
  expect(heading).toBeInTheDocument();
});
