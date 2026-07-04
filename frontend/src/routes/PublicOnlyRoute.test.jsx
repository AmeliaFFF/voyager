import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/authContext.js";
import { renderWithProviders } from "../test/testUtils.jsx";
import PublicOnlyRoute from "./PublicOnlyRoute.jsx";

function renderPublicOnlyRoute(authValue) {
  return renderWithProviders(
    <AuthContext.Provider value={authValue}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<p>Login page</p>} />
        </Route>
        <Route path="/trips" element={<p>Trips page</p>} />
      </Routes>
    </AuthContext.Provider>,
    { route: "/login" },
  );
}

describe("PublicOnlyRoute", () => {
  it("shows a loading message while authentication state is loading", () => {
    renderPublicOnlyRoute({
      isAuthenticated: false,
      isAuthLoading: true,
    });

    expect(screen.getByText("Checking your session...")).toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
    expect(screen.queryByText("Trips page")).not.toBeInTheDocument();
  });

  it("renders public content for logged out users", () => {
    renderPublicOnlyRoute({
      isAuthenticated: false,
      isAuthLoading: false,
    });

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redirects authenticated users to trips", async () => {
    renderPublicOnlyRoute({
      isAuthenticated: true,
      isAuthLoading: false,
    });

    expect(await screen.findByText("Trips page")).toBeInTheDocument();
  });
});
