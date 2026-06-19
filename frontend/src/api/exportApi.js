const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// PDF export returns a file blob rather than JSON, so it uses custom response handling.
export async function exportTripItinerary(token, tripId) {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}/trips/${tripId}/export/itinerary`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = "PDF export failed. Please try again.";

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      message = data?.message || message;
    }

    throw new Error(message);
  }

  return response.blob();
}
