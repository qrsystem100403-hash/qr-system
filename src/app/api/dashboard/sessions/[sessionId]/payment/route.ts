import { z } from "zod";

import {
  badRequest,
  conflict,
  fail,
  notFound,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

const schema = z.object({
  paymentMethod: z.enum([
    "cash",
    "upi",
    "card",
  ]),
});

type Props = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Props,
) {
  try {
    const { sessionId } =
      await params;

    const {
      restaurant,
      restaurantUser,
      supabase,
    } =
      await requireRestaurantUser();

    const body =
      await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid payment request",
        context: {
          module: "sessions",
          action:
            "receivePayment",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
          metadata: {
            sessionId,
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid payment method",
        parsed.error.flatten(),
      );
    }

    const { paymentMethod } =
      parsed.data;

    const {
      data: session,
      error: sessionFetchError,
    } = await supabase
      .from("table_sessions")
      .select(
        "id,status,payment_status",
      )
      .eq("id", sessionId)
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .single();

    if (sessionFetchError) {
      logger.error({
        message:
          "Failed to load session",
        error:
          sessionFetchError,
        context: {
          module: "sessions",
          action:
            "receivePayment",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
          metadata: {
            sessionId,
          },
        },
      });

      return fail(
        sessionFetchError,
      );
    }

    if (!session) {
      return notFound(
        "Session not found",
      );
    }

    if (
      session.status !==
        "active" &&
      session.status !==
        "bill_requested"
    ) {
      return badRequest(
        "Session is no longer available",
      );
    }

    if (
      session.payment_status ===
      "paid"
    ) {
      return conflict(
        "Payment already received",
      );
    }

    const {
      data: updatedSession,
      error: sessionError,
    } = await supabase
      .from("table_sessions")
      .update({
        payment_status: "paid",
        payment_method:
          paymentMethod,
        paid_at:
          new Date().toISOString(),
      })
      .eq("id", session.id)
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .eq(
        "payment_status",
        "pending",
      )
      .select("id")
      .single();

    if (
      sessionError ||
      !updatedSession
    ) {
      logger.warn({
        message:
          "Concurrent payment update detected",
        context: {
          module: "sessions",
          action:
            "receivePayment",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
          metadata: {
            sessionId,
          },
        },
      });

      return conflict(
        "Payment was already updated. Refresh and try again.",
      );
    }

    const {
      error: ordersError,
    } = await supabase
      .from("orders")
      .update({
        payment_status:
          "paid",
        payment_method:
          paymentMethod,
      })
      .eq(
        "session_id",
        session.id,
      );

    if (ordersError) {
      logger.error({
        message:
          "Failed to update order payments",
        error: ordersError,
        context: {
          module: "sessions",
          action:
            "receivePayment",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
          metadata: {
            sessionId,
          },
        },
      });

      return fail(
        ordersError,
      );
    }

    logger.audit({
      message:
        "Session payment received",
      context: {
        module: "sessions",
        action:
          "receivePayment",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
        metadata: {
          sessionId,
          paymentMethod,
        },
      },
    });

    return ok(
      undefined,
      "Payment received successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while receiving payment",
      error,
      context: {
        module: "sessions",
        action:
          "receivePayment",
      },
    });

    return fail(error);
  }
}