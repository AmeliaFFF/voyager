import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import { Link as RouterLink, Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar component="header" position="static">
        <Toolbar component="nav" aria-label="Main navigation">
          <Link
            component={RouterLink}
            to="/"
            aria-label="Voyager home"
            sx={{
              alignItems: "center",
              display: "flex",
              flexGrow: 1,
            }}
          >
            <Box
              component="img"
              src="/voyager-logo-light.svg"
              alt="Voyager"
              sx={{
                display: "block",
                height: 32,
                width: "auto",
              }}
            />
          </Link>

          <Button component={RouterLink} to="/" color="inherit">
            Home
          </Button>

          <Button component={RouterLink} to="/trips" color="inherit">
            Trips
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          py: {
            xs: 3,
            md: 5,
          },
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

export default AppLayout;
