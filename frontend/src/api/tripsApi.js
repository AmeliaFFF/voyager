import { apiRequest } from "./apiClient.js";

export function getTrips(token, filters = {}) {
  const searchParams = new URLSearchParams();

  if (filters.status) {
    searchParams.set("status", filters.status);
  }

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return apiRequest(`/trips${query}`, {
    method: "GET",
    token,
  });
}

export function getTripById(token, tripId) {
  return apiRequest(`/trips/${tripId}`, {
    method: "GET",
    token,
  });
}

export function createTrip(token, tripDetails) {
  return apiRequest("/trips", {
    method: "POST",
    token,
    body: tripDetails,
  });
}

export function updateTrip(token, tripId, tripDetails) {
  return apiRequest(`/trips/${tripId}`, {
    method: "PATCH",
    token,
    body: tripDetails,
  });
}

export function deleteTrip(token, tripId) {
  return apiRequest(`/trips/${tripId}`, {
    method: "DELETE",
    token,
  });
}
