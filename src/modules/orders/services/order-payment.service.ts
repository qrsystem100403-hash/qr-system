import { AppError } from "@/lib/errors";
import { ERROR_CODES } from "@/lib/errors/error.codes";
import { OrderRepository } from "../repositories/order.repository";
import { OrderCompletionService } from "./order-completion.service";

export class OrderPaymentService {
  constructor(
    private readonly repository = new OrderRepository(),
    private readonly completionService =
  new OrderCompletionService(),
  ) {}

  async updatePayment(params: {
    restaurantId: string;
    orderId: string;
  }) {
    const existingOrder =
      await this.repository.findForPaymentUpdate(
        params.restaurantId,
        params.orderId,
      );

    if (existingOrder.order_status === "cancelled") {
      throw new AppError(
        "Cancelled order cannot be marked paid.",
        ERROR_CODES.VALIDATION_ERROR,
        400,
      );
    }

    if (existingOrder.payment_status === "paid") {
      return;
    }

    await this.repository.markPaid(
      params.restaurantId,
      params.orderId,
    );

    if (
      existingOrder.session_id &&
      existingOrder.table_id
    ) {
      await this.completionService.completeSessionIfEligible(
  existingOrder.session_id,
  existingOrder.table_id,
);

      
    }
  }
}