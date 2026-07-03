import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "./RegisterPage.jsx";
import { AuthContext } from "../context/authContext.js";
import { renderWithProviders } from "../test/testUtils.jsx";

describe("RegisterPage", () => {
  it("shows a validation message when required fields are missing", async () => {
    const user = userEvent.setup();
    const register = vi.fn();

    renderWithProviders(
      <AuthContext.Provider value={{ register }}>
        <RegisterPage />
      </AuthContext.Provider>,
      { route: "/register" },
    );

    await user.click(screen.getByRole("button", { name: /^create account$/i }));

    expect(screen.getByRole("alert")).toHaveTextContent("Name, email, and password are required.");
    expect(register).not.toHaveBeenCalled();
  });
});
