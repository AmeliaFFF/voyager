import Typography from "@mui/material/Typography";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Typography>Checking your session...</Typography>;
  }

  if (isAuthenticated) {
    return <Navigate to="/trips" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
