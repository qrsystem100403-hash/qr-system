import type { CustomerTheme } from "@/modules/customer-theme/types/theme";

export interface PublicRestaurant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  logo: string | null;
  phone: string | null;
  primary_color: string | null;
  table_workflow_mode: "simple" | "advanced";
}

export interface PublicRestaurantFeatures {
  kitchen_display_enabled: boolean;
  waiter_dashboard_enabled: boolean;
  cashier_dashboard_enabled: boolean;
  online_orders_enabled: boolean;
  attendance_enabled: boolean;
  inventory_enabled: boolean;
}

export interface PublicRuntime {
  restaurant: PublicRestaurant;
  features: PublicRestaurantFeatures | null;
  theme: CustomerTheme;
}