import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider.jsx";
import theme from "./theme/theme.js";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the logged-out Voyager app navigation", () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>,
    );

    const navigation = screen.getByRole("navigation", {
      name: /main navigation/i,
    });

    expect(within(navigation).getByRole("link", { name: /voyager home/i })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: /^log in$/i })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: /^register$/i })).toBeInTheDocument();
  });
});
