import { AppError } from "@/lib/errors";
import { ERROR_CODES } from "@/lib/errors/error.codes";
import { OrderRateLimitRepository } from "../repositories/order-rate-limit.repository";

import { RateLimitError } from "@/lib/errors";

export class OrderRateLimitService {
  constructor(
    private readonly repository =
      new OrderRateLimitRepository(),
  ) {}

  async check(
    restaurantId: string,
    tableId: string,
  ) {
    const fiveMinutesAgo = new Date(
      Date.now() - 5 * 60 * 1000,
    ).toISOString();

    const count =
      await this.repository.getRecentOrderCount(
        restaurantId,
        tableId,
        fiveMinutesAgo,
      );

    if (count >= 10) {
      throw new RateLimitError(
  "Too many orders from this table. Try again shortly.",
);
    }
  }
}