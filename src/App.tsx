import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import AppDataProvider from "@/context/AppDataContext";
import Shell from "@/components/layout/Shell";
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
import NotificationSettings from "@/pages/settings/NotificationSettings";
import TextSettings from "@/pages/settings/TextSettings";
import ContactSettings from "@/pages/settings/ContactSettings";

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Shell>
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
            <Route
              path="/settings/password"
              element={<BasicSettingsForm type="password" />}
            />
            <Route
              path="/settings/notification"
              element={<NotificationSettings />}
            />
            <Route
              path="/settings/language"
              element={<BasicSettingsForm type="language" />}
            />
            <Route
              path="/settings/privacy"
              element={<TextSettings type="privacy" />}
            />
            <Route
              path="/settings/about"
              element={<TextSettings type="about" />}
            />
            <Route path="/settings/contact" element={<ContactSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </AppDataProvider>
  );
}
