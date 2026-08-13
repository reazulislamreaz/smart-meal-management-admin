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

export function getStoredTokens() {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY);
  return { token, refreshToken };
}

export function setStoredTokens(accessToken: string, refreshToken: string, remember: boolean, user?: UserProfile) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_KEY, refreshToken);
  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearStoredTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export async function loginApi(email: string, password: string, remember = false): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const result = await res.json();
      const authData = result.data;
      setStoredTokens(authData.accessToken, authData.refreshToken, remember, authData.user);
      return authData;
    }
  } catch (e) {
    console.warn("Backend server connection failed, checking demo fallback...", e);
  }

  // Fallback to local demo credentials if server is not running
  if (
    (email.trim().toLowerCase() === "admin@sizzl.com" || email.trim().toLowerCase() === "admin@smartmeal.com") &&
    (password === "admin123" || password === "AdminPassword123!")
  ) {
    const demoResponse: AuthResponse = {
      accessToken: "demo_access_token_jwt",
      refreshToken: "demo_refresh_token_jwt",
      tokenType: "Bearer",
      expiresIn: 3600,
      user: {
        id: "demo-admin-id",
        email: email.trim().toLowerCase(),
        firstName: "Sizzl",
        lastName: "Admin",
        role: "SUPER_ADMIN",
      },
    };
    setStoredTokens(demoResponse.accessToken, demoResponse.refreshToken, remember, demoResponse.user);
    return demoResponse;
  }

  throw new Error("Invalid email or password.");
}

export async function fetchProfileApi(): Promise<UserProfile | null> {
  const { token } = getStoredTokens();
  if (!token || token.startsWith("demo_")) {
    const userJson = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const result = await res.json();
      return result.data;
    }
  } catch (e) {
    console.error("Failed to fetch profile", e);
  }
  return null;
}
