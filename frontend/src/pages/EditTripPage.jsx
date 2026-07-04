import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteTrip, getTripById, updateTrip } from "../api/tripsApi.js";
import ContentCard from "../components/ContentCard.jsx";
import FeedbackMessage from "../components/FeedbackMessage.jsx";
import TripForm from "../components/TripForm.jsx";
import { defaultTripFormData } from "../constants/tripConstants.js";
import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { formatApiDateForInput, validateTripForm } from "../utils/tripValidation.js";

function EditTripPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/trips";
  const backToTrips = location.state?.backToTrips;

  const [formData, setFormData] = useState(defaultTripFormData);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      setIsLoading(true);
      setLoadErrorMessage("");
      setFormErrorMessage("");

      try {
        const response = await getTripById(token, tripId);
        const trip = response.data;

        setFormData({
          title: trip.title || "",
          destination: trip.destination || "",
          startDate: formatApiDateForInput(trip.startDate),
          endDate: formatApiDateForInput(trip.endDate),
          status: trip.status || "planned",
          budget: trip.budget === null || trip.budget === undefined ? "" : String(trip.budget),
          currencyCode: trip.currencyCode || "",
          notes: trip.notes || "",
        });
      } catch (error) {
        setLoadErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadTrip();
  }, [token, tripId]);

  function handleChange(event) {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "currencyCode") {
      nextValue = value
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 3);
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: nextValue,
    }));
  }

  function buildTripPayload() {
    return {
      title: formData.title.trim(),
      destination: formData.destination.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      notes: formData.notes.trim(),
      budget: formData.budget === "" ? null : Number(formData.budget),
      currencyCode: formData.currencyCode.trim() || undefined,
    };
  }

  function navigateBack() {
    navigate(returnTo, {
      state: backToTrips ? { returnTo: backToTrips } : undefined,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormErrorMessage("");

    const validationMessage = validateTripForm(formData);

    if (validationMessage) {
      setFormErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      await updateTrip(token, tripId, buildTripPayload());
      navigateBack();
    } catch (error) {
      setFormErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    navigateBack();
  }

  function handleStartDelete() {
    setFormErrorMessage("");
    setIsConfirmingDelete(true);
  }

  function handleCancelDelete() {
    setIsConfirmingDelete(false);
  }

  async function handleDelete() {
    setFormErrorMessage("");
    setIsDeleting(true);

    try {
      await deleteTrip(token, tripId);
      navigate("/trips");
    } catch (error) {
      setFormErrorMessage(getErrorMessage(error));
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  }

  return (
    <Stack component="section" spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h1">
          Edit trip
        </Typography>

        <Typography color="text.secondary">Update the main details for this trip.</Typography>
      </Stack>

      {loadErrorMessage ? <FeedbackMessage>{loadErrorMessage}</FeedbackMessage> : null}

      {isLoading ? <Typography>Loading trip...</Typography> : null}

      {!isLoading && !loadErrorMessage ? (
        <ContentCard>
          <Stack spacing={3}>
            {formErrorMessage ? <FeedbackMessage>{formErrorMessage}</FeedbackMessage> : null}
            <TripForm
              formData={formData}
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
              onChange={handleChange}
              onDelete={handleStartDelete}
              onSubmit={handleSubmit}
              showDeleteButton
              submitButtonLabel="Save changes"
            />

            {isConfirmingDelete ? (
              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                alignItems={{
                  xs: "stretch",
                  md: "center",
                }}
                sx={{
                  gap: 2,
                  mt: 3,
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <FeedbackMessage>
                    This will permanently delete this trip and its itinerary items.
                  </FeedbackMessage>
                </Box>

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  sx={{
                    gap: 1.5,
                    flexShrink: 0,
                  }}
                >
                  <Button
                    color="error"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    variant="contained"
                    sx={{
                      minHeight: 44,
                      px: 3,
                      width: {
                        xs: "100%",
                        sm: "auto",
                      },
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Confirm delete"}
                  </Button>

                  <Button
                    disabled={isDeleting}
                    onClick={handleCancelDelete}
                    variant="outlined"
                    sx={{
                      minHeight: 44,
                      px: 3,
                      width: {
                        xs: "100%",
                        sm: "auto",
                      },
                    }}
                  >
                    Cancel delete
                  </Button>
                </Stack>
              </Stack>
            ) : null}
          </Stack>
        </ContentCard>
      ) : null}
    </Stack>
  );
}

export default EditTripPage;
