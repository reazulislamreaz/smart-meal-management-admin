const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SUPER_ADMIN" | "USER";
  weeklyBudget?: number;
  cuisinePreferences?: string[];
  dietaryRestrictions?: string[];
  avatarUrl?: string;
  phoneNumber?: string;
  address?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

const TOKEN_KEY = "sizzl_access_token";
const REFRESH_KEY = "sizzl_refresh_token";
const USER_KEY = "sizzl_user_profile";
const AUTH_FLAG = "sizzl-auth";

export function isJwtExpired(token?: string | null, bufferSeconds = 15): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowInSeconds + bufferSeconds;
  } catch {
    return false;
  }
}

export function dispatchSessionExpired(reason?: string) {
  window.dispatchEvent(
    new CustomEvent("sizzl:session-expired", {
      detail: {
        message:
          reason ||
          "Your login session has expired. Please enter your credentials again to continue.",
      },
    }),
  );
}

export function getStoredTokens(): {
  token: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
} {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY);
  const userJson = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  let user: UserProfile | null = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch {
      user = null;
    }
  }
  return { token, refreshToken, user };
}

export function setStoredTokens(
  accessToken: string,
  refreshToken: string,
  remember: boolean,
  user?: UserProfile,
) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_KEY, refreshToken);
  storage.setItem(AUTH_FLAG, "1");
  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearStoredTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_FLAG);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(AUTH_FLAG);
}

/**
 * Authenticates against backend with real email & password.
 * Issues signed JWT accessToken and PostgreSQL-backed refreshToken.
 */
export async function loginApi(
  email: string,
  password: string,
  remember = false,
): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: cleanEmail, password }),
  });

  const jsonResult = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg =
      jsonResult?.message ||
      (Array.isArray(jsonResult?.message) ? jsonResult.message.join(", ") : null) ||
      "Invalid email or password.";
    throw new Error(errorMsg);
  }

  const authData: AuthResponse = jsonResult.data;
  if (!authData || !authData.accessToken) {
    throw new Error("Invalid response received from authentication server.");
  }

  // Strictly enforce SUPER_ADMIN role for the Admin Dashboard
  if (authData.user?.role !== "SUPER_ADMIN") {
    throw new Error("Access denied. Super Admin role required to access the Platform Dashboard.");
  }

  setStoredTokens(authData.accessToken, authData.refreshToken, remember, authData.user);
  return authData;
}

// In-flight refresh promise to prevent concurrent refresh requests
let refreshPromise: Promise<string | null> | null = null;

/**
 * Rotates the refreshToken against the live backend and receives a new accessToken pair.
 */
export async function refreshTokenApi(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const { refreshToken } = getStoredTokens();
    if (!refreshToken) {
      clearStoredTokens();
      return null;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        clearStoredTokens();
        return null;
      }

      const jsonResult = await res.json();
      const data = jsonResult.data;

      if (data?.accessToken && data?.refreshToken) {
        const isRemembered = localStorage.getItem("sizzl_remember_me") === "1";
        setStoredTokens(data.accessToken, data.refreshToken, isRemembered, data.user);
        return data.accessToken;
      }
    } catch (err) {
      console.warn("Automatic token refresh failed:", err);
    } finally {
      refreshPromise = null;
    }

    return null;
  })();

  return refreshPromise;
}

/**
 * Revokes the active session on the backend and clears all client storage.
 */
export async function logoutApi(): Promise<void> {
  const { refreshToken } = getStoredTokens();
  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (e) {
      console.warn("Backend logout API notification failed:", e);
    }
  }
  clearStoredTokens();
}

export async function fetchProfileApi(): Promise<UserProfile | null> {
  let { token } = getStoredTokens();

  if (isJwtExpired(token)) {
    token = await refreshTokenApi();
  }

  if (!token) {
    clearStoredTokens();
    return null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const result = await res.json();
      const user = result.data;
      if (user && user.role === "SUPER_ADMIN") {
        return user;
      }
    }
  } catch (e) {
    console.error("Failed to fetch Super Admin profile", e);
  }
  return null;
}
