import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { getTrips } from "../api/tripsApi.js";
import ContentCard from "../components/ContentCard.jsx";
import FeedbackMessage from "../components/FeedbackMessage.jsx";
import TripCard from "../components/TripCard.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { sortTripsByStatusAndDate } from "../utils/statusUtils.js";

const statusOptions = [
  {
    value: "all",
    label: "All statuses",
  },
  {
    value: "planned",
    label: "Planned",
  },
  {
    value: "booked",
    label: "Booked",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

function TripsPage() {
  const { token } = useAuth();

  const [trips, setTrips] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const sortedTrips = sortTripsByStatusAndDate(trips);

  useEffect(() => {
    async function loadTrips() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getTrips(token, {
          status: statusFilter === "all" ? "" : statusFilter,
        });

        setTrips(response.data?.trips || []);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadTrips();
  }, [statusFilter, token]);

  function handleStatusFilterChange(event) {
    setStatusFilter(event.target.value);
  }

  return (
    <Stack component="section" spacing={3} sx={{ width: "100%" }}>
      <Box>
        <Typography component="h1" variant="h1">
          Trips
        </Typography>

        <Typography color="text.secondary">View and manage your travel plans.</Typography>
      </Box>

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        sx={{
          gap: 2,
        }}
      >
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          sx={{
            order: {
              xs: 2,
              sm: 1,
            },
            width: {
              xs: "100%",
              sm: 260,
            },
          }}
        >
          {statusOptions.map((statusOption) => (
            <MenuItem key={statusOption.value} value={statusOption.value}>
              {statusOption.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          component={RouterLink}
          to="/trips/new"
          variant="contained"
          sx={{
            minHeight: 56,
            px: 3,
            fontSize: "1rem",
            order: {
              xs: 1,
              sm: 2,
            },
            alignSelf: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          Create trip
        </Button>
      </Stack>

      {errorMessage ? <FeedbackMessage>{errorMessage}</FeedbackMessage> : null}

      {!isLoading && !errorMessage && trips.length === 0 ? (
        <ContentCard>
          <Stack spacing={1}>
            <Typography component="h2" variant="h2">
              No trips found
            </Typography>

            <Typography color="text.secondary">
              Try changing the status filter, or create a new trip.
            </Typography>
          </Stack>
        </ContentCard>
      ) : null}

      {!isLoading && !errorMessage && sortedTrips.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
          }}
        >
          {sortedTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </Box>
      ) : null}
    </Stack>
  );
}

export default TripsPage;
