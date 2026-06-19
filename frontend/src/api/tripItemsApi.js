import { apiRequest } from "./apiClient.js";

export function getTripItems(token, tripId, filters = {}) {
  const searchParams = new URLSearchParams();

  if (filters.type) {
    searchParams.set("type", filters.type);
  }

  if (filters.status) {
    searchParams.set("status", filters.status);
  }

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return apiRequest(`/trips/${tripId}/items${query}`, {
    method: "GET",
    token,
  });
}

export function getTripItemById(token, tripItemId) {
  return apiRequest(`/trip-items/${tripItemId}`, {
    method: "GET",
    token,
  });
}

export function createTripItem(token, tripId, tripItemDetails) {
  return apiRequest(`/trips/${tripId}/items`, {
    method: "POST",
    token,
    body: tripItemDetails,
  });
}

export function updateTripItem(token, tripItemId, tripItemDetails) {
  return apiRequest(`/trip-items/${tripItemId}`, {
    method: "PATCH",
    token,
    body: tripItemDetails,
  });
}

export function deleteTripItem(token, tripItemId) {
  return apiRequest(`/trip-items/${tripItemId}`, {
    method: "DELETE",
    token,
  });
}
