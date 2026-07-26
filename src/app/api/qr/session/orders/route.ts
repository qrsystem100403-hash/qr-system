import { cookies } from "next/headers";

import {
  fail,
  forbidden,
  notFound,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { resolvePublicRestaurant } from "@/modules/core/restaurants/utils/resolvePublicRestaurant";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  SessionService,
  SESSION_COOKIE_NAME,
} from "@/modules/sessions";

const sessionService = new SessionService();

export async function GET() {
  try {
    const resolved =
  await resolvePublicRestaurant();

if (!resolved) {
  logger.warn({
    message:
      "Session requested for unknown restaurant",
    context: {
      module: "public-session",
      action: "getSession",
    },
  });

  return notFound(
    "Restaurant not found",
  );
}

const { restaurant } = resolved;
// If you need feature flags later:
// const { restaurant, features } = resolved;

    const sessionToken =
      (
        await cookies()
      ).get(
        SESSION_COOKIE_NAME,
      )?.value;

    if (!sessionToken) {
      return forbidden(
        "Session expired",
      );
    }

    const session =
      await sessionService.getByToken(
        sessionToken,
      );

    if (
      !session ||
      session.status ===
        "completed" ||
      session.status ===
        "expired"
    ) {
      return forbidden(
        "Dining session no longer active",
      );
    }

    const {
      data: table,
      error: tableError,
    } = await supabaseAdmin
      .from("restaurant_tables")
      .select("id,name")
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .eq("id", session.table_id)
      .single();

    if (tableError || !table) {
      logger.warn({
        message:
          "Session table not found",
        context: {
          module:
            "public-session",
          action:
            "getSession",
          restaurantId:
            restaurant.id,
          metadata: {
            tableId:
              session.table_id,
          },
        },
      });

      return notFound(
        "Table not found",
      );
    }

    const {
      data: orders,
      error: ordersError,
    } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        tracking_token,
        total,
        payment_status,
        order_status,
        cancel_reason,
        created_at,
        customer_note,
        order_items(
          id,
          qty,
          item_price,
          item_name,
          variant_name,
          order_item_addons(
            id,
            addon_name,
            addon_price
          )
        )
      `)
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .eq(
        "session_id",
        session.id,
      )
      .order(
        "created_at",
        {
          ascending: true,
        },
      );

    if (ordersError) {
      logger.error({
        message:
          "Failed to load session orders",
        error: ordersError,
        context: {
          module:
            "public-session",
          action:
            "getSession",
          restaurantId:
            restaurant.id,
          metadata: {
            sessionId:
              session.id,
          },
        },
      });

      return fail(
        ordersError,
      );
    }

    const sessionTotal =
      (orders ?? []).reduce(
        (sum, order) =>
          sum +
          Number(
            order.total ?? 0,
          ),
        0,
      );

    const paymentStatus =
      (orders ?? []).every(
        (order) =>
          order.payment_status ===
          "paid",
      )
        ? "paid"
        : "pending";

    logger.info({
      message:
        "Dining session loaded",
      context: {
        module:
          "public-session",
        action:
          "getSession",
        restaurantId:
          restaurant.id,
        metadata: {
          sessionId:
            session.id,
          orderCount:
            orders?.length ?? 0,
        },
      },
    });

    return ok({
      session: {
        id: session.id,
        table_id:
          session.table_id,
        table_name: table.name,
        status:
          session.status,
        started_at:
          session.started_at,
        bill_requested_at:
          session.bill_requested_at,
        total: sessionTotal,
        payment_status:
          paymentStatus,
      },
      orders: orders ?? [],
    });
  } catch (error) {
    logger.error({
      message:
        "Failed to load dining session",
      error,
      context: {
        module:
          "public-session",
        action:
          "getSession",
      },
    });

    return fail(error);
  }
}