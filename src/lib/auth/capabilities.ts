import type { RestaurantRole } from "./roles";
import { ROLES } from "./roles";

export type RestaurantFeatures = {
  kitchen_display_enabled: boolean;
  waiter_dashboard_enabled: boolean;
  cashier_dashboard_enabled: boolean;
};

export function getCapabilities(
  role: RestaurantRole,
  features: RestaurantFeatures,
) {
  const kitchenOwner =
    !features.kitchen_display_enabled
      ? role === ROLES.OWNER ||
        role === ROLES.MANAGER
      : role === ROLES.KITCHEN;

  const waiterOwner =
    !features.waiter_dashboard_enabled
      ? role === ROLES.OWNER ||
        role === ROLES.MANAGER
      : role === ROLES.WAITER;

  const cashierOwner =
    !features.cashier_dashboard_enabled
      ? role === ROLES.OWNER ||
        role === ROLES.MANAGER
      : role === ROLES.CASHIER;

  return {
  // Pages
  canViewDashboard: true,
  canViewOrders: true,
  canViewHistory:
    role === ROLES.OWNER ||
    role === ROLES.MANAGER,

  canViewMenu:
    role === ROLES.OWNER ||
    role === ROLES.MANAGER,

  canViewTables:
    role === ROLES.OWNER ||
    role === ROLES.MANAGER,

  canViewOperations:
    role === ROLES.OWNER ||
    role === ROLES.MANAGER,

  canViewSettings:
    role === ROLES.OWNER,

  canViewStaff:
    role === ROLES.OWNER,

  canViewAnalytics:
    role === ROLES.OWNER ||
    role === ROLES.MANAGER,

  // Actions
  canAcceptOrders: kitchenOwner,
  canPrepareOrders: kitchenOwner,
  canMarkReady: kitchenOwner,
  canServeOrders: waiterOwner,
  canCollectPayments: cashierOwner,

  canCancelPendingOrder:
    role === ROLES.OWNER ||
    role === ROLES.MANAGER,

  canCancelPreparedOrder:
    role === ROLES.OWNER,

  canManageMenu:
    role === ROLES.OWNER ||
    role === ROLES.MANAGER,

  canManageSettings:
    role === ROLES.OWNER,

  canManageStaff:
    role === ROLES.OWNER,
};
}