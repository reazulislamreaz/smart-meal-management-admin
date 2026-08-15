import { api } from "./apiClient";
import type {
  Profile,
  Preferences,
  ContactDetails,
  AppConfig,
  BannersCopy,
  SubscriptionPlan,
  MealDraft,
} from "@/types/admin";

export interface DashboardStatsResponse {
  miniStats: {
    totalUsers: { value: string; label: string; growth: string };
    activeTotal: { value: string; label: string; growth: string };
    meed: { value: string; label: string; growth: string };
    mealPayment: { value: string; label: string; growth: string };
  };
  incomeRing: {
    percentage: number;
    yearlyEarnings: string;
    description: string;
    today: string;
    weekly: string;
    monthly: string;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    plan: string;
    avatar: string;
  }>;
  topMeals: Array<{
    id: string;
    title: string;
    price: string;
    uses: string;
    cuisine: string;
    mealType: string;
  }>;
}

export interface EarningsOverviewResponse {
  totalGrossRevenue: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  totalSubscribers: number;
  annualSubscribers: number;
  monthlySubscribers: number;
  chartData: {
    annually: number[];
    monthly: number[];
  };
}

export interface EarningsSubscriberItem {
  id: string;
  userId: string;
  sl: string;
  userName: string;
  email: string;
  avatar: string;
  subscriptionType: string;
  price: string;
  expireDate: string;
  expireTime: string;
  joiningDate: string;
  transactionId: string;
  withdrawAmount: string;
  currentPeriodStart: string;
  cardType: string;
  status: string;
}

export interface AdminUserItem {
  id: string;
  no: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  joiningDate: string;
  joiningTime: string;
  avatar: string;
  currentPlan: string;
  taskCompletionRate: string;
  isBlocked: boolean;
  activeMeals: number;
  totalSpend: string;
  role: string;
}

export interface AdminUserDetails extends AdminUserItem {
  weeklyBudget?: number;
  country?: string;
  city?: string;
  subscriptions?: any[];
  pantryItems?: any[];
  tasks?: any[];
  mealPlans?: any[];
}

export interface AdminMealItem {
  id: string;
  name: string;
  type: string;
  cuisine: string;
  duration: string;
  price: string;
  status: string;
  uses: string;
  description?: string;
  dietaryTags?: string[];
  instructions?: string[];
  ingredients?: any[];
  imageUrl?: string;
}

export interface FullAdminSettings {
  profile: Profile;
  preferences: Preferences;
  contact: ContactDetails;
  appConfig: AppConfig;
  bannersCopy: BannersCopy;
  privacy: string;
  about: string;
}

export const adminApi = {
  // 1. Dashboard Overview
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    return api.get<DashboardStatsResponse>("/admin/dashboard-stats");
  },

  getAnalytics: async () => {
    return api.get("/admin/analytics");
  },

  getActivities: async () => {
    return api.get("/admin/activities");
  },

  // 2. Users Management
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isBlocked?: boolean;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{ data: AdminUserItem[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.role) query.set("role", params.role);
    if (params?.isBlocked !== undefined) query.set("isBlocked", String(params.isBlocked));
    if (params?.dateFrom) query.set("dateFrom", params.dateFrom);
    if (params?.dateTo) query.set("dateTo", params.dateTo);

    const qs = query.toString();
    return api.get(`/admin/users${qs ? `?${qs}` : ""}`);
  },

  getUserDetails: async (id: string): Promise<AdminUserDetails> => {
    return api.get<AdminUserDetails>(`/admin/users/${id}`);
  },

  getUserRatio: async (): Promise<{
    chartData: { monthly: number[]; annually: number[]; monthlyCounts: number[]; annualCounts: number[] };
    peak: { monthIndex: number; monthName: string; count: number };
    stats: { totalUsers: number; activeUsers: number; blockedUsers: number; subscribedUsers: number; activeRatio: number; blockedRatio: number; subscribedRatio: number };
  }> => {
    return api.get("/admin/users/ratio");
  },

  getLatestTaskUser: async (): Promise<{ task: any; user: any }> => {
    return api.get<{ task: any; user: any }>("/admin/tasks/latest-user");
  },

  toggleUserBlock: async (id: string, isBlocked?: boolean): Promise<{ isBlocked: boolean; message: string }> => {
    return api.patch(`/admin/users/${id}/block`, { isBlocked });
  },

  // 3. Meals Catalog
  getMeals: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    cuisine?: string;
  }): Promise<{ data: AdminMealItem[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.category && params.category !== "All") query.set("category", params.category);
    if (params?.cuisine) query.set("cuisine", params.cuisine);

    const qs = query.toString();
    return api.get(`/admin/meals${qs ? `?${qs}` : ""}`);
  },

  createMeal: async (draft: MealDraft): Promise<AdminMealItem> => {
    const durationNum = parseInt(draft.duration.replace(/\D/g, ""), 10) || 15;
    const priceNum = parseFloat(draft.price.replace(/^\$/, "").trim()) || 5.0;

    return api.post("/admin/meals", {
      title: draft.name,
      mealType: draft.type,
      cuisine: draft.cuisine,
      prepTimeMinutes: durationNum,
      estimatedCost: priceNum,
      status: "Active",
    });
  },

  updateMeal: async (id: string, draft: MealDraft): Promise<AdminMealItem> => {
    const durationNum = parseInt(draft.duration.replace(/\D/g, ""), 10) || 15;
    const priceNum = parseFloat(draft.price.replace(/^\$/, "").trim()) || 5.0;

    return api.put(`/admin/meals/${id}`, {
      title: draft.name,
      mealType: draft.type,
      cuisine: draft.cuisine,
      prepTimeMinutes: durationNum,
      estimatedCost: priceNum,
    });
  },

  deleteMeal: async (id: string): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/admin/meals/${id}`);
  },

  // 4. Meal Options (Taxonomy)
  getMealOptions: async (): Promise<{ diets: string[]; cuisines: string[] }> => {
    return api.get<{ diets: string[]; cuisines: string[] }>("/admin/meal-options");
  },

  addMealOption: async (type: "diet" | "cuisine", value: string) => {
    return api.post<{ diets: string[]; cuisines: string[] }>("/admin/meal-options", {
      type,
      value,
    });
  },

  removeMealOption: async (type: "diet" | "cuisine", value: string) => {
    return api.delete<{ diets: string[]; cuisines: string[] }>(
      `/admin/meal-options?type=${type}&value=${encodeURIComponent(value)}`,
    );
  },

  // 5. Subscription Plans
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    return api.get<SubscriptionPlan[]>("/admin/subscription-plans");
  },

  getSubscriptionPlan: async (id: string): Promise<SubscriptionPlan> => {
    return api.get<SubscriptionPlan>(`/admin/subscription-plans/${id}`);
  },

  createSubscriptionPlan: async (plan: Omit<SubscriptionPlan, "id">): Promise<SubscriptionPlan> => {
    return api.post<SubscriptionPlan>("/admin/subscription-plans", {
      name: plan.name,
      description: plan.description,
      price: parseFloat(plan.price),
      interval: plan.duration === "annual" ? "yearly" : "monthly",
      features: plan.features,
    });
  },

  updateSubscriptionPlan: async (id: string, plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    return api.put<SubscriptionPlan>(`/admin/subscription-plans/${id}`, {
      name: plan.name,
      description: plan.description,
      price: plan.price ? parseFloat(plan.price) : undefined,
      interval: plan.duration ? (plan.duration === "annual" ? "yearly" : "monthly") : undefined,
      features: plan.features,
    });
  },

  deleteSubscriptionPlan: async (id: string): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/admin/subscription-plans/${id}`);
  },

  // 6. Subscriptions & Earnings
  getSubscriptionOverview: async () => {
    return api.get<{
      totalSubscriptions: number;
      activeSubscriptions: number;
      annualSubscribers: number;
      monthlySubscribers: number;
      monthlyRevenue: string;
      retentionRate: string;
    }>("/admin/subscriptions");
  },

  getEarningsOverview: async (): Promise<EarningsOverviewResponse> => {
    return api.get<EarningsOverviewResponse>("/admin/earnings");
  },

  getEarningsSubscribers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    subscriptionType?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: EarningsSubscriberItem[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.subscriptionType) query.set("subscriptionType", params.subscriptionType);
    if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

    const qs = query.toString();
    return api.get(`/admin/earnings/subscribers${qs ? `?${qs}` : ""}`);
  },

  // 7. System Settings & CMS
  getSettings: async (): Promise<FullAdminSettings> => {
    return api.get<FullAdminSettings>("/admin/settings");
  },

  updateProfile: async (profile: Partial<Profile>): Promise<Profile> => {
    return api.put<Profile>("/admin/settings/profile", profile);
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    return api.put("/admin/settings/password", { currentPassword, newPassword });
  },

  updateAppConfig: async (config: {
    trialDays?: string;
    defaultHousehold?: string;
    aiModel?: string;
    maxSuggestions?: string;
    bannersCopy?: Partial<BannersCopy>;
  }): Promise<FullAdminSettings> => {
    return api.put<FullAdminSettings>("/admin/settings/app-config", config);
  },

  updateContactSettings: async (contact: Partial<ContactDetails>): Promise<FullAdminSettings> => {
    return api.put<FullAdminSettings>("/admin/settings/contact", contact);
  },

  updateContentPage: async (slug: "privacy-policy" | "about-us", title: string, content: string) => {
    return api.put(`/admin/content/${slug}`, { title, content });
  },
};

export default adminApi;
