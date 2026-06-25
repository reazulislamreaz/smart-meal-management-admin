import {
  LayoutDashboard,
  UsersRound,
  Utensils,
  CreditCard,
  CircleDollarSign,
  Settings,
} from "lucide-react";
import type {
  Profile,
  Preferences,
  ContactDetails,
  SubscriptionPlan,
  AppConfig,
  BannersCopy,
} from "@/types/admin";

export const initialProfile: Profile = {
  name: "Bashar Islam",
  email: "bashar.islam12@gmail.com",
  phone: "1819488101",
  address: "USA",
  role: "Admin",
  memberSince: "January",
};

export const initialPreferences: Preferences = {
  language: "English (UK)",
  timezone: "GMT +06:00",
  notifications: [true, true, false, true],
};

export const initialContactDetails: ContactDetails = {
  title: "Get in touch with us",
  email: "hello@sizzl.com",
  phone: "+1 123 456 789",
  address: "Dhaka, Bangladesh",
};

export const defaultAppConfig: AppConfig = {
  trialDays: "7",
  defaultHousehold: "4",
  aiModel: "claude-sonnet-4-20250514",
  maxSuggestions: "6",
};

export const defaultBannersCopy: BannersCopy = {
  paywallHeadline: "Your free trial has ended",
  onboardingWelcome: "Let's build your first meal plan.",
  planCompleteMessage: "You cooked everything in this plan. Nice work.",
};


export const initialPageCopy = {
  privacy: {
    title: "Privacy Policy",
    text: "At Sizzl, we value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, store, and safeguard information when you use our meal management services. We only collect information necessary to provide a safe, personalized experience, process subscriptions, and improve our products. Your information is never sold to third parties. We use appropriate security measures and retain data only for as long as required to deliver our services or meet legal obligations.",
  },
  about: {
    title: "About Us",
    text: "Sizzl makes everyday meal planning simple, personal, and enjoyable. Our platform helps people discover meals, organize food choices, and manage subscriptions in one clear place. We believe healthy decisions should fit naturally into daily life, so we combine practical tools with thoughtfully selected recipes and reliable nutritional information. Our team is focused on building a friendly service that saves time and supports better eating habits.",
  },
};

export const avatars = [
  "https://i.pravatar.cc/96?img=12",
  "https://i.pravatar.cc/96?img=32",
  "https://i.pravatar.cc/96?img=47",
  "https://i.pravatar.cc/96?img=5",
  "https://i.pravatar.cc/96?img=15",
  "https://i.pravatar.cc/96?img=11",
  "https://i.pravatar.cc/96?img=59",
];

export const nav = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "User list", to: "/users", icon: UsersRound },
  { label: "Meals", to: "/meals", icon: Utensils },
  { label: "Subscription", to: "/subscription", icon: CreditCard },
  { label: "Earnings", to: "/earnings", icon: CircleDollarSign },
  { label: "Setting", to: "/settings", icon: Settings },
];

export const meals = [
  [
    "Chicken & Veg Traybake",
    "Dinner",
    "British",
    "25m",
    "$7.50",
    "Active",
    "18.4k",
  ],
  ["Salmon Rice Bowls", "Dinner", "Asian", "20m", "$8.00", "Active", "16.2k"],
  [
    "Halloumi & Couscous",
    "Lunch",
    "Mediterranean",
    "28m",
    "$6.00",
    "Active",
    "13.4k",
  ],
  [
    "Overnight Oats",
    "Breakfast",
    "American",
    "5m",
    "$2.00",
    "Active",
    "12.8k",
  ],
  ["Veggie Curry", "Dinner", "Indian", "25m", "$5.00", "Active", "11.9k"],
  [
    "Beef Chili Jackets",
    "Dinner",
    "British",
    "50m",
    "$7.00",
    "Active",
    "9.8k",
  ],
  ["Greek Salad Jars", "Lunch", "Mediterranean", "15m", "$5.80", "Draft", "0"],
  [
    "Pesto Chicken Pasta",
    "Dinner",
    "Italian",
    "20m",
    "$7.00",
    "Active",
    "8.7k",
  ],
  [
    "Shakshuka",
    "Breakfast",
    "Middle Eastern",
    "20m",
    "$4.00",
    "Active",
    "7.6k",
  ],
  [
    "Falafel Pittas",
    "Lunch",
    "Middle Eastern",
    "15m",
    "$5.00",
    "Inactive",
    "2.1k",
  ],
];

export const features = [
  "Unlimited meal plans",
  "Nutrition tracking",
  "Advanced analytics",
  "Priority support",
];

export const initialPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    description: "Everything you need to get started",
    price: "9.99",
    duration: "monthly",
    features,
  },
  {
    id: "premium",
    name: "Premium Plan",
    description: "Best for growing health programs",
    price: "29.99",
    duration: "monthly",
    features,
  },
];

export const users = [
  [
    "01",
    "Bashar Islam",
    "bashar@gmail.com",
    "+244 127 134",
    "Rangpur",
    "2025-03-12",
  ],
  [
    "02",
    "Amelia Rahman",
    "amelia.rahman@gmail.com",
    "777-555",
    "Dhaka",
    "2025-04-18",
  ],
  [
    "03",
    "Ayesha Begum",
    "ayesha.begum@gmail.com",
    "666-444",
    "Chittagong",
    "2025-05-20",
  ],
  ["04", "Sadik Alom", "sadik@gmail.com", "888-123", "Sylhet", "2025-06-18"],
  [
    "05",
    "Tarek Ahmed",
    "tarek.ahmed@gmail.com",
    "555-425",
    "Khulna",
    "2025-07-04",
  ],
  [
    "06",
    "Nazmul Islam",
    "nazmul@gmail.com",
    "444-321",
    "Rajshahi",
    "2025-08-20",
  ],
  [
    "07",
    "Imran Khan",
    "imran.khan@gmail.com",
    "333-499",
    "Barisal",
    "2025-09-19",
  ],
];
