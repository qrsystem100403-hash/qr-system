import { NextRequest } from "next/server";

import {
  badRequest,
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

import { clockIn } from "@/modules/attendance/services/clockIn";

export async function POST(
  request: NextRequest,
) {
  try {
    const {
      restaurant,
      restaurantUser,
      supabase,
    } = await requireRestaurantUser();

    const body =
      await request.json();

    const {
      latitude,
      longitude,
      accuracy,
    } = body;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      typeof accuracy !== "number"
    ) {
      logger.warn({
        message:
          "Invalid clock-in GPS data",
        context: {
          module: "attendance",
          action: "clockIn",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
          metadata: {
            latitude,
            longitude,
            accuracy,
          },
        },
      });

      return badRequest(
        "Invalid GPS data.",
      );
    }

    const result = await clockIn(
      supabase,
      {
        restaurantId:
          restaurant.id,
        staffId:
          restaurantUser.id,
        location: {
          latitude,
          longitude,
          accuracy,
        },
      },
    );

    logger.audit({
      message:
        "Staff clocked in",
      context: {
        module: "attendance",
        action: "clockIn",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
      },
    });

    return ok(result);
  } catch (error) {
    logger.error({
      message:
        "Clock-in failed",
      error,
      context: {
        module: "attendance",
        action: "clockIn",
      },
    });

    return fail(error);
  }
}