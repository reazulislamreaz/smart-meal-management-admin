import { api } from "./apiClient";
import { getStoredTokens } from "./auth";
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
  servings?: number;
  status: string;
  uses: string;
  description?: string;
  dietaryTags?: string[];
  instructions?: string[];
  ingredients?: any[];
  imageUrl?: string;
}

export interface AdminCouponItem {
  id: string;
  code: string;
  discountPercent: number;
  validUntil: string | null;
  maxRedemptions: number;
  redemptionCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "UNREAD" | "READ" | "RESOLVED";
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLogItem {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: any;
  ipAddress: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

export interface PantryItemModel {
  id: string;
  userId: string;
  ingredientName: string;
  category: string;
  quantity: number;
  unit: string;
  isLowStock: boolean;
  expiryDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePantryItemInput {
  ingredientName: string;
  category?: string;
  quantity?: number;
  unit?: string;
  isLowStock?: boolean;
  expiryDate?: string | null;
}

export interface UpdatePantryItemInput {
  ingredientName?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  isLowStock?: boolean;
  expiryDate?: string | null;
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
  }): Promise<{
    data: AdminUserItem[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.role) query.set("role", params.role);
    if (params?.isBlocked !== undefined)
      query.set("isBlocked", String(params.isBlocked));
    if (params?.dateFrom) query.set("dateFrom", params.dateFrom);
    if (params?.dateTo) query.set("dateTo", params.dateTo);

    const qs = query.toString();
    return api.get(`/admin/users${qs ? `?${qs}` : ""}`);
  },

  getUserDetails: async (id: string): Promise<AdminUserDetails> => {
    return api.get<AdminUserDetails>(`/admin/users/${id}`);
  },

  getUserRatio: async (): Promise<{
    chartData: {
      monthly: number[];
      annually: number[];
      monthlyCounts: number[];
      annualCounts: number[];
    };
    peak: { monthIndex: number; monthName: string; count: number };
    stats: {
      totalUsers: number;
      activeUsers: number;
      blockedUsers: number;
      subscribedUsers: number;
      activeRatio: number;
      blockedRatio: number;
      subscribedRatio: number;
    };
  }> => {
    return api.get("/admin/users/ratio");
  },

  getLatestTaskUser: async (): Promise<{ task: any; user: any }> => {
    return api.get<{ task: any; user: any }>("/admin/tasks/latest-user");
  },

  toggleUserBlock: async (
    id: string,
    isBlocked?: boolean,
  ): Promise<{ isBlocked: boolean; message: string }> => {
    return api.patch(`/admin/users/${id}/block`, { isBlocked });
  },

  // 3. Meals Catalog
  getMeals: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    cuisine?: string;
  }): Promise<{
    data: AdminMealItem[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.category && params.category !== "All")
      query.set("category", params.category);
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
      servings: draft.servings || 4,
      estimatedCost: priceNum,
      description: draft.description || undefined,
      dietaryTags: draft.dietaryTags || [],
      instructions: draft.instructions || [],
      ingredients: draft.ingredients || [],
      imageUrl: draft.imageUrl || undefined,
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
      servings: draft.servings || 4,
      estimatedCost: priceNum,
      description: draft.description || undefined,
      dietaryTags: draft.dietaryTags,
      instructions: draft.instructions,
      ingredients: draft.ingredients,
      imageUrl: draft.imageUrl,
    });
  },

  deleteMeal: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/admin/meals/${id}`);
  },

  uploadImage: async (file: File): Promise<{ url: string; key: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
    const { token } = getStoredTokens();
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || "Failed to upload image to S3");
    }
    const res = await response.json();
    return res.data;
  },

  // 4. Meal Options (Taxonomy)
  getMealOptions: async (): Promise<{
    diets: string[];
    cuisines: string[];
  }> => {
    return api.get<{ diets: string[]; cuisines: string[] }>(
      "/admin/meal-options",
    );
  },

  addMealOption: async (type: "diet" | "cuisine", value: string) => {
    return api.post<{ diets: string[]; cuisines: string[] }>(
      "/admin/meal-options",
      {
        type,
        value,
      },
    );
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

  createSubscriptionPlan: async (
    plan: Omit<SubscriptionPlan, "id">,
  ): Promise<SubscriptionPlan> => {
    return api.post<SubscriptionPlan>("/admin/subscription-plans", {
      name: plan.name,
      description: plan.description,
      price: parseFloat(plan.price),
      interval: plan.duration === "annual" ? "yearly" : "monthly",
      features: plan.features,
    });
  },

  updateSubscriptionPlan: async (
    id: string,
    plan: Partial<SubscriptionPlan>,
  ): Promise<SubscriptionPlan> => {
    return api.put<SubscriptionPlan>(`/admin/subscription-plans/${id}`, {
      name: plan.name,
      description: plan.description,
      price: plan.price ? parseFloat(plan.price) : undefined,
      interval: plan.duration
        ? plan.duration === "annual"
          ? "yearly"
          : "monthly"
        : undefined,
      features: plan.features,
    });
  },

  deleteSubscriptionPlan: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
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
  }): Promise<{
    data: EarningsSubscriberItem[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.subscriptionType)
      query.set("subscriptionType", params.subscriptionType);
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

  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> => {
    return api.put("/admin/settings/password", {
      currentPassword,
      newPassword,
    });
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

  updateContactSettings: async (
    contact: Partial<ContactDetails>,
  ): Promise<FullAdminSettings> => {
    return api.put<FullAdminSettings>("/admin/settings/contact", contact);
  },

  updateContentPage: async (
    slug: "privacy-policy" | "about-us",
    title: string,
    content: string,
  ) => {
    return api.put(`/admin/content/${slug}`, { title, content });
  },

  // 8. Coupons Management
  getCoupons: async (params?: {
    search?: string;
    isActive?: boolean;
  }): Promise<AdminCouponItem[]> => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.isActive !== undefined)
      query.set("isActive", String(params.isActive));
    const qs = query.toString();
    return api.get(`/admin/coupons${qs ? `?${qs}` : ""}`);
  },

  getCoupon: async (id: string): Promise<AdminCouponItem> => {
    return api.get(`/admin/coupons/${id}`);
  },

  createCoupon: async (dto: {
    code: string;
    discountPercent: number;
    validUntil?: string | null;
    maxRedemptions?: number;
    isActive?: boolean;
  }): Promise<AdminCouponItem> => {
    return api.post("/admin/coupons", dto);
  },

  updateCoupon: async (
    id: string,
    dto: {
      code?: string;
      discountPercent?: number;
      validUntil?: string | null;
      maxRedemptions?: number;
      isActive?: boolean;
    },
  ): Promise<AdminCouponItem> => {
    return api.put(`/admin/coupons/${id}`, dto);
  },

  toggleCouponStatus: async (id: string): Promise<AdminCouponItem> => {
    return api.patch(`/admin/coupons/${id}/status`);
  },

  deleteCoupon: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/admin/coupons/${id}`);
  },

  // 9. Contact / Support Inquiries
  listContactMessages: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: AdminContactMessage[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return api.get(`/admin/contacts${qs ? `?${qs}` : ""}`);
  },

  getContactMessage: async (id: string): Promise<AdminContactMessage> => {
    return api.get(`/admin/contacts/${id}`);
  },

  updateContactStatus: async (
    id: string,
    status: "UNREAD" | "READ" | "RESOLVED",
  ): Promise<AdminContactMessage> => {
    return api.patch(`/admin/contacts/${id}/status`, { status });
  },

  deleteContactMessage: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/admin/contacts/${id}`);
  },

  // 10. Audit Logs & Retention Management
  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    action?: string;
  }): Promise<{
    data: AdminAuditLogItem[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.action) query.set("action", params.action);
    const qs = query.toString();
    return api.get(`/admin/audit-logs${qs ? `?${qs}` : ""}`);
  },

  cleanupAuditLogs: async (
    days = 30,
  ): Promise<{ success: boolean; deletedCount: number; message: string }> => {
    return api.delete(`/admin/audit-logs/cleanup?days=${days}`);
  },

  clearAllAuditLogs: async (): Promise<{
    success: boolean;
    deletedCount: number;
    message: string;
  }> => {
    return api.delete("/admin/audit-logs/clear-all");
  },

  // 11. Reports & Exports
  exportUsersExcel: async (): Promise<Blob> => {
    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
    const token =
      localStorage.getItem("sizzl-token") ||
      sessionStorage.getItem("sizzl-token");
    const response = await fetch(`${API_BASE_URL}/exports/users/excel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to export Excel report");
    return response.blob();
  },

  exportUsersPdf: async (): Promise<Blob> => {
    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
    const token =
      localStorage.getItem("sizzl-token") ||
      sessionStorage.getItem("sizzl-token");
    const response = await fetch(`${API_BASE_URL}/exports/users/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to export PDF report");
    return response.blob();
  },

  // 12. Pantry Inventory
  getPantryItems: async (params?: {
    search?: string;
    category?: string;
    isLowStock?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    data: PantryItemModel[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    if (params?.isLowStock !== undefined)
      query.set("isLowStock", String(params.isLowStock));
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const res = await api.get(`/pantry${qs ? `?${qs}` : ""}`);
    return (res as any)?.data || res;
  },

  getPantryItem: async (id: string): Promise<PantryItemModel> => {
    const res = await api.get(`/pantry/${id}`);
    return (res as any)?.data || res;
  },

  addPantryItem: async (
    dto: CreatePantryItemInput,
  ): Promise<PantryItemModel> => {
    const res = await api.post("/pantry", dto);
    return (res as any)?.data || res;
  },

  updatePantryItem: async (
    id: string,
    dto: UpdatePantryItemInput,
  ): Promise<PantryItemModel> => {
    const res = await api.patch(`/pantry/${id}`, dto);
    return (res as any)?.data || res;
  },

  deletePantryItem: async (id: string): Promise<{ success: boolean }> => {
    return api.delete(`/pantry/${id}`);
  },
};

export default adminApi;
