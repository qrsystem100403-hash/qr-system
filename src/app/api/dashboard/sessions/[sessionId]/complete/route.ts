import {
  badRequest,
  fail,
  notFound,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { SessionService } from "@/modules/sessions";

const sessionService =
  new SessionService();

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

    const {
      data: session,
      error,
    } = await supabase
      .from("table_sessions")
      .select(`
        id,
        table_id,
        status,
        payment_status
      `)
      .eq("id", sessionId)
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .single();

    if (error) {
      logger.error({
        message:
          "Failed to fetch session",
        error,
        context: {
          module: "sessions",
          action:
            "completeSession",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
          metadata: {
            sessionId,
          },
        },
      });

      return fail(error);
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
      session.payment_status !==
      "paid"
    ) {
      return badRequest(
        "Payment has not been received",
      );
    }

    await sessionService.completeAndFreeTable(
      session.id,
      session.table_id,
    );

    logger.audit({
      message:
        "Session completed",
      context: {
        module: "sessions",
        action:
          "completeSession",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
        metadata: {
          sessionId,
          tableId:
            session.table_id,
        },
      },
    });

    return ok(
      undefined,
      "Session completed successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while completing session",
      error,
      context: {
        module: "sessions",
        action:
          "completeSession",
      },
    });

    return fail(error);
  }
}