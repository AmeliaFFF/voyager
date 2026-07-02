import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createTripItem } from "../api/tripItemsApi.js";
import ContentCard from "../components/ContentCard.jsx";
import FeedbackMessage from "../components/FeedbackMessage.jsx";
import TripItemForm from "../components/TripItemForm.jsx";
import { defaultTripItemFormData } from "../constants/tripItemConstants.js";
import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { validateTripItemForm } from "../utils/tripItemValidation.js";

function NewTripItemPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const returnTo = location.state?.returnTo || `/trips/${tripId}`;
  const backToTrips = location.state?.backToTrips;

  const [formData, setFormData] = useState(defaultTripItemFormData);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorMessageRef = useRef(null);

  useEffect(() => {
    if (errorMessage) {
      errorMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [errorMessage]);

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
      location: formData.location.trim() || undefined,
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime || undefined,
      provider: formData.provider.trim() || undefined,
      bookingReference: formData.bookingReference.trim() || undefined,
      cost: formData.cost === "" ? undefined : Number(formData.cost),
      currencyCode: formData.currencyCode.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };
  }

  function navigateBackToTripDetail() {
    navigate(returnTo, {
      state: backToTrips ? { returnTo: backToTrips } : undefined,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    const validationMessage = validateTripItemForm(formData);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      await createTripItem(token, tripId, buildTripItemPayload());
      navigateBackToTripDetail();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    navigateBackToTripDetail();
  }

  return (
    <Stack component="section" spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h1">
          Add itinerary item
        </Typography>

        <Typography color="text.secondary">
          Add a flight, transport, accommodation, tour, cruise, activity, or other item to this
          trip.
        </Typography>
      </Stack>

      {errorMessage ? (
        <Box ref={errorMessageRef}>
          <FeedbackMessage>{errorMessage}</FeedbackMessage>
        </Box>
      ) : null}

      <ContentCard>
        <TripItemForm
          formData={formData}
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitButtonLabel="Create item"
        />
      </ContentCard>
    </Stack>
  );
}

export default NewTripItemPage;
