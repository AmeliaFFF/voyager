import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
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

  it("redirects to the originally requested page after login", async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockResolvedValue({});

    renderWithProviders(
      <AuthContext.Provider value={{ login }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/trips/trip-1" element={<p>Requested trip page</p>} />
        </Routes>
      </AuthContext.Provider>,
      {
        route: {
          pathname: "/login",
          state: {
            from: {
              pathname: "/trips/trip-1",
              search: "?status=booked",
              hash: "",
            },
          },
        },
      },
    );

    await user.type(screen.getByLabelText(/email/i), "seed.regular@example.com");
    await user.type(screen.getByLabelText(/password/i), "Password123");
    await user.click(screen.getByRole("button", { name: /^log in$/i }));

    expect(login).toHaveBeenCalledWith({
      email: "seed.regular@example.com",
      password: "Password123",
    });
    expect(await screen.findByText("Requested trip page")).toBeInTheDocument();
  });
});
