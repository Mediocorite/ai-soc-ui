import React from "react";
import { renderWithAuth, screen } from "../test-utils";
import RequireAuth from "../app/RequireAuth";
import { useAuth } from "../app/hooks/useAuth";

function ProtectedChild() {
  return <div>Protected Content</div>;
}

test("RequireAuth shows access denied when role insufficient", async () => {
  // Render provider and log in with a low-role user
  function Harness() {
    return (
      <RequireAuth requiredRole={"Platform Admin"}>
        <ProtectedChild />
      </RequireAuth>
    );
  }

  // Helper that logs in as a low-permission user on mount
  function LoginOnMount() {
    const { login } = useAuth();
    React.useEffect(() => {
      login("low@example.com", "SOC Analyst");
    }, [login]);
    return null;
  }

  renderWithAuth(
    <>
      <LoginOnMount />
      <Harness />
    </>
  );

  // Now the provider has a logged-in low-permission user; access should be denied
  const denied = await screen.findByText(/Access denied/i);
  expect(denied).toBeInTheDocument();
});
