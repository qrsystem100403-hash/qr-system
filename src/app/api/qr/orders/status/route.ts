import { z } from "zod";

import {
  badRequest,
  fail,
  notFound,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { resolvePublicRestaurant } from "@/modules/core/restaurants/utils/resolvePublicRestaurant";
import { supabaseAdmin } from "@/lib/supabase/admin";

const statusQuerySchema = z.object({
  orderId: z.string().uuid(),
  trackingToken: z.string().trim().min(4).max(32),
  tableToken: z.string().min(20).max(100),
});

export async function GET(request: Request) {
  try {
    const resolved =
  await resolvePublicRestaurant();

if (!resolved) {
  logger.warn({
    message:
      "Order status requested for unknown restaurant",
    context: {
      module: "public-order",
      action: "getOrderStatus",
    },
  });

  return notFound(
    "Restaurant not found",
  );
}

const { restaurant } = resolved;
// or:
// const { restaurant, features } = resolved;

    const { searchParams } =
      new URL(request.url);

    const parsed =
      statusQuerySchema.safeParse({
        orderId:
          searchParams.get("orderId"),
        trackingToken:
          searchParams.get(
            "trackingToken",
          ),
        tableToken:
          searchParams.get(
            "tableToken",
          ),
      });

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid order status request",
        context: {
          module: "public-order",
          action: "getOrderStatus",
          restaurantId:
            restaurant.id,
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid order request",
        parsed.error.flatten(),
      );
    }

    const {
      orderId,
      trackingToken,
      tableToken,
    } = parsed.data;

    const {
      data: restaurantTable,
      error: tableError,
    } = await supabaseAdmin
      .from("restaurant_tables")
      .select("id")
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .eq("qr_token", tableToken)
      .single();

    if (tableError || !restaurantTable) {
      logger.warn({
        message:
          "Invalid table token used for order lookup",
        context: {
          module: "public-order",
          action: "getOrderStatus",
          restaurantId:
            restaurant.id,
        },
      });

      return badRequest(
        "Invalid table",
      );
    }

    const {
      data: order,
      error,
    } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        tracking_token,
        table_id,
        table_name,
        subtotal,
        service_charge,
        service_charge_enabled,
        service_charge_type,
        service_charge_value,
        gst_enabled,
        gst_mode,
        gst_percent,
        gst_amount,
        round_off,
        total,
        order_status,
        payment_status,
        cancel_reason,
        created_at
      `)
      .eq("id", orderId)
      .eq(
        "tracking_token",
        trackingToken.toUpperCase(),
      )
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .eq(
        "table_id",
        restaurantTable.id,
      )
      .single();

    if (error || !order) {
      logger.warn({
        message:
          "Order not found",
        context: {
          module: "public-order",
          action: "getOrderStatus",
          restaurantId:
            restaurant.id,
          metadata: {
            orderId,
          },
        },
      });

      return notFound(
        "Order not found",
      );
    }

    logger.info({
      message:
        "Order status fetched",
      context: {
        module: "public-order",
        action: "getOrderStatus",
        restaurantId:
          restaurant.id,
        metadata: {
          orderId,
        },
      },
    });

    return ok(order);
  } catch (error) {
    logger.error({
      message:
        "Failed to fetch order status",
      error,
      context: {
        module: "public-order",
        action: "getOrderStatus",
      },
    });

    return fail(error);
  }
}