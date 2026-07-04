import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import ContentCard from "../components/ContentCard.jsx";
import FeedbackMessage from "../components/FeedbackMessage.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { validateLoginForm } from "../utils/authValidation.js";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;
  const fromLocation = location.state?.from;
  const redirectPath = fromLocation
    ? `${fromLocation.pathname}${fromLocation.search || ""}${fromLocation.hash || ""}`
    : "/trips";
  const { login } = useAuth();

  const [formData, setFormData] = useState({
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

    const validationMessage = validateLoginForm(formData);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData);
      navigate(redirectPath, { replace: true });
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
          Log in
        </Typography>

        <Typography color="text.secondary">Log in to view and manage your trips.</Typography>
      </Box>

      <ContentCard>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            {successMessage ? (
              <FeedbackMessage severity="success">{successMessage}</FeedbackMessage>
            ) : null}
            {errorMessage ? <FeedbackMessage>{errorMessage}</FeedbackMessage> : null}

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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>

            <Button component={RouterLink} to="/register" variant="outlined">
              Create an account
            </Button>
          </Stack>
        </Box>
      </ContentCard>
    </Stack>
  );
}

export default LoginPage;
