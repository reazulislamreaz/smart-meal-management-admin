import type { Dispatch, SetStateAction } from "react";

export type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  memberSince: string;
  avatar: string;
};

export type Preferences = {
  language: string;
  timezone: string;
  notifications: boolean[];
};

export type ContactDetails = {
  title: string;
  email: string;
  phone: string;
  address: string;
};

export type AppConfig = {
  trialDays: string;
  defaultHousehold: string;
  aiModel: string;
  maxSuggestions: string;
};

export type BannersCopy = {
  paywallHeadline: string;
  onboardingWelcome: string;
  planCompleteMessage: string;
};

export type AppData = {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
  privacy: string;
  setPrivacy: Dispatch<SetStateAction<string>>;
  about: string;
  setAbout: Dispatch<SetStateAction<string>>;
  contact: ContactDetails;
  setContact: Dispatch<SetStateAction<ContactDetails>>;
  appConfig: AppConfig;
  setAppConfig: Dispatch<SetStateAction<AppConfig>>;
  bannersCopy: BannersCopy;
  setBannersCopy: Dispatch<SetStateAction<BannersCopy>>;
};

export type MealDraft = {
  name: string;
  type: string;
  cuisine: string;
  duration: string;
  price: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: "monthly" | "annual";
  features: string[];
};
