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
  avatar: "https://i.pravatar.cc/96?img=12",
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
  ["01", "Bashar Islam",   "Bashar@gmail.com",           "(+44) 201234", "Rangpur",   "2025-03-12\n09:30 AM"],
  ["02", "Amina Rahman",   "amina.rahman@example.com",   "777-555",      "Dhaka",     "2025-04-15\n11:00 AM"],
  ["03", "Karim Hossain",  "karim.h@example.com",        "666-444",      "Chittagong","2025-05-20\n02:15 PM"],
  ["04", "Sadia Akter",    "sadiaakter@mail.com",        "888-123",      "Sylhet",    "2025-06-10\n10:00 AM"],
  ["05", "Tariq Mahmud",   "tariq.mahmud@mail.com",      "555-678",      "Khulna",    "2025-07-05\n03:30 PM"],
  ["06", "Nusrat Jahan",   "nusrat.j@example.com",       "444-321",      "Rajshahi",  "2025-08-22\n01:45 PM"],
  ["07", "Imran Khan",     "imran.khan@mail.com",        "333-999",      "Barisal",   "2025-09-18\n04:00 PM"],
  ["08", "Rashed Karim",   "rashed.k@example.com",       "222-456",      "Mymensingh","2025-10-03\n09:00 AM"],
  ["09", "Nadia Islam",    "nadia.i@example.com",        "111-789",      "Dhaka",     "2025-10-14\n11:30 AM"],
  ["10", "Farhan Ahmed",   "farhan.a@example.com",       "999-012",      "Comilla",   "2025-11-01\n02:00 PM"],
  ["11", "Tasnim Haque",   "tasnim.h@example.com",       "888-345",      "Jessore",   "2025-11-18\n10:45 AM"],
  ["12", "Omar Faruq",     "omar.f@example.com",         "777-678",      "Rangpur",   "2025-12-05\n03:15 PM"],
  ["13", "Sumaiya Begum",  "sumaiya.b@example.com",      "666-901",      "Sylhet",    "2025-12-20\n01:00 PM"],
  ["14", "Mahfuz Alam",    "mahfuz.a@example.com",       "555-234",      "Dhaka",     "2026-01-08\n09:30 AM"],
  ["15", "Rubina Khatun",  "rubina.k@example.com",       "444-567",      "Chittagong","2026-01-22\n11:15 AM"],
  ["16", "Jubayer Hossain","jubayer.h@example.com",      "333-890",      "Khulna",    "2026-02-10\n02:45 PM"],
  ["17", "Lamia Sultana",  "lamia.s@example.com",        "222-123",      "Rajshahi",  "2026-02-25\n10:00 AM"],
  ["18", "Sabbir Rahman",  "sabbir.r@example.com",       "111-456",      "Barisal",   "2026-03-12\n04:30 PM"],
  ["19", "Farzana Islam",  "farzana.i@example.com",      "999-789",      "Mymensingh","2026-03-28\n09:15 AM"],
  ["20", "Raihan Uddin",   "raihan.u@example.com",       "888-012",      "Comilla",   "2026-04-15\n01:30 PM"],
  ["21", "Mim Akhter",     "mim.a@example.com",          "777-345",      "Dhaka",     "2026-04-28\n10:30 AM"],
  ["22", "Nasir Hossain",  "nasir.h@example.com",        "666-678",      "Jessore",   "2026-05-10\n03:00 PM"],
  ["23", "Roksana Begum",  "roksana.b@example.com",      "555-901",      "Sylhet",    "2026-05-22\n11:45 AM"],
  ["24", "Shakil Ahmed",   "shakil.a@example.com",       "444-234",      "Rangpur",   "2026-06-05\n02:15 PM"],
  ["25", "Tania Rahman",   "tania.r@example.com",        "333-567",      "Dhaka",     "2026-06-18\n09:00 AM"],
];
