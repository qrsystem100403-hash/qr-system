import { NotificationItem } from "./types"

export function createNotification(
  type: NotificationItem["type"],
  title: string,
  message: string
): NotificationItem {
  return {
    id: crypto.randomUUID(),
    type,
    title,
    message,
    createdAt: new Date().toISOString(),
  }
}