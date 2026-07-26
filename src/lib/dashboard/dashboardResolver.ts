import type { RestaurantRole } from "@/lib/auth/roles";

export function resolveDashboard(
  role: RestaurantRole,
) {
  switch (role) {
    case "owner":
    case "manager":
      return "owner";

    case "kitchen":
      return "kitchen";

    case "cashier":
      return "cashier";

    case "waiter":
      return "waiter";

    default:
      return "owner";
  }
}