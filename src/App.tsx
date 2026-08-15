import { useState, useEffect } from "react";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import AppDataProvider from "@/context/AppDataContext";
import Shell from "@/components/layout/Shell";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/Users";
import DetailCard from "@/pages/DetailCard";
import Meals from "@/pages/Meals";
import MealOptions from "@/pages/MealOptions";
import SubscriptionOverview from "@/pages/SubscriptionOverview";
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import SubscriptionForm from "@/pages/SubscriptionForm";
import Earnings from "@/pages/Earnings";
import GeneralSettings from "@/pages/settings/GeneralSettings";
import BasicSettingsForm from "@/pages/settings/BasicSettingsForm";
import AppConfiguration from "@/pages/settings/AppConfiguration";
import TextSettings from "@/pages/settings/TextSettings";
import ContactSettings from "@/pages/settings/ContactSettings";
import SessionExpiredModal from "@/components/common/SessionExpiredModal";

import { clearStoredTokens, getStoredTokens, isJwtExpired } from "@/lib/auth";

function isAuthenticated() {
  const { token } = getStoredTokens();
  return !!token && !isJwtExpired(token) && (
    localStorage.getItem("sizzl-auth") === "1" ||
    sessionStorage.getItem("sizzl-auth") === "1"
  );
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

  const handleLogout = () => {
    clearStoredTokens();
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

    // 2. Periodic background verification every 10 seconds
    const interval = setInterval(() => {
      const { token } = getStoredTokens();
      if (token && authed && isJwtExpired(token)) {
        setSessionExpiredModal({
          isOpen: true,
          message:
            "Your authentication token has expired. Please log in again to resume your administrative session.",
        });
      }
    }, 10000);

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
      <BrowserRouter>
        <Shell onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<DetailCard />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/meal-options" element={<MealOptions />} />
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
