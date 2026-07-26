import { z } from "zod";

import {
  badRequest,
  conflict,
  fail,
  forbidden,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

const ALLOWED_TABLE_ROLES = [
  "owner",
  "manager",
] as const;

const paramsSchema = z.object({
  tableId: z.string().uuid(),
});

const updateTableSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(30)
      .optional(),
    is_active: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.is_active !== undefined,
    {
      message: "No valid fields provided",
    },
  );

type Params = {
  params: Promise<{
    tableId: string;
  }>;
};

function canManageTables(role: string) {
  return ALLOWED_TABLE_ROLES.includes(
    role as (typeof ALLOWED_TABLE_ROLES)[number],
  );
}

function normalizeTableName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-");
}

export async function PATCH(
  request: Request,
  { params }: Params,
) {
  try {
    const rawParams =
      await params;

    const parsedParams =
      paramsSchema.safeParse(rawParams);

    if (!parsedParams.success) {
      logger.warn({
        message:
          "Invalid table id",
        context: {
          module: "tables",
          action: "updateTable",
          metadata: {
            issues:
              parsedParams.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid table id",
        parsedParams.error.flatten(),
      );
    }

    const { tableId } =
      parsedParams.data;

    const {
      restaurant,
      supabase,
      role,
    } =
      await requireRestaurantUser();

    if (!canManageTables(role)) {
      logger.warn({
        message:
          "Unauthorized table update attempt",
        context: {
          module: "tables",
          action: "updateTable",
          restaurantId:
            restaurant.id,
          metadata: {
            tableId,
          },
        },
      });

      return forbidden();
    }

    const body =
      await request.json();

    const parsedBody =
      updateTableSchema.safeParse(
        body,
      );

    if (!parsedBody.success) {
      logger.warn({
        message:
          "Invalid table update payload",
        context: {
          module: "tables",
          action: "updateTable",
          restaurantId:
            restaurant.id,
          metadata: {
            tableId,
            issues:
              parsedBody.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid table data",
        parsedBody.error.flatten(),
      );
    }

    const updates: {
      name?: string;
      is_active?: boolean;
    } = {};

    if (
      parsedBody.data.name !==
      undefined
    ) {
      updates.name =
        normalizeTableName(
          parsedBody.data.name,
        );
    }

    if (
      parsedBody.data.is_active !==
      undefined
    ) {
      updates.is_active =
        parsedBody.data.is_active;
    }

    const {
      data,
      error,
    } = await supabase
      .from("restaurant_tables")
      .update(updates)
      .eq("id", tableId)
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .select(
        "id, name, qr_token, is_active, status, last_activity_at, created_at",
      )
      .single();

    if (error) {
      logger.error({
        message:
          "Failed to update restaurant table",
        error,
        context: {
          module: "tables",
          action: "updateTable",
          restaurantId:
            restaurant.id,
          metadata: {
            tableId,
          },
        },
      });

      if (error.code === "23505") {
        return conflict(
          "Table name already exists",
        );
      }

      return fail(error);
    }

    logger.audit({
      message:
        "Restaurant table updated",
      context: {
        module: "tables",
        action: "updateTable",
        restaurantId:
          restaurant.id,
        metadata: {
          tableId,
        },
      },
    });

    return ok(data);
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while updating table",
      error,
      context: {
        module: "tables",
        action: "updateTable",
      },
    });

    return fail(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: Params,
) {
  try {
    const rawParams =
      await params;

    const parsedParams =
      paramsSchema.safeParse(rawParams);

    if (!parsedParams.success) {
      logger.warn({
        message:
          "Invalid table id",
        context: {
          module: "tables",
          action: "deleteTable",
          metadata: {
            issues:
              parsedParams.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid table id",
        parsedParams.error.flatten(),
      );
    }

    const { tableId } =
      parsedParams.data;

    const {
      restaurant,
      supabase,
      role,
    } =
      await requireRestaurantUser();

    if (!canManageTables(role)) {
      logger.warn({
        message:
          "Unauthorized table deletion attempt",
        context: {
          module: "tables",
          action: "deleteTable",
          restaurantId:
            restaurant.id,
          metadata: {
            tableId,
          },
        },
      });

      return forbidden();
    }

    const { error } =
      await supabase
        .from("restaurant_tables")
        .delete()
        .eq("id", tableId)
        .eq(
          "restaurant_id",
          restaurant.id,
        );

    if (error) {
      logger.error({
        message:
          "Failed to delete restaurant table",
        error,
        context: {
          module: "tables",
          action: "deleteTable",
          restaurantId:
            restaurant.id,
          metadata: {
            tableId,
          },
        },
      });

      return fail(error);
    }

    logger.audit({
      message:
        "Restaurant table deleted",
      context: {
        module: "tables",
        action: "deleteTable",
        restaurantId:
          restaurant.id,
        metadata: {
          tableId,
        },
      },
    });

    return ok(
      undefined,
      "Table deleted successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while deleting table",
      error,
      context: {
        module: "tables",
        action: "deleteTable",
      },
    });

    return fail(error);
  }
}