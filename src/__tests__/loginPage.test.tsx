// import React from "react";
import { renderWithAuth, screen, fireEvent } from "../test-utils";
import { LoginPage } from "../app/components/LoginPage";
import { useAuth } from "../app/contexts/AuthContext";

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
  fireEvent.click(signIn);

  const auth = await screen.findByTestId("auth");
  expect(auth).toHaveTextContent("true");

  const name = await screen.findByTestId("name");
  expect(name).toHaveTextContent("tester");
});
