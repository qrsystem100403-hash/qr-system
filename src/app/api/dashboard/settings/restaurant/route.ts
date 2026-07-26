import { z } from "zod";

import {
  badRequest,
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { supabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  tagline: z
    .string()
    .trim()
    .max(80)
    .nullable()
    .optional(),

  phone: z
    .string()
    .trim()
    .min(10)
    .max(20),

  address: z
    .string()
    .trim()
    .max(300)
    .nullable()
    .optional(),

  gst_number: z
    .string()
    .trim()
    .max(20)
    .nullable()
    .optional(),

  fssai_number: z
    .string()
    .trim()
    .max(20)
    .nullable()
    .optional(),

  logo: z
    .string()
    .url()
    .nullable()
    .optional(),
});

export async function PATCH(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid restaurant profile payload",
        context: {
          module: "settings",
          action:
            "updateRestaurantProfile",
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid restaurant details.",
        parsed.error.flatten(),
      );
    }

    const {
      restaurant,
      restaurantUser,
    } =
      await requireRestaurantUser();

    const { error } =
      await supabaseAdmin
        .from("restaurants")
        .update({
          name: parsed.data.name,
          tagline:
            parsed.data.tagline,
          phone:
            parsed.data.phone,
          address:
            parsed.data.address,
          gst_number:
            parsed.data.gst_number,
          fssai_number:
            parsed.data.fssai_number,
          logo:
            parsed.data.logo,
        })
        .eq(
          "id",
          restaurant.id,
        );

    if (error) {
      logger.error({
        message:
          "Failed to update restaurant profile",
        error,
        context: {
          module: "settings",
          action:
            "updateRestaurantProfile",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
        },
      });

      return fail(error);
    }

    logger.audit({
      message:
        "Restaurant profile updated",
      context: {
        module: "settings",
        action:
          "updateRestaurantProfile",
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
      "Restaurant profile updated successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while updating restaurant profile",
      error,
      context: {
        module: "settings",
        action:
          "updateRestaurantProfile",
      },
    });

    return fail(error);
  }
}