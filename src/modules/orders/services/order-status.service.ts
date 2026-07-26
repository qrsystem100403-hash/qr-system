import type { OrderStatus } from "@/lib/orders/statuses";

import { OrderRepository } from "../repositories/order.repository";
import { TableService } from "@/modules/tables";

import {
  SIMPLE_TRANSITIONS,
  ADVANCED_TRANSITIONS,
} from "@/lib/orders/transitions";

import { AppError } from "@/lib/errors";
import { ERROR_CODES } from "@/lib/errors/error.codes";
import { OrderCompletionService } from "./order-completion.service";

export class OrderStatusService {
  constructor(
    private readonly repository = new OrderRepository(),
    private readonly tableService = new TableService(),
    private readonly completionService =
  new OrderCompletionService(),
  ) {}

  async updateStatus(params: {
    restaurantId: string;
    workflowMode: "simple" | "advanced";
    tableWorkflowMode: "simple" | "advanced" | "expert";
    orderId: string;
    status: OrderStatus;
    cancelReason: string | null;
  }) {
    const existingOrder =
      await this.repository.findForStatusUpdate(
        params.restaurantId,
        params.orderId,
      );

    const currentStatus = existingOrder.order_status as OrderStatus;

const transitions =
  params.workflowMode === "advanced"
    ? ADVANCED_TRANSITIONS
    : SIMPLE_TRANSITIONS;

const allowedStatuses =
  transitions[
    currentStatus as keyof typeof transitions
  ] as readonly OrderStatus[] | undefined;

if (!allowedStatuses?.includes(params.status)) {
  throw new AppError(
    "Invalid status flow.",
    ERROR_CODES.VALIDATION_ERROR,
    400,
  );
}

await this.repository.updateStatus(
  params.restaurantId,
  params.orderId,
  currentStatus,
  params.status,
  params.cancelReason,
);

if (
  currentStatus === "pending" &&
  params.status === "preparing" &&
  params.tableWorkflowMode !== "expert"
) {
  const tableStatus =
  existingOrder.restaurant_tables.at(0)?.status;

  if (tableStatus === "available") {
    await this.tableService.markOccupied(
      existingOrder.table_id,
    );
  }
}

if (
  params.status === "served" &&
  existingOrder.session_id &&
  existingOrder.payment_status === "paid"
) {
  
if (
  params.status === "served" &&
  existingOrder.session_id &&
  existingOrder.payment_status === "paid"
) {
  await this.completionService.completeSessionIfEligible(
    existingOrder.session_id,
    existingOrder.table_id,
  );
}
}

    

  }
}