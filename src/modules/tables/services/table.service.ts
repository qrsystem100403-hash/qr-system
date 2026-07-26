import { BaseService } from "@/modules/core/services/base.service";

import { TableRepository } from "../repositories";
import { RestaurantTable } from "../types";

export class TableService extends BaseService {
  private readonly repository =
    new TableRepository();

  async getByQrToken(
    restaurantId: string,
    qrToken: string
  ): Promise<RestaurantTable | null> {
    return this.repository.findByQrToken(
      restaurantId,
      qrToken
    );
  }

  async getById(
    tableId: string
  ): Promise<RestaurantTable | null> {
    return this.repository.findById(
      tableId
    );
  }

  async markOccupied(
    tableId: string
  ) {
    return this.repository.updateStatus(
      tableId,
      "occupied"
    );
  }

  async markBillRequested(
    tableId: string
  ) {
    return this.repository.updateStatus(
      tableId,
      "bill_requested"
    );
  }

  async markAvailable(
    tableId: string
  ) {
    return this.repository.updateStatus(
      tableId,
      "available"
    );
  }

  async touch(tableId: string) {
  return this.repository.touch(tableId);
}
}