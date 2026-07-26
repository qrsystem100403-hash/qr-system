
import { NotificationService } from "@/modules/notifications/services/notification.service";


import type { BillingSettings } from "../types/billing.types";

import { OrderCreateRepository } from "../repositories/order-create.repository";



import type {
  ValidatedCartItem,
  RestaurantTable,
} from "../types/order.types";

export class OrderCreateService {
  constructor(
  private readonly repository =
    new OrderCreateRepository(),
  private readonly notificationService =
    new NotificationService(),
) {}
  async createOrder({
    restaurantId,
    restaurantTable,
    sessionId,
    validatedCart,
    billing,
    subtotal,
    serviceCharge,
    gstAmount,
    roundOff,
    grandTotal,
    customerNote,
  }: {
    restaurantId: string;
    restaurantTable: RestaurantTable;
    sessionId: string;
    validatedCart: ValidatedCartItem[];
    billing: BillingSettings;
    subtotal: number;
    serviceCharge: number;
    gstAmount: number;
    roundOff: number;
    grandTotal: number;
    customerNote: string | null;
  }) {
    let createdOrderId: string | null = null;

    try {
      const order = await this.repository.createOrder({
  restaurant_id: restaurantId,
  table_id: restaurantTable.id,
  session_id: sessionId,

  order_type: "dine_in",
  table_name: restaurantTable.name,

  subtotal,
  service_charge: serviceCharge,
  gst_amount: gstAmount,
  round_off: roundOff,
  total: grandTotal,

  gst_enabled: billing.gst_enabled,
  gst_mode: billing.gst_mode,
  gst_percent: billing.gst_percent,

  service_charge_enabled:
    billing.service_charge_enabled,
  service_charge_type:
    billing.service_charge_type,
  service_charge_value:
    billing.service_charge_value,

  payment_status: "pending",
  order_status: "pending",
  customer_note: customerNote,
});

createdOrderId = order.id;

      await this.notificationService.newOrder(
  restaurantId,
  restaurantTable.name,
  order.id,
  grandTotal,
);

      const orderItems = validatedCart.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menuItemId,
        variant_id: item.variantId,
        variant_name: item.variantName,
        item_name: item.itemName,
        item_price: item.unitPrice,
        qty: item.quantity,
      }));

      const insertedItems =
  await this.repository.createOrderItems(orderItems);

      const addonRows = validatedCart.flatMap(
        (cartItem, index) => {
          const insertedItem =
            insertedItems[index];

          if (!insertedItem) return [];

          return cartItem.addons.map((addon) => ({
            order_item_id: insertedItem.id,
            addon_id: addon.addonId,
            addon_name: addon.addonName,
            addon_price: addon.addonPrice,
          }));
        },
      );

      if (addonRows.length > 0) {
  await this.repository.createOrderItemAddons(
    addonRows,
  );
}

      createdOrderId = null;

      return {
        orderId: order.id,
        trackingToken: order.tracking_token,
      };
    } catch (error) {
      if (createdOrderId) {
        await this.rollbackOrder(createdOrderId);
      }

      throw error;
    }
  }

 private async rollbackOrder(orderId: string) {
  const items =
    await this.repository.getOrderItemIds(orderId);

  const itemIds = items.map(
    (item) => item.id,
  );

  await this.repository.deleteOrderItemAddons(
    itemIds,
  );

  await this.repository.deleteOrderItems(
    orderId,
  );

  await this.repository.deleteOrder(
    orderId,
  );
}
}