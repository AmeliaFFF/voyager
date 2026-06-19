import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

function HomePage() {
  return (
    <Stack component="section" spacing={3}>
      <Typography component="h1" variant="h1">
        Plan your next adventure with Voyager
      </Typography>

      <Typography variant="body1">
        Voyager helps organise trips, itinerary items, bookings, and travel plans in one place.
      </Typography>

      <Button component={RouterLink} to="/trips" variant="contained">
        View trips
      </Button>
    </Stack>
  );
}

export default HomePage;
