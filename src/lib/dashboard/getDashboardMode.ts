export type DashboardMode =
  | "owner"
  | "kitchen"
  | "cashier";

export function getDashboardMode(
  role: string,
  features: {
    kitchen_display_enabled: boolean;
    cashier_dashboard_enabled: boolean;
  },
): DashboardMode {
  if (role === "kitchen") {
    return "kitchen";
  }

  if (role === "cashier") {
    return "cashier";
  }

  return "owner";
}