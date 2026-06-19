import { apiRequest } from "./apiClient.js";

export function registerUser(userDetails) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: userDetails,
  });
}

export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function getCurrentUser(token) {
  return apiRequest("/auth/me", {
    method: "GET",
    token,
  });
}
