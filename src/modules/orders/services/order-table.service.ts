import {
  NotFoundError,
  ValidationError,
} from "@/lib/errors";
import { OrderTableRepository } from "../repositories/order-table.repository";

export class OrderTableService {
  constructor(
    private readonly repository =
      new OrderTableRepository(),
  ) {}

  async getTableByToken(
    restaurantId: string,
    tableToken: string,
  ) {
    const table =
      await this.repository.getByQrToken(
        restaurantId,
        tableToken,
      );

    if (!table) {
      throw new NotFoundError("Table");
    }

    if (!table.is_active) {
      throw new ValidationError(
  "This table is not accepting orders.",
);
    }

    return table;
  }
}