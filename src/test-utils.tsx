import { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { AuthProvider } from "./app/contexts/AuthContext";

export function renderWithAuth(
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">
) {
  return render(<AuthProvider>{ui}</AuthProvider>, options);
}

export * from "@testing-library/react";
