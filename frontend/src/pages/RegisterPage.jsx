import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ContentCard from "../components/ContentCard.jsx";
import FeedbackMessage from "../components/FeedbackMessage.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { validateRegisterForm } from "../utils/authValidation.js";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    const validationMessage = validateRegisterForm(formData);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData);
      navigate("/login", {
        state: {
          successMessage: "Account created successfully. Please log in.",
        },
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Stack component="section" spacing={3}>
      <Box>
        <Typography component="h1" variant="h1">
          Create an account
        </Typography>

        <Typography color="text.secondary">
          Create a Voyager account to start planning your trips.
        </Typography>
      </Box>

      <ContentCard>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            {errorMessage ? <FeedbackMessage>{errorMessage}</FeedbackMessage> : null}

            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>

            <Button component={RouterLink} to="/login" variant="outlined">
              Already have an account? Log in
            </Button>
          </Stack>
        </Box>
      </ContentCard>
    </Stack>
  );
}

export default RegisterPage;
