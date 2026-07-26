import type { RestaurantRole } from "./roles";
import { ROLES } from "./roles";

export const PERMISSIONS: Record<
  string,
  readonly RestaurantRole[]
> = {
  dashboard: [
    ROLES.OWNER,
    ROLES.MANAGER,
    ROLES.CASHIER,
    ROLES.KITCHEN,
    ROLES.WAITER,
  ],

  orders: [
    ROLES.OWNER,
    ROLES.MANAGER,
    ROLES.KITCHEN,
  ],

  sessions: [
    ROLES.OWNER,
    ROLES.MANAGER,
    ROLES.CASHIER,
    ROLES.WAITER,
  ],

  tables: [
    ROLES.OWNER,
    ROLES.MANAGER,
    ROLES.CASHIER,
    ROLES.WAITER,
  ],

  requests: [
    ROLES.OWNER,
    ROLES.MANAGER,
    ROLES.CASHIER,
    ROLES.WAITER,
    ROLES.KITCHEN,
  ],

  payments: [
    ROLES.OWNER,
    ROLES.MANAGER,
    ROLES.CASHIER,
  ],

  analytics: [
    ROLES.OWNER,
    ROLES.MANAGER,
  ],

  menu: [
    ROLES.OWNER,
    ROLES.MANAGER,
  ],

  settings: [
    ROLES.OWNER,
  ],
};