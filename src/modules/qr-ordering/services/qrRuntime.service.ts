import { restaurantServices } from "@/modules/core/services";
import { publicRuntimeService } from "@/modules/public/services/publicRuntime.service";

import type { QRPageRuntime } from "../types/runtime";

export class QRRuntimeService {
  

  async build(params: {
    qrToken: string;
  }): Promise<QRPageRuntime | null> {
    const runtime =
      await publicRuntimeService.resolve();

    if (!runtime) {
      return null;
    }

    const [table, menu] = await Promise.all([
  restaurantServices.table.getByQrToken(
    runtime.restaurant.id,
    params.qrToken,
  ),

  restaurantServices.menu.getPublicMenu(
    runtime.restaurant.id,
  ),
]);

    return {
      runtime,

      table: {
        id: table.id,
        name: table.name,
        qrToken: table.qr_token,
        isActive: table.is_active,
      },

      menu,
    };
  }
}

export const qrRuntimeService =
  new QRRuntimeService();