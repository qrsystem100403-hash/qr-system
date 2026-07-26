import { OrderRepository } from "../repositories/order.repository";
import { SessionService } from "@/modules/sessions";

export class OrderCompletionService {
  constructor(
    private readonly repository = new OrderRepository(),
    private readonly sessionService = new SessionService(),
  ) {}

  async completeSessionIfEligible(
    sessionId: string,
    tableId: string,
  ) {
    const sessionOrders =
      await this.repository.getSessionOrders(
        sessionId,
      );

    const hasIncompleteOrders =
      sessionOrders.some(
        (order) =>
          order.order_status !== "cancelled" &&
          (
            order.payment_status !== "paid" ||
            order.order_status !== "served"
          ),
      );

    if (!hasIncompleteOrders) {
      await this.sessionService.completeAndFreeTable(
        sessionId,
        tableId,
      );
    }
  }
}