import { render } from "@testing-library/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import theme from "../theme/theme.js";

export function renderWithProviders(ui, options = {}) {
  const { route = "/", withRouter = true } = options;

  function ThemeWrapper({ children }) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    );
  }

  function Wrapper({ children }) {
    const themedChildren = <ThemeWrapper>{children}</ThemeWrapper>;

    if (!withRouter) {
      return themedChildren;
    }

    return <MemoryRouter initialEntries={[route]}>{themedChildren}</MemoryRouter>;
  }

  return render(ui, { wrapper: Wrapper });
}
