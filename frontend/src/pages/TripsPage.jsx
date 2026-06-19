import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ContentCard from "../components/ContentCard.jsx";

function TripsPage() {
  return (
    <Stack component="section" spacing={2}>
      <Typography component="h1" variant="h1">
        Trips
      </Typography>

      <ContentCard>
        <Typography>
          Trip dashboard placeholder. Trip list functionality will be added later.
        </Typography>
      </ContentCard>
    </Stack>
  );
}

export default TripsPage;
