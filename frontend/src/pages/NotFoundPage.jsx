import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

function NotFoundPage() {
  return (
    <Stack component="section" spacing={3}>
      <Typography component="h1" variant="h1">
        Page not found
      </Typography>

      <Typography>The page you are looking for does not exist.</Typography>

      <Button component={RouterLink} to="/" variant="contained">
        Go home
      </Button>
    </Stack>
  );
}

export default NotFoundPage;
