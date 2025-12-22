import { renderWithAuth, screen, waitFor } from "../test-utils";
import { useAuth } from "../app/contexts/AuthContext";

function TestConsumer() {
  const { isAuthenticated, user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? "true" : "false"}</span>
      <span data-testid="role">{user?.role ?? ""}</span>
      <button onClick={() => login("tester@example.com", "", "Platform Admin")}>
        login
      </button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

test("AuthProvider login/logout updates context", async () => {
  renderWithAuth(<TestConsumer />);

  expect(screen.getByTestId("auth")).toHaveTextContent("false");

  // Click login and wait for async login to complete (mock delay in provider)
  const loginBtn = screen.getByText("login");
  loginBtn.click();

  // Wait for the async login to complete; allow a longer timeout for CI
  await waitFor(
    () => expect(screen.getByTestId("auth")).toHaveTextContent("true"),
    { timeout: 5000 }
  );

  // Role should be set
  await waitFor(
    () =>
      expect(screen.getByTestId("role")).toHaveTextContent("Platform Admin"),
    { timeout: 5000 }
  );

  // Logout should clear state
  const logoutBtn = screen.getByText("logout");
  logoutBtn.click();
  expect(screen.getByTestId("auth")).toHaveTextContent("false");
});
