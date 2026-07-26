import { calculateBill } from "@/lib/billing/calculateBill";
import { createNotification } from "@/lib/createNotification";
import { NOTIFICATION_TYPES } from "@/lib/notification-types";
import { AppError } from "@/lib/errors";
import { ERROR_CODES } from "@/lib/errors/error.codes";
import { SessionService } from "@/modules/sessions";
import { RequestRepository } from "../repositories/request.repository";

export class RequestService {
  constructor(
    private readonly repository =
      new RequestRepository(),
    private readonly sessionService =
      new SessionService(),
  ) {}

  async resolveRequest(
    restaurantId: string,
    requestId: string,
  ) {
    await this.repository.resolveRequest(
      restaurantId,
      requestId,
    );
  }

  async requestBill(params: {
    restaurantId: string;
    orderId: string;
    trackingToken: string;
  }) {
    const order =
      await this.repository.findOrderForBillRequest(
  params.restaurantId,
  params.orderId,
  params.trackingToken,
);

    if (!order.session_id) {
      throw new AppError(
        "Dining session not found.",
        ERROR_CODES.VALIDATION_ERROR,
        400,
      );
    }

    if (order.order_status === "cancelled") {
      throw new AppError(
        "Cancelled order cannot request bill.",
        ERROR_CODES.VALIDATION_ERROR,
        400,
      );
    }

    const sessionOrders =
      await this.repository.getSessionOrders(
        order.session_id,
      );

    const hasActiveOrders =
      sessionOrders.some((o) =>
        ["pending", "preparing", "ready"].includes(
          o.order_status,
        ),
      );

    if (hasActiveOrders) {
      throw new AppError(
        "Some items are still being prepared or served.",
        ERROR_CODES.VALIDATION_ERROR,
        400,
      );
    }

    const existing =
      await this.repository.findPendingBillRequest(
        order.session_id,
      );

    if (existing) {
     return {
  alreadyRequested: true,
  orderId: order.id,
  sessionId: order.session_id,
};
    }

    await this.repository.createBillRequest({
      restaurantId: order.restaurant_id,
      tableId: order.table_id,
      tableName: order.table_name,
      sessionId: order.session_id,
      orderId: order.id,
    });

    const bill =
      await calculateBill(
        order.restaurant_id,
        order.session_id,
      );

    await this.sessionService.markBillRequested(
      order.session_id,
      order.table_id,
      {
        subtotal: bill.subtotal,
        gst_percent: bill.gstPercent,
        gst_amount: bill.gstAmount,
        service_charge_type:
          bill.serviceChargeType,
        service_charge_value:
          bill.serviceChargeValue,
        service_charge_amount:
          bill.serviceChargeAmount,
        round_off: bill.roundOff,
        grand_total: bill.grandTotal,
        billing_snapshot:
          bill.snapshot,
      },
    );

    await createNotification({
      restaurantId: order.restaurant_id,
      type:
        NOTIFICATION_TYPES.BILL_REQUEST,
      title: "Bill Request",
      message: `${order.table_name} requested bill`,
      entityType: "request",
      entityId: order.session_id,
    });

    return {
  alreadyRequested: false,
  orderId: order.id,
  sessionId: order.session_id,
};
  }

 async requestCustomerAssistance(params: {
  restaurantId: string;
  orderId: string;
  trackingToken: string;
  requestType:
    | "water"
    | "spoon"
    | "fork"
    | "tissue"
    | "waiter"
    | "other";
  customMessage?: string;
}) {
  const order =
    await this.repository.findOrderForCustomerRequest(
      params.restaurantId,
      params.orderId,
      params.trackingToken,
    );

  if (!order.session_id) {
    throw new AppError(
      "Dining session not found.",
      ERROR_CODES.VALIDATION_ERROR,
      400,
    );
  }

  if (order.order_status === "cancelled") {
    throw new AppError(
      "Order cancelled.",
      ERROR_CODES.VALIDATION_ERROR,
      400,
    );
  }

  const existingRequest =
    await this.repository.findPendingCustomerRequest(
      order.session_id,
      params.requestType,
    );

  if (existingRequest) {
    return {
      alreadyRequested: true,
      orderId: order.id,
      sessionId: order.session_id,
      requestType: params.requestType,
    };
  }

  await this.repository.createCustomerRequest({
    restaurantId: order.restaurant_id,
    tableId: order.table_id,
    tableName: order.table_name,
    sessionId: order.session_id,
    orderId: order.id,
    requestType: params.requestType,
    customMessage:
      params.requestType === "other"
        ? params.customMessage ?? null
        : null,
  });

  await createNotification({
    restaurantId: order.restaurant_id,
    type: NOTIFICATION_TYPES.WAITER_REQUEST,
    title:
      params.requestType === "other"
        ? "💬 Custom Request"
        : `${params.requestType
            .charAt(0)
            .toUpperCase()}${params.requestType.slice(1)} Request`,
    message:
      params.requestType === "other"
        ? `${order.table_name} • ${params.customMessage}`
        : `${order.table_name} requested ${params.requestType}`,
    entityType: "request",
  });

  await this.repository.touchTableActivity(
    order.table_id,
  );

  return {
    alreadyRequested: false,
    orderId: order.id,
    sessionId: order.session_id,
    requestType: params.requestType,
  };
}
}