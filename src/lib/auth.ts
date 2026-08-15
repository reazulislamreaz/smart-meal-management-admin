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

export function isJwtExpired(token?: string | null): boolean {
  if (!token) return true;
  if (token.startsWith("demo_")) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowInSeconds;
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

export function getStoredTokens() {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY);
  return { token, refreshToken };
}

export function setStoredTokens(accessToken: string, refreshToken: string, remember: boolean, user?: UserProfile) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_KEY, refreshToken);
  storage.setItem("sizzl-auth", "1");
  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearStoredTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("sizzl-auth");
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem("sizzl-auth");
}

export async function loginApi(email: string, password: string, remember = false): Promise<AuthResponse> {
  const cleanEmail = email.trim();
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

  const authData = jsonResult.data;
  if (!authData || !authData.accessToken) {
    throw new Error("Invalid response received from authentication server.");
  }

  // Strictly enforce SUPER_ADMIN role
  if (authData.user?.role !== "SUPER_ADMIN") {
    throw new Error("Access denied. Super Admin credentials required to access the Admin Panel.");
  }

  setStoredTokens(authData.accessToken, authData.refreshToken, remember, authData.user);
  return authData;
}

export async function fetchProfileApi(): Promise<UserProfile | null> {
  const { token } = getStoredTokens();
  if (!token || token.startsWith("demo_")) {
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
    console.error("Failed to fetch profile", e);
  }
  return null;
}
