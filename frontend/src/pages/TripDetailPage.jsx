import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation, useParams, useSearchParams } from "react-router-dom";
import { getTripItems } from "../api/tripItemsApi.js";
import { getTripById } from "../api/tripsApi.js";
import ContentCard from "../components/ContentCard.jsx";
import FeedbackMessage from "../components/FeedbackMessage.jsx";
import TripItemCard from "../components/TripItemCard.jsx";
import { tripItemStatusOptions, tripItemTypeOptions } from "../constants/tripItemConstants.js";
import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { formatStatusLabel } from "../utils/statusUtils.js";
import { formatLocalDate, groupTripItemsByDate } from "../utils/tripItemUtils.js";
import { exportTripItinerary } from "../api/exportApi.js";

const typeFilterOptions = [
  {
    value: "all",
    label: "All types",
  },
  ...tripItemTypeOptions,
];

const statusFilterOptions = [
  {
    value: "all",
    label: "All statuses",
  },
  ...tripItemStatusOptions,
];

function formatTripDates(trip) {
  if (!trip.startDate || !trip.endDate) {
    return "Dates not set";
  }

  return `${formatLocalDate(trip.startDate)} - ${formatLocalDate(trip.endDate)}`;
}

function formatBudget(trip) {
  if (trip.budget === null || trip.budget === undefined) {
    return "Budget not set";
  }

  return `${trip.currencyCode || "AUD"} ${Number(trip.budget).toLocaleString("en-AU")}`;
}

function createItineraryFileName(trip) {
  const safeTitle = trip.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return `${safeTitle || "trip"}-itinerary.pdf`;
}

function TripDetailPage() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const returnTo = `${location.pathname}${location.search}`;
  const backToTrips = location.state?.returnTo || "/trips";

  const [trip, setTrip] = useState(null);
  const [tripItems, setTripItems] = useState([]);
  const typeFilter = searchParams.get("type") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const hasActiveFilters = typeFilter !== "all" || statusFilter !== "all";
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [exportErrorMessage, setExportErrorMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  async function handleExportItinerary() {
    setIsExporting(true);
    setExportErrorMessage("");

    try {
      const pdfBlob = await exportTripItinerary(token, trip.id);
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = pdfUrl;
      downloadLink.download = createItineraryFileName(trip);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    } catch (error) {
      setExportErrorMessage(getErrorMessage(error));
    } finally {
      setIsExporting(false);
    }
  }

  const filteredTripItems = useMemo(() => {
    return tripItems.filter((tripItem) => {
      const matchesType = typeFilter === "all" || tripItem.type === typeFilter;
      const matchesStatus = statusFilter === "all" || tripItem.status === statusFilter;

      return matchesType && matchesStatus;
    });
  }, [statusFilter, tripItems, typeFilter]);

  const groupedTripItemEntries = useMemo(() => {
    const groupedTripItems = groupTripItemsByDate(filteredTripItems);

    return Object.entries(groupedTripItems);
  }, [filteredTripItems]);

  useEffect(() => {
    async function loadTripDetails() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [tripResponse, tripItemsResponse] = await Promise.all([
          getTripById(token, tripId),
          getTripItems(token, tripId),
        ]);

        setTrip(tripResponse.data);
        setTripItems(tripItemsResponse.data?.tripItems || []);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadTripDetails();
  }, [token, tripId]);

  function handleTypeFilterChange(event) {
    const nextTypeFilter = event.target.value;
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextTypeFilter === "all") {
      nextSearchParams.delete("type");
    } else {
      nextSearchParams.set("type", nextTypeFilter);
    }

    setSearchParams(nextSearchParams, {
      state: location.state,
    });
  }

  function handleStatusFilterChange(event) {
    const nextStatusFilter = event.target.value;
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextStatusFilter === "all") {
      nextSearchParams.delete("status");
    } else {
      nextSearchParams.set("status", nextStatusFilter);
    }

    setSearchParams(nextSearchParams, {
      state: location.state,
    });
  }

  function handleClearFilters() {
    setSearchParams(
      {},
      {
        state: location.state,
      },
    );
  }

  return (
    <Stack component="section" spacing={3} sx={{ width: "100%" }}>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        alignItems={{
          xs: "stretch",
          sm: "flex-start",
        }}
        sx={{
          gap: 2,
          width: "100%",
        }}
      >
        <Stack
          spacing={1}
          sx={{
            order: {
              xs: 2,
              sm: 1,
            },
          }}
        >
          <Typography component="h1" variant="h1">
            Trip details
          </Typography>

          <Typography color="text.secondary">View trip details and itinerary items.</Typography>
        </Stack>

        <Button
          component={RouterLink}
          to={backToTrips}
          variant="outlined"
          sx={{
            minHeight: 44,
            px: 3,
            ml: {
              sm: "auto",
            },
            order: {
              xs: 1,
              sm: 2,
            },
            alignSelf: {
              xs: "stretch",
              sm: "flex-start",
            },
          }}
        >
          Back to trips
        </Button>
      </Stack>

      {errorMessage ? <FeedbackMessage>{errorMessage}</FeedbackMessage> : null}

      {isLoading ? <Typography>Loading trip...</Typography> : null}

      {!isLoading && !errorMessage && trip ? (
        <>
          <ContentCard>
            <Stack spacing={2}>
              <Typography component="h2" variant="h2">
                {trip.title}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "5.25rem minmax(0, 1fr)",
                    sm: "8.5rem minmax(0, 1fr)",
                  },
                  columnGap: 1.5,
                  rowGap: 1,
                  alignItems: "center",
                }}
              >
                <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Status:
                </Typography>

                <Box sx={{ ml: "-7px" }}>
                  <Chip
                    label={formatStatusLabel(trip.status)}
                    size="small"
                    sx={(theme) => {
                      const colours =
                        theme.palette.status[trip.status] || theme.palette.status.planned;

                      return {
                        bgcolor: colours.background,
                        color: colours.text,
                        fontWeight: 600,
                      };
                    }}
                  />
                </Box>

                <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Location:
                </Typography>
                <Typography>{trip.destination}</Typography>

                <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Dates:
                </Typography>
                <Typography>{formatTripDates(trip)}</Typography>

                <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>
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
                        whiteSpace: "pre-line",
                      }}
                    >
                      {trip.notes}
                    </Typography>
                  </>
                ) : null}
              </Box>
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                sx={{
                  gap: 1.5,
                  mt: 1,
                }}
              >
                <Button
                  fullWidth
                  component={RouterLink}
                  to={`/trips/${trip.id}/edit`}
                  state={{ returnTo, backToTrips }}
                  variant="outlined"
                >
                  Edit trip
                </Button>

                <Button
                  fullWidth
                  disabled={isExporting}
                  onClick={handleExportItinerary}
                  variant="outlined"
                >
                  {isExporting ? "Exporting PDF..." : "Export PDF"}
                </Button>
              </Stack>
              {exportErrorMessage ? <FeedbackMessage>{exportErrorMessage}</FeedbackMessage> : null}
            </Stack>
          </ContentCard>

          <Stack spacing={3} component="section" aria-labelledby="itinerary-heading">
            <Stack spacing={1}>
              <Typography id="itinerary-heading" component="h2" variant="h2">
                Itinerary
              </Typography>

              <Typography color="text.secondary">
                View the itinerary items linked to this trip.
              </Typography>
            </Stack>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
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
                label="Type"
                value={typeFilter}
                onChange={handleTypeFilterChange}
                sx={{
                  order: {
                    xs: 2,
                    sm: 1,
                  },
                  width: {
                    xs: "100%",
                    sm: 220,
                  },
                }}
              >
                {typeFilterOptions.map((typeOption) => (
                  <MenuItem key={typeOption.value} value={typeOption.value}>
                    {typeOption.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                sx={{
                  order: {
                    xs: 3,
                    sm: 2,
                  },
                  width: {
                    xs: "100%",
                    sm: 220,
                  },
                }}
              >
                {statusFilterOptions.map((statusOption) => (
                  <MenuItem key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                component={RouterLink}
                to={`/trips/${trip.id}/items/new`}
                state={{ returnTo, backToTrips }}
                variant="contained"
                sx={{
                  minHeight: 56,
                  px: 3,
                  fontSize: "1rem",
                  order: {
                    xs: 1,
                    sm: 3,
                  },
                  alignSelf: {
                    xs: "stretch",
                    sm: "center",
                  },
                }}
              >
                Add itinerary item
              </Button>

              {hasActiveFilters ? (
                <Button
                  onClick={handleClearFilters}
                  variant="outlined"
                  sx={{
                    minHeight: 56,
                    px: 3,
                    order: {
                      xs: 4,
                      sm: 4,
                    },
                    alignSelf: {
                      xs: "stretch",
                      sm: "center",
                    },
                  }}
                >
                  Clear filters
                </Button>
              ) : null}
            </Stack>

            {filteredTripItems.length === 0 ? (
              <ContentCard>
                <Stack spacing={1}>
                  <Typography
                    component="h3"
                    sx={{
                      color: "text.primary",
                      fontSize: {
                        xs: "1.35rem",
                        sm: "1.5rem",
                      },
                      fontWeight: 700,
                    }}
                  >
                    No itinerary items found
                  </Typography>

                  <Typography color="text.secondary">
                    Try changing the filters, or add a new itinerary item.
                  </Typography>
                </Stack>
              </ContentCard>
            ) : null}

            {groupedTripItemEntries.length > 0 ? (
              <Stack spacing={3}>
                {groupedTripItemEntries.map(([dateKey, itemsForDate]) => (
                  <Stack key={dateKey} spacing={2}>
                    <Typography
                      component="h3"
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                      }}
                    >
                      {formatLocalDate(dateKey)}
                    </Typography>

                    <Stack spacing={2}>
                      {itemsForDate.map((tripItem) => (
                        <TripItemCard key={tripItem.id} tripItem={tripItem} />
                      ))}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            ) : null}
          </Stack>
        </>
      ) : null}
    </Stack>
  );
}

export default TripDetailPage;
