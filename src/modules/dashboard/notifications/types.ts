export type NotificationType =
  | "new_order"
  | "bill_request"
  | "waiter_request"

export type NotificationItem = {
  id: string

  type: NotificationType

  title: string

  message: string

  createdAt: string
}