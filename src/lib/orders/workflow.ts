import { ORDER_STATUSES } from "./statuses"

export const WORKFLOWS = {
  simple: {
    statuses: [
      ORDER_STATUSES.PENDING,
      ORDER_STATUSES.PREPARING,
      ORDER_STATUSES.SERVED,
      ORDER_STATUSES.CANCELLED,
    ],

    labels: {
      pending: "Pending",
      preparing: "Preparing",
      served: "Completed",
      cancelled: "Cancelled",
    },
  },

  advanced: {
    statuses: [
      ORDER_STATUSES.PENDING,
      ORDER_STATUSES.PREPARING,
      ORDER_STATUSES.READY,
      ORDER_STATUSES.SERVED,
      ORDER_STATUSES.CANCELLED,
    ],

    labels: {
      pending: "Received",
      preparing: "Preparing",
      ready: "Ready",
      served: "Served",
      cancelled: "Cancelled",
    },
  },
} as const

export type WorkflowMode =
  keyof typeof WORKFLOWS