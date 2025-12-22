// import React from "react";
import { renderWithAuth, screen, fireEvent, waitFor } from "../test-utils";
import { LoginPage } from "../app/components/LoginPage";
import { useAuth } from "../app/hooks/useAuth";

// Small consumer to show auth state after login
function AuthState() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? "true" : "false"}</span>
      <span data-testid="name">{user?.name ?? ""}</span>
    </div>
  );
}

test("LoginPage performs login and updates auth context", async () => {
  renderWithAuth(
    <>
      <LoginPage />
      <AuthState />
    </>
  );

  // Fill email and click sign in
  const emailInput = screen.getByPlaceholderText("you@example.com");
  fireEvent.change(emailInput, { target: { value: "tester@example.com" } });

  const signIn = screen.getByRole("button", { name: /sign in/i });
  const form = screen.getByTestId("login-form");
  fireEvent.submit(form);

  // Verify loading state is triggered
  expect(signIn).toHaveTextContent(/signing in/i);

  await waitFor(
    () => {
      expect(screen.getByTestId("auth")).toHaveTextContent("true");
    },
    { timeout: 5000 }
  );

  const name = await screen.findByTestId("name");
  expect(name).toHaveTextContent("tester");
});
