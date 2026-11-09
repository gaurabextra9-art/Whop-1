/**
 * Whop Integration Configuration
 * Centralized, secure configuration for Whop Payments, Plans, APIs, and Pixel Tracking.
 */

export interface WhopPlanConfig {
  key: "INSPECTION" | "DEPOSIT" | "MAINTENANCE";
  name: string;
  productName: string;
  productId: string;
  planId: string;
  price: number;
  currency: string;
  billingType: "one_time";
  description: string;
  depositNotice?: boolean;
}

export const whopConfig = {
  // Company & Authentication credentials (loaded from env or secure defaults)
  companyId: import.meta.env.VITE_WHOP_COMPANY_ID || "biz_summit_roofing",
  appId: import.meta.env.VITE_WHOP_APP_ID || "app_summit_roofing",
  environment: (import.meta.env.VITE_WHOP_ENVIRONMENT as "sandbox" | "production") || "sandbox",

  apiBaseUrl: import.meta.env.VITE_WHOP_API_BASE_URL || "https://api.whop.com/api/v1",
  sandboxApiBaseUrl: "https://sandbox-api.whop.com/api/v1",

  // The 3 Mandatory Primary Payment Offerings
  plans: {
    INSPECTION: {
      key: "INSPECTION",
      name: "Professional Roof Inspection",
      productName: "Roof Inspection Service",
      productId: import.meta.env.VITE_WHOP_PRODUCT_INSPECTION || "prod_insp_summit_01",
      planId: import.meta.env.VITE_WHOP_PLAN_INSPECTION || "plan_insp_149_demo",
      price: 149,
      currency: "USD",
      billingType: "one_time",
      description: "Professional residential roof inspection, condition assessment, and detailed photographic report.",
    },
    DEPOSIT: {
      key: "DEPOSIT",
      name: "Roofing Project Deposit",
      productName: "Roofing Project Deposit",
      productId: import.meta.env.VITE_WHOP_PRODUCT_DEPOSIT || "prod_dep_summit_02",
      planId: import.meta.env.VITE_WHOP_PLAN_DEPOSIT || "plan_dep_500_demo",
      price: 500,
      currency: "USD",
      billingType: "one_time",
      description: "Initial deposit toward an approved roofing project. The remaining balance ($4,500 on standard $5,000 jobs) is invoiced separately upon project completion.",
      depositNotice: true,
    },
    MAINTENANCE: {
      key: "MAINTENANCE",
      name: "Standard Roof Maintenance Visit",
      productName: "Roofing Maintenance Service",
      productId: import.meta.env.VITE_WHOP_PRODUCT_MAINTENANCE || "prod_maint_summit_03",
      planId: import.meta.env.VITE_WHOP_PLAN_MAINTENANCE || "plan_maint_299_demo",
      price: 299,
      currency: "USD",
      billingType: "one_time",
      description: "Standard residential roof maintenance visit covering visual inspection, pipe boot resealing, and valley debris clearing.",
    },
  } as Record<"INSPECTION" | "DEPOSIT" | "MAINTENANCE", WhopPlanConfig>,

  // Payment Elements Appearance & Theming
  theme: {
    theme: "light" as const,
    accentColor: "#EA580C", // Copper / Accent color matching Summit Roofing branding
    borderRadius: "8px",
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
  },

  // 3 Custom Tracking Events
  events: {
    ESTIMATE_REQUESTED: "estimate_requested",
    SERVICE_VIEWED: "service_viewed",
    DEPOSIT_STARTED: "deposit_started",
  },
};

