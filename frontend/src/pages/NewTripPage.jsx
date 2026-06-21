import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ContentCard from "../components/ContentCard.jsx";

function NewTripPage() {
  return (
    <Stack component="section" spacing={3}>
      <Typography component="h1" variant="h1">
        Create trip
      </Typography>

      <ContentCard>
        <Typography>Trip creation form will be added soon.</Typography>
      </ContentCard>
    </Stack>
  );
}

export default NewTripPage;
