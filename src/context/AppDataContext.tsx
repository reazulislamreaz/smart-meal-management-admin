import {
  createContext,
  useContext,
  useEffect,
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
import { adminApi } from "@/lib/adminApi";

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

  // Fetch live settings on load
  useEffect(() => {
    let isMounted = true;
    adminApi
      .getSettings()
      .then((settings) => {
        if (!isMounted || !settings) return;
        if (settings.profile) setProfile(settings.profile);
        if (settings.preferences) setPreferences(settings.preferences);
        if (settings.privacy) setPrivacy(settings.privacy);
        if (settings.about) setAbout(settings.about);
        if (settings.contact) setContact(settings.contact);
        if (settings.appConfig) setAppConfig(settings.appConfig);
        if (settings.bannersCopy) setBannersCopy(settings.bannersCopy);
      })
      .catch((err) => {
        console.warn("Could not load remote admin settings, using local defaults:", err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
