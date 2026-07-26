import crypto from "crypto";

import { z } from "zod";

import {
  badRequest,
  conflict,
  fail,
  forbidden,
  ok,
  created,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

const ALLOWED_TABLE_ROLES = [
  "owner",
  "manager",
] as const;

const createTableSchema = z.object({
  name: z.string().trim().min(1).max(30),
});

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

export async function GET() {
  try {
    const {
      restaurant,
      supabase,
    } = await requireRestaurantUser();

    const { data, error } =
      await supabase
        .from("restaurant_tables")
        .select(
          "id, name, qr_token, is_active, status, last_activity_at, created_at",
        )
        .eq(
          "restaurant_id",
          restaurant.id,
        )
        .order("created_at", {
          ascending: true,
        });

    if (error) {
      logger.error({
        message:
          "Failed to load restaurant tables",
        error,
        context: {
          module: "tables",
          action: "getTables",
          restaurantId:
            restaurant.id,
        },
      });

      return fail(error);
    }

    return ok({
      tables: data ?? [],
      tableWorkflowMode:
        restaurant.table_workflow_mode ??
        "simple",
    });
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while loading tables",
      error,
      context: {
        module: "tables",
        action: "getTables",
      },
    });

    return fail(error);
  }
}

export async function POST(
  request: Request,
) {
  try {
    const {
      restaurant,
      supabase,
      role,
    } =
      await requireRestaurantUser();

    if (!canManageTables(role)) {
      logger.warn({
        message:
          "Unauthorized table creation attempt",
        context: {
          module: "tables",
          action: "createTable",
          restaurantId:
            restaurant.id,
        },
      });

      return forbidden();
    }

    const body =
      await request.json();

    const parsed =
      createTableSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      logger.warn({
        message:
          "Table validation failed",
        context: {
          module: "tables",
          action: "createTable",
          restaurantId:
            restaurant.id,
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid table data",
        parsed.error.flatten(),
      );
    }

    const name =
      normalizeTableName(
        parsed.data.name,
      );

    const { data, error } =
      await supabase
        .from("restaurant_tables")
        .insert({
          restaurant_id:
            restaurant.id,
          name,
          is_active: true,
          qr_token:
            crypto
              .randomBytes(16)
              .toString("hex"),
        })
        .select(
          "id, name, qr_token, is_active, status, last_activity_at, created_at",
        )
        .single();

    if (error) {
      logger.error({
        message:
          "Failed to create restaurant table",
        error,
        context: {
          module: "tables",
          action: "createTable",
          restaurantId:
            restaurant.id,
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
        "Restaurant table created",
      context: {
        module: "tables",
        action: "createTable",
        restaurantId:
          restaurant.id,
      },
    });

    return created(data);
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while creating table",
      error,
      context: {
        module: "tables",
        action: "createTable",
      },
    });

    return fail(error);
  }
}