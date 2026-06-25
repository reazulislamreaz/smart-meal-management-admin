import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { AppData } from "@/types/admin";
import { useStoredState } from "@/hooks/useStoredState";
import {
  initialProfile,
  initialPreferences,
  initialPageCopy,
  initialContactDetails,
  defaultAppConfig,
  defaultBannersCopy,
} from "@/data/adminData";

const AppDataContext = createContext<AppData | null>(null);

export function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) throw new Error("App data is unavailable");
  return value;
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useStoredState("sizzl-profile", initialProfile);
  const [preferences, setPreferences] = useStoredState(
    "sizzl-preferences",
    initialPreferences,
  );
  const [privacy, setPrivacy] = useStoredState(
    "sizzl-privacy",
    initialPageCopy.privacy.text,
  );
  const [about, setAbout] = useStoredState(
    "sizzl-about",
    initialPageCopy.about.text,
  );
  const [contact, setContact] = useStoredState(
    "sizzl-contact",
    initialContactDetails,
  );
  const [appConfig, setAppConfig] = useStoredState(
    "sizzl-appconfig",
    defaultAppConfig,
  );
  const [bannersCopy, setBannersCopy] = useStoredState(
    "sizzl-bannerscopy",
    defaultBannersCopy,
  );

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      preferences,
      setPreferences,
      privacy,
      setPrivacy,
      about,
      setAbout,
      contact,
      setContact,
      appConfig,
      setAppConfig,
      bannersCopy,
      setBannersCopy,
    }),
    [
      about,
      contact,
      preferences,
      privacy,
      profile,
      setAbout,
      setContact,
      setPreferences,
      setPrivacy,
      setProfile,
      appConfig,
      setAppConfig,
      bannersCopy,
      setBannersCopy,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
export default AppDataProvider;
