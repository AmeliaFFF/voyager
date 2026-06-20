const TOKEN_STORAGE_KEY = "voyagerAuthToken";

// Keeps auth token storage logic in one place so the storage key is not repeated across the app.
export function saveToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}
