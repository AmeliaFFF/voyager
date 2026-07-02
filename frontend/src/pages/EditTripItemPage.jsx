import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteTripItem, getTripItemById, updateTripItem } from "../api/tripItemsApi.js";
import ContentCard from "../components/ContentCard.jsx";
import FeedbackMessage from "../components/FeedbackMessage.jsx";
import TripItemForm from "../components/TripItemForm.jsx";
import { defaultTripItemFormData } from "../constants/tripItemConstants.js";
import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { formatApiDateTimeForInput, validateTripItemForm } from "../utils/tripItemValidation.js";

function EditTripItemPage() {
  const navigate = useNavigate();
  const { tripId, tripItemId } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const returnTo = location.state?.returnTo || `/trips/${tripId}`;
  const backToTrips = location.state?.backToTrips;

  const [formData, setFormData] = useState(defaultTripItemFormData);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const formErrorMessageRef = useRef(null);

  useEffect(() => {
    if (formErrorMessage) {
      formErrorMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [formErrorMessage]);

  useEffect(() => {
    async function loadTripItem() {
      setIsLoading(true);
      setLoadErrorMessage("");
      setFormErrorMessage("");

      try {
        const response = await getTripItemById(token, tripItemId);
        const tripItem = response.data;

        setFormData({
          type: tripItem.type || "",
          status: tripItem.status || "planned",
          title: tripItem.title || "",
          location: tripItem.location || "",
          startDateTime: formatApiDateTimeForInput(tripItem.startDateTime),
          endDateTime: formatApiDateTimeForInput(tripItem.endDateTime),
          provider: tripItem.provider || "",
          bookingReference: tripItem.bookingReference || "",
          cost: tripItem.cost === null || tripItem.cost === undefined ? "" : String(tripItem.cost),
          currencyCode: tripItem.currencyCode || "AUD",
          notes: tripItem.notes || "",
        });
      } catch (error) {
        setLoadErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadTripItem();
  }, [token, tripItemId]);

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

  function buildTripItemPayload() {
    return {
      type: formData.type,
      status: formData.status,
      title: formData.title.trim(),
      location: formData.location.trim(),
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime,
      provider: formData.provider.trim(),
      bookingReference: formData.bookingReference.trim(),
      cost: formData.cost === "" ? null : Number(formData.cost),
      currencyCode: formData.currencyCode.trim(),
      notes: formData.notes.trim(),
    };
  }

  function navigateBackToTripDetail() {
    navigate(returnTo, {
      state: backToTrips ? { returnTo: backToTrips } : undefined,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormErrorMessage("");

    const validationMessage = validateTripItemForm(formData);

    if (validationMessage) {
      setFormErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      await updateTripItem(token, tripItemId, buildTripItemPayload());
      navigateBackToTripDetail();
    } catch (error) {
      setFormErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    navigateBackToTripDetail();
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
      await deleteTripItem(token, tripItemId);
      navigateBackToTripDetail();
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
          Edit itinerary item
        </Typography>

        <Typography color="text.secondary">
          Update or delete an itinerary item linked to this trip.
        </Typography>
      </Stack>

      {loadErrorMessage ? <FeedbackMessage>{loadErrorMessage}</FeedbackMessage> : null}

      {isLoading ? <Typography>Loading itinerary item...</Typography> : null}

      {!isLoading && !loadErrorMessage ? (
        <ContentCard>
          <Stack spacing={3}>
            {formErrorMessage ? (
              <Box ref={formErrorMessageRef}>
                <FeedbackMessage>{formErrorMessage}</FeedbackMessage>
              </Box>
            ) : null}

            <TripItemForm
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
                    This will permanently delete this itinerary item.
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

export default EditTripItemPage;
