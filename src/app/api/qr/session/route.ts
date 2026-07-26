import { cookies } from "next/headers";
import { z } from "zod";

import {
  badRequest,
  conflict,
  fail,
  notFound,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { resolvePublicRestaurant } from "@/modules/core/restaurants/utils/resolvePublicRestaurant";
import {
  SessionCookieService,
  SessionService,
  SESSION_COOKIE_NAME,
} from "@/modules/sessions";
import { TableService } from "@/modules/tables";

const tableService = new TableService();
const sessionService = new SessionService();
const cookieService = new SessionCookieService();

const schema = z.object({
  tableToken: z.string().min(20).max(100),
});

export async function POST(request: Request) {
  try {
    const resolved =
  await resolvePublicRestaurant();

if (!resolved) {
  logger.warn({
    message: "Session requested for unknown restaurant",
    context: {
      module: "public-session",
      action: "startSession",
    },
  });

  return notFound("Restaurant not found");
}

const { restaurant, features } = resolved;

    const body =
      await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid session payload",
        context: {
          module: "public-session",
          action: "startSession",
          restaurantId:
            restaurant.id,
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid table",
        parsed.error.flatten(),
      );
    }

    const { tableToken } =
      parsed.data;

    const table =
      await tableService.getByQrToken(
        restaurant.id,
        tableToken,
      );

    if (!table) {
      return badRequest(
        "Invalid table",
      );
    }

    if (!table.is_active) {
      return badRequest(
        "Table inactive",
      );
    }

    const sessionToken =
      (
        await cookies()
      ).get(
        SESSION_COOKIE_NAME,
      )?.value;

    if (sessionToken) {
      const currentSession =
        await sessionService.findByToken(
          sessionToken,
        );

      if (
        currentSession &&
        currentSession.status !==
          "completed" &&
        currentSession.status !==
          "expired" &&
        currentSession.table_id !==
          table.id
      ) {
        logger.warn({
          message:
            "Active session conflict",
          context: {
            module:
              "public-session",
            action:
              "startSession",
            restaurantId:
              restaurant.id,
          },
        });

        return conflict(
          "You already have an active dining session.",
          {
            code:
              "ACTIVE_SESSION_EXISTS",
          },
        );
      }
    }

    const session =
      await sessionService.getOrCreateActiveSession(
        restaurant.id,
        table.id,
      );

    const response = ok({});

    cookieService.set(
      response,
      session.session_token,
    );

    logger.info({
      message:
        "Dining session started",
      context: {
        module:
          "public-session",
        action:
          "startSession",
        restaurantId:
          restaurant.id,
        metadata: {
          tableId: table.id,
          sessionId:
            session.id,
        },
      },
    });

    return response;
  } catch (error) {
    logger.error({
      message:
        "Failed to start dining session",
      error,
      context: {
        module:
          "public-session",
        action:
          "startSession",
      },
    });

    return fail(error);
  }
}