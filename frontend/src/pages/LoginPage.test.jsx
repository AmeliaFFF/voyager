import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage.jsx";
import { AuthContext } from "../context/authContext.js";
import { renderWithProviders } from "../test/testUtils.jsx";

describe("LoginPage", () => {
  it("shows a validation message when required fields are missing", async () => {
    const user = userEvent.setup();
    const login = vi.fn();

    renderWithProviders(
      <AuthContext.Provider value={{ login }}>
        <LoginPage />
      </AuthContext.Provider>,
      { route: "/login" },
    );

    await user.click(screen.getByRole("button", { name: /^log in$/i }));

    expect(screen.getByRole("alert")).toHaveTextContent("Email and password are required.");
    expect(login).not.toHaveBeenCalled();
  });

  it("shows a success message passed from navigation state", () => {
    renderWithProviders(
      <AuthContext.Provider value={{ login: vi.fn() }}>
        <LoginPage />
      </AuthContext.Provider>,
      {
        route: {
          pathname: "/login",
          state: {
            successMessage: "Account created successfully. Please log in.",
          },
        },
      },
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Account created successfully. Please log in.",
    );
  });
});
