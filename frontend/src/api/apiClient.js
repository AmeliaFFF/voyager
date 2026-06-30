const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NETWORK_ERROR_MESSAGE = "Could not connect to the server. Please try again shortly.";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return null;
}

async function parseErrorMessage(response, fallbackMessage) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    try {
      const data = await response.json();

      return data?.message || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  }

  return fallbackMessage;
}

function buildHeaders(token, customHeaders = {}, options = {}) {
  const { includeContentType = true } = options;

  const headers = {
    ...customHeaders,
  };

  if (includeContentType && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// Centralises JSON API requests so pages/components do not repeat fetch, auth header, JSON parsing, and backend error handling logic.
export async function apiRequest(path, options = {}) {
  const { body, headers, token, ...fetchOptions } = options;

  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers: buildHeaders(token, headers),
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || "Request failed. Please try again.");
  }

  return data;
}

// Centralises file/blob API requests, such as the PDF export.
export async function apiBlobRequest(path, options = {}) {
  const {
    errorMessage = "File request failed. Please try again.",
    headers,
    token,
    ...fetchOptions
  } = options;

  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers: buildHeaders(token, headers, {
        includeContentType: false,
      }),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response, errorMessage);

    throw new Error(message);
  }

  return response.blob();
}
