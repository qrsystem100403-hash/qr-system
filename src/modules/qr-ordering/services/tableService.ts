import { DatabaseError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { TableRepository } from "../repositories/tableRepository";

export class TableService {
  constructor(
    private readonly repository: TableRepository,
  ) {}

  async getByQrToken(
    restaurantId: string,
    qrToken: string,
  ) {
    try {
      return await this.repository.getByQrToken(
        restaurantId,
        qrToken,
      );
    } catch (error) {
      logger.error({
        message: "Failed to load restaurant table",
        error,
        context: {
          module: "qr-ordering",
          action: "getByQrToken",
          restaurantId,
          metadata: {
            qrToken,
          },
        },
      });

      throw new DatabaseError(
        "Failed to load restaurant table",
        error,
      );
    }
  }
}