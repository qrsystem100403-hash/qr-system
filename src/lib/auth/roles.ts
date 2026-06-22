// src/lib/auth/roles.ts

export const ROLES = {
  OWNER: "owner",
  MANAGER: "manager",
  CASHIER: "cashier",
  KITCHEN: "kitchen",
  WAITER: "waiter",
} as const

export type RestaurantRole =
  (typeof ROLES)[keyof typeof ROLES]

export const VALID_ROLES = Object.values(
  ROLES
)