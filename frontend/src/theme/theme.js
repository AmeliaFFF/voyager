import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#11999E",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F4F4F4",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#3C3C3C",
      secondary: "#6B7280",
    },
    divider: "#E2E2E2",
    status: {
      planned: {
        background: "#E5E7EB",
        text: "#374151",
      },
      booked: {
        background: "#CCFBF1",
        text: "#115E59",
      },
      completed: {
        background: "#DCFCE7",
        text: "#166534",
      },
      cancelled: {
        background: "#FEE2E2",
        text: "#991B1B",
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      color: "#3C3C3C",
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "#3C3C3C",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#3C3C3C",
          color: "#FFFFFF",
          borderBottom: "1px solid #2F2F2F",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
  },
});

export default theme;
