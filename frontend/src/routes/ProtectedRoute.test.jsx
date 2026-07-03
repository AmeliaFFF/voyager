import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/authContext.js";
import { renderWithProviders } from "../test/testUtils.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function renderProtectedRoute(authValue) {
  return renderWithProviders(
    <AuthContext.Provider value={authValue}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/trips" element={<p>Protected trips page</p>} />
        </Route>
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </AuthContext.Provider>,
    { route: "/trips" },
  );
}

describe("ProtectedRoute", () => {
  it("renders nothing while authentication state is loading", () => {
    renderProtectedRoute({
      isAuthenticated: false,
      isAuthLoading: true,
    });

    expect(screen.queryByText("Protected trips page")).not.toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users to login", async () => {
    renderProtectedRoute({
      isAuthenticated: false,
      isAuthLoading: false,
    });

    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  it("renders protected content for authenticated users", () => {
    renderProtectedRoute({
      isAuthenticated: true,
      isAuthLoading: false,
    });

    expect(screen.getByText("Protected trips page")).toBeInTheDocument();
  });
});
