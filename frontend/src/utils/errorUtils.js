const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again.";

// Converts different error shapes into one user-friendly message for UI error states.
export function getErrorMessage(error) {
  if (!error) {
    return FALLBACK_ERROR_MESSAGE;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  return FALLBACK_ERROR_MESSAGE;
}
