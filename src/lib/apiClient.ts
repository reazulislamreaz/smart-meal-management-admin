import {
  getStoredTokens,
  isJwtExpired,
  refreshTokenApi,
  dispatchSessionExpired,
} from "./auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  let { token } = getStoredTokens();
  const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/refresh");

  // If accessToken is close to expiry and this is an authenticated call, perform silent refresh
  if (token && !isAuthEndpoint && isJwtExpired(token)) {
    const refreshedToken = await refreshTokenApi();
    if (refreshedToken) {
      token = refreshedToken;
    } else if (!isRetry) {
      dispatchSessionExpired("Your login session has expired. Please log in again to continue.");
      throw new ApiError("Session expired. Please log in again.", 401, null);
    }
  }

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !isAuthEndpoint) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 with automatic refresh token rotation & single retry
    if (response.status === 401 && !isAuthEndpoint && !isRetry) {
      const refreshedToken = await refreshTokenApi();
      if (refreshedToken) {
        return request<T>(endpoint, options, true);
      } else {
        dispatchSessionExpired("Your session has expired. Please log in again.");
        throw new ApiError("Session expired. Please log in again.", 401, null);
      }
    }

    const contentType = response.headers.get("content-type");
    let jsonResult: any = null;
    if (contentType && contentType.includes("application/json")) {
      jsonResult = await response.json();
    }

    if (!response.ok) {
      const errorMsg =
        jsonResult?.message ||
        (Array.isArray(jsonResult?.message) ? jsonResult.message.join(", ") : null) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMsg, response.status, jsonResult);
    }

    if (jsonResult && jsonResult.data !== undefined && jsonResult.meta !== undefined) {
      return { data: jsonResult.data, meta: jsonResult.meta } as unknown as T;
    }

    return (jsonResult?.data !== undefined ? jsonResult.data : jsonResult) as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || "Network connection error",
      0,
      null,
    );
  }
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

export default api;
