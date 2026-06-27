import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { createTrip } from "../api/tripsApi.js";
import ContentCard from "../components/ContentCard.jsx";
import FeedbackMessage from "../components/FeedbackMessage.jsx";
import TripForm from "../components/TripForm.jsx";
import { defaultTripFormData } from "../constants/tripConstants.js";
import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { validateTripForm } from "../utils/tripValidation.js";

function NewTripPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState(defaultTripFormData);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      budget: formData.budget === "" ? undefined : Number(formData.budget),
      currencyCode: formData.currencyCode.trim() || undefined,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    const validationMessage = validateTripForm(formData);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      await createTrip(token, buildTripPayload());
      navigate("/trips");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    navigate("/trips");
  }

  return (
    <Stack component="section" spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h1">
          Create trip
        </Typography>

        <Typography color="text.secondary">Add the main details for a new trip.</Typography>
      </Stack>

      {errorMessage ? <FeedbackMessage>{errorMessage}</FeedbackMessage> : null}

      <ContentCard>
        <TripForm
          formData={formData}
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitButtonLabel="Create trip"
        />
      </ContentCard>
    </Stack>
  );
}

export default NewTripPage;
