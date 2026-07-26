import { NextRequest } from "next/server";

import {
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireOwnerUser } from "@/lib/requireRestaurantUser";

import { getAttendanceSettings } from "@/modules/settings/services/getAttendanceSettings";
import { updateAttendanceSettings } from "@/modules/settings/services/updateAttendanceSettings";

export async function GET() {
  try {
    const {
      restaurant,
      restaurantUser,
      supabase,
    } =
      await requireOwnerUser();

    const settings =
      await getAttendanceSettings(
        supabase,
        restaurant.id,
      );

    logger.info({
      message:
        "Attendance settings loaded",
      context: {
        module: "settings",
        action:
          "getAttendanceSettings",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
      },
    });

    return ok(settings);
  } catch (error) {
    logger.error({
      message:
        "Failed to load attendance settings",
      error,
      context: {
        module: "settings",
        action:
          "getAttendanceSettings",
      },
    });

    return fail(error);
  }
}

export async function PATCH(
  request: NextRequest,
) {
  try {
    const {
      restaurant,
      restaurantUser,
      supabase,
    } =
      await requireOwnerUser();

    const body =
      await request.json();

    await updateAttendanceSettings(
      supabase,
      restaurant.id,
      body,
    );

    logger.audit({
      message:
        "Attendance settings updated",
      context: {
        module: "settings",
        action:
          "updateAttendanceSettings",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
        metadata: {
          updated: true,
        },
      },
    });

    return ok(
      undefined,
      "Attendance settings updated successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Failed to update attendance settings",
      error,
      context: {
        module: "settings",
        action:
          "updateAttendanceSettings",
      },
    });

    return fail(error);
  }
}