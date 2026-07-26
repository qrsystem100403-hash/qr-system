import { ValidationError } from "@/lib/errors";
import type { CartItem } from "../types/order.types";

export class OrderRequestValidationService {
  private static readonly MAX_TOTAL_QUANTITY = 100;
  private static readonly MAX_ORDER_TOTAL = 100000;

  validateCart(cart: CartItem[]) {
    const totalQuantity = cart.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    if (totalQuantity > OrderRequestValidationService.MAX_TOTAL_QUANTITY) {
      throw new ValidationError(
        "Too many items in one order",
      );
    }
  }

  validateGrandTotal(total: number) {
    if (
      total <= 0 ||
      total > OrderRequestValidationService.MAX_ORDER_TOTAL
    ) {
      throw new ValidationError(
        "Invalid order total",
      );
    }
  }
}