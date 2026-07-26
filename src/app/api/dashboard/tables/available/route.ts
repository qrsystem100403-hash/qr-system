import { z } from "zod";

import {
  badRequest,
  fail,
  forbidden,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

const schema = z.object({
  tableId: z.string().uuid(),
  status: z.enum([
    "available",
    "occupied",
    "bill_requested",
  ]),
});

const ALLOWED_ROLES = [
  "owner",
  "manager",
  "cashier",
] as const;

function canManageTable(role: string) {
  return ALLOWED_ROLES.includes(
    role as (typeof ALLOWED_ROLES)[number],
  );
}

export async function PATCH(
  request: Request,
) {
  try {
    const {
      restaurant,
      supabase,
      role,
    } =
      await requireRestaurantUser();

    if (!canManageTable(role)) {
      logger.warn({
        message:
          "Unauthorized table status update attempt",
        context: {
          module: "tables",
          action: "updateTableStatus",
          restaurantId:
            restaurant.id,
        },
      });

      return forbidden();
    }

    const body =
      await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid table status update request",
        context: {
          module: "tables",
          action: "updateTableStatus",
          restaurantId:
            restaurant.id,
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid table.",
        parsed.error.flatten(),
      );
    }

    const {
      tableId,
      status,
    } = parsed.data;

    const updates: Record<
      string,
      unknown
    > = {
      status,
      last_activity_at:
        new Date().toISOString(),
    };

    if (status === "available") {
      updates.current_session_token =
        null;
      updates.session_started_at =
        null;
      updates.session_expires_at =
        null;
    }

    const { error } =
      await supabase
        .from("restaurant_tables")
        .update(updates)
        .eq("id", tableId)
        .eq(
          "restaurant_id",
          restaurant.id,
        );

    if (error) {
      logger.error({
        message:
          "Failed to update table status",
        error,
        context: {
          module: "tables",
          action:
            "updateTableStatus",
          restaurantId:
            restaurant.id,
          metadata: {
            tableId,
            status,
          },
        },
      });

      return fail(error);
    }

    logger.audit({
      message:
        "Table status updated",
      context: {
        module: "tables",
        action:
          "updateTableStatus",
        restaurantId:
          restaurant.id,
        metadata: {
          tableId,
          status,
        },
      },
    });

    return ok();
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while updating table status",
      error,
      context: {
        module: "tables",
        action:
          "updateTableStatus",
      },
    });

    return fail(error);
  }
}