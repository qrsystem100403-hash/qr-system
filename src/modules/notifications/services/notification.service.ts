import { createNotification } from "@/lib/createNotification";
import { NOTIFICATION_TYPES } from "@/lib/notification-types";

export class NotificationService {
  async newOrder(
    restaurantId: string,
    tableName: string,
    orderId: string,
    total: number,
  ) {
    await createNotification({
      restaurantId,
      type: NOTIFICATION_TYPES.NEW_ORDER,
      title: "New Order",
      message: `${tableName} placed an order worth ₹${total.toFixed(2)}`,
      entityType: "order",
      entityId: orderId,
    });
  }
}