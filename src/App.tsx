import { useState, useEffect } from "react";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppDataProvider from "@/context/AppDataContext";
import Shell from "@/components/layout/Shell";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/Users";
import DetailCard from "@/pages/DetailCard";
import Meals from "@/pages/Meals";
import MealOptions from "@/pages/MealOptions";
import Coupons from "@/pages/Coupons";
import Messages from "@/pages/Messages";
import SubscriptionOverview from "@/pages/SubscriptionOverview";
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import SubscriptionForm from "@/pages/SubscriptionForm";
import Earnings from "@/pages/Earnings";
import GeneralSettings from "@/pages/settings/GeneralSettings";
import BasicSettingsForm from "@/pages/settings/BasicSettingsForm";
import AppConfiguration from "@/pages/settings/AppConfiguration";
import TextSettings from "@/pages/settings/TextSettings";
import ContactSettings from "@/pages/settings/ContactSettings";
import AuditLogs from "@/pages/settings/AuditLogs";
import SessionExpiredModal from "@/components/common/SessionExpiredModal";

import {
  clearStoredTokens,
  getStoredTokens,
  isJwtExpired,
  refreshTokenApi,
  logoutApi,
} from "@/lib/auth";

function isAuthenticated() {
  const { token, refreshToken } = getStoredTokens();
  const hasAuthFlag =
    localStorage.getItem("sizzl-auth") === "1" ||
    sessionStorage.getItem("sizzl-auth") === "1";
  return !!(token || refreshToken) && hasAuthFlag;
}

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [sessionExpiredModal, setSessionExpiredModal] = useState<{
    isOpen: boolean;
    message?: string;
  }>({
    isOpen: false,
    message: "",
  });

  const handleLogin = () => setAuthed(true);

  const handleLogout = async () => {
    await logoutApi();
    setAuthed(false);
  };

  const handleSessionExpiredLogin = () => {
    clearStoredTokens();
    setSessionExpiredModal({ isOpen: false, message: "" });
    setAuthed(false);
  };

  useEffect(() => {
    // 1. Listen for custom session-expired event dispatched by API calls
    const handleExpiredEvent = (e: any) => {
      if (authed) {
        setSessionExpiredModal({
          isOpen: true,
          message:
            e.detail?.message ||
            "Your login session has expired for security reasons. Please log in again to continue.",
        });
      }
    };
    window.addEventListener("sizzl:session-expired", handleExpiredEvent);

    // 2. Periodic background silent token refresh & validation every 30 seconds
    const interval = setInterval(async () => {
      const { token, refreshToken } = getStoredTokens();
      if (authed && token && isJwtExpired(token)) {
        if (refreshToken) {
          const refreshed = await refreshTokenApi();
          if (!refreshed) {
            setSessionExpiredModal({
              isOpen: true,
              message:
                "Your authentication session has expired. Please log in again to resume your administrative session.",
            });
          }
        } else {
          setSessionExpiredModal({
            isOpen: true,
            message:
              "Your authentication session has expired. Please log in again to resume your administrative session.",
          });
        }
      }
    }, 30000);

    return () => {
      window.removeEventListener("sizzl:session-expired", handleExpiredEvent);
      clearInterval(interval);
    };
  }, [authed]);

  if (!authed) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <SessionExpiredModal
          isOpen={sessionExpiredModal.isOpen}
          message={sessionExpiredModal.message}
          onLoginAgain={handleSessionExpiredLogin}
        />
      </>
    );
  }

  return (
    <AppDataProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#17181a",
            color: "#fff",
            fontSize: "12px",
            borderRadius: "6px",
            border: "1px solid #2e3035",
            padding: "10px 14px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <BrowserRouter>
        <Shell onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<DetailCard />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/meal-options" element={<MealOptions />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/subscription" element={<SubscriptionOverview />} />
            <Route path="/subscription/plans" element={<SubscriptionPlans />} />
            <Route path="/subscription/create" element={<SubscriptionForm />} />
            <Route
              path="/subscription/edit/:id"
              element={<SubscriptionForm edit />}
            />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/earnings/:id" element={<DetailCard earnings />} />
            <Route path="/settings" element={<GeneralSettings />} />
            <Route
              path="/settings/edit-profile"
              element={<BasicSettingsForm type="profile" />}
            />
            <Route path="/settings/config" element={<AppConfiguration />} />
            <Route
              path="/settings/privacy"
              element={<TextSettings type="privacy" />}
            />
            <Route
              path="/settings/about"
              element={<TextSettings type="about" />}
            />
            <Route
              path="/settings/password"
              element={<BasicSettingsForm type="password" />}
            />
            <Route path="/settings/contact" element={<ContactSettings />} />
            <Route path="/settings/audit-logs" element={<AuditLogs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </BrowserRouter>
      <SessionExpiredModal
        isOpen={sessionExpiredModal.isOpen}
        message={sessionExpiredModal.message}
        onLoginAgain={handleSessionExpiredLogin}
      />
    </AppDataProvider>
  );
}
