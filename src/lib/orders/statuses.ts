export const ORDER_STATUSES = {
  PENDING: "pending",
  PREPARING: "preparing",
  READY: "ready",
  SERVED: "served",
  CANCELLED: "cancelled",
} as const

export type OrderStatus =
  (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES]