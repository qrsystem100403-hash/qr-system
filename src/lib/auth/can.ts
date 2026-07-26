import { PERMISSIONS } from "./permissions";
import type { RestaurantRole } from "./roles";

export function can(
  role: RestaurantRole,
  permission: keyof typeof PERMISSIONS
) {
  return PERMISSIONS[permission].includes(role);
}