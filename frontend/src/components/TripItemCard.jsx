import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import ContentCard from "./ContentCard.jsx";
import { formatLocalDateTime, formatTripItemLabel } from "../utils/tripItemUtils.js";

function getTimeLabels(type) {
  switch (type) {
    case "flight":
    case "cruise":
      return {
        start: "Departure",
        end: "Arrival",
      };
    case "accommodation":
      return {
        start: "Check-in",
        end: "Check-out",
      };
    default:
      return {
        start: "Start",
        end: "End",
      };
  }
}

function formatCost(tripItem) {
  if (tripItem.cost === null || tripItem.cost === undefined) {
    return "";
  }

  return `${tripItem.currencyCode || "AUD"} ${Number(tripItem.cost).toLocaleString("en-AU")}`;
}

function TripItemCard({ tripItem }) {
  const timeLabels = getTimeLabels(tripItem.type);
  const formattedCost = formatCost(tripItem);

  return (
    <ContentCard
      sx={{
        display: "flex",
        height: "100%",
      }}
    >
      <Stack
        sx={{
          flexGrow: 1,
          width: "100%",
          gap: 2,
        }}
      >
        <Typography
          component="h4"
          sx={{
            color: "text.primary",
            fontSize: {
              xs: "1.35rem",
              sm: "1.5rem",
            },
            fontWeight: 700,
          }}
        >
          {tripItem.title}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "5.25rem minmax(0, 1fr)",
              md: "7rem minmax(0, 1fr) 8rem minmax(0, 1fr)",
            },
            columnGap: 1.5,
            rowGap: 1,
            alignItems: "center",
          }}
        >
          <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
            Type:
          </Typography>

          <Box sx={{ ml: "-7px" }}>
            <Chip
              label={formatTripItemLabel(tripItem.type)}
              size="small"
              sx={(theme) => ({
                bgcolor: theme.palette.tripItemType.background,
                color: theme.palette.tripItemType.text,
                fontWeight: 600,
              })}
            />
          </Box>

          <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
            Status:
          </Typography>

          <Box sx={{ ml: "-7px" }}>
            <Chip
              label={formatTripItemLabel(tripItem.status)}
              size="small"
              sx={(theme) => {
                const colours =
                  theme.palette.status[tripItem.status] || theme.palette.status.planned;

                return {
                  bgcolor: colours.background,
                  color: colours.text,
                  fontWeight: 600,
                };
              }}
            />
          </Box>

          {tripItem.startDateTime ? (
            <>
              <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
                {timeLabels.start}:
              </Typography>
              <Typography>{formatLocalDateTime(tripItem.startDateTime)}</Typography>
            </>
          ) : null}

          {tripItem.endDateTime ? (
            <>
              <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
                {timeLabels.end}:
              </Typography>
              <Typography>{formatLocalDateTime(tripItem.endDateTime)}</Typography>
            </>
          ) : null}

          {tripItem.location ? (
            <>
              <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
                Location:
              </Typography>
              <Typography>{tripItem.location}</Typography>
            </>
          ) : null}

          {tripItem.provider ? (
            <>
              <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
                Provider:
              </Typography>
              <Typography>{tripItem.provider}</Typography>
            </>
          ) : null}

          {tripItem.bookingReference ? (
            <>
              <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
                Booking ref:
              </Typography>
              <Typography>{tripItem.bookingReference}</Typography>
            </>
          ) : null}

          {formattedCost ? (
            <>
              <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
                Cost:
              </Typography>
              <Typography>{formattedCost}</Typography>
            </>
          ) : null}

          {tripItem.notes ? (
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
              <Typography color="text.secondary">{tripItem.notes}</Typography>
            </>
          ) : null}
        </Box>

        <Box sx={{ mt: "auto" }}>
          <Button
            fullWidth
            component={RouterLink}
            to={`/trips/${tripItem.tripId}/items/${tripItem.id}/edit`}
            variant="outlined"
          >
            Edit item
          </Button>
        </Box>
      </Stack>
    </ContentCard>
  );
}

export default TripItemCard;
