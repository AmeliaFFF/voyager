import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { formatStatusLabel } from "../utils/statusUtils.js";
import ContentCard from "./ContentCard.jsx";

function formatDate(dateValue) {
  if (!dateValue) {
    return "Date not set";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

function formatBudget(trip) {
  if (trip.budget === null || trip.budget === undefined) {
    return "Budget not set";
  }

  return `${trip.currencyCode || "AUD"} ${Number(trip.budget).toLocaleString("en-AU")}`;
}

function TripCard({ trip }) {
  return (
    <ContentCard
      sx={{
        height: "100%",
      }}
    >
      <Stack spacing={2} sx={{ height: "100%" }}>
        <Typography component="h2" variant="h2">
          {trip.title}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "5.25rem minmax(0, 1fr)",
              sm: "5.5rem minmax(0, 1fr)",
            },
            columnGap: 1.5,
            rowGap: 1,
            alignItems: "center",
          }}
        >
          <Typography
            component="span"
            color="text.secondary"
            sx={{
              fontWeight: 700,
            }}
          >
            Status:
          </Typography>

          <Box
            sx={{
              ml: "-7px",
            }}
          >
            <Chip
              label={formatStatusLabel(trip.status)}
              size="small"
              sx={(theme) => {
                const colours = theme.palette.status[trip.status] || theme.palette.status.planned;

                return {
                  bgcolor: colours.background,
                  color: colours.text,
                  fontWeight: 600,
                };
              }}
            />
          </Box>

          <Typography
            component="span"
            color="text.secondary"
            sx={{
              fontWeight: 700,
            }}
          >
            Location:
          </Typography>

          <Typography>{trip.destination}</Typography>

          <Typography
            component="span"
            color="text.secondary"
            sx={{
              fontWeight: 700,
            }}
          >
            Dates:
          </Typography>

          <Typography>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </Typography>

          <Typography
            component="span"
            color="text.secondary"
            sx={{
              fontWeight: 700,
            }}
          >
            Budget:
          </Typography>

          <Typography>{formatBudget(trip)}</Typography>

          {trip.notes ? (
            <>
              <Typography
                component="span"
                color="text.secondary"
                sx={{
                  alignSelf: "start",
                  fontWeight: 700,
                }}
              >
                Notes:
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }}
              >
                {trip.notes}
              </Typography>
            </>
          ) : null}
        </Box>

        <Box sx={{ mt: "auto" }}>
          <Button fullWidth component={RouterLink} to={`/trips/${trip.id}`} variant="outlined">
            View trip
          </Button>
        </Box>
      </Stack>
    </ContentCard>
  );
}

export default TripCard;
