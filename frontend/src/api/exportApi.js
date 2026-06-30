import { apiBlobRequest } from "./apiClient.js";

// PDF export returns a file blob rather than JSON, so it uses blob response handling.
export function exportTripItinerary(token, tripId) {
  return apiBlobRequest(`/trips/${tripId}/export/itinerary`, {
    method: "POST",
    token,
    errorMessage: "PDF export failed. Please try again.",
  });
}
