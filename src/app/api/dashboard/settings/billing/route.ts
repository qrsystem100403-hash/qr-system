import { z } from "zod";

import {
  badRequest,
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

const schema = z.object({
  gst_enabled: z.boolean(),
  gst_mode: z.enum([
    "exclusive",
    "inclusive",
  ]),
  gst_percent: z
    .number()
    .min(0)
    .max(100),

  service_charge_enabled:
    z.boolean(),

  service_charge_type: z.enum([
    "percentage",
    "fixed",
  ]),

  service_charge_value: z
    .number()
    .min(0)
    .max(100000),

  round_off_enabled:
    z.boolean(),

  receipt_branding: z.enum([
    "logo",
    "name",
    "logo_name",
    "compact",
  ]),
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
          "Invalid billing settings payload",
        context: {
          module: "settings",
          action:
            "updateBillingSettings",
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid billing settings.",
        parsed.error.flatten(),
      );
    }

    const {
      restaurant,
      restaurantUser,
      supabase,
    } =
      await requireRestaurantUser();

    const { error } =
      await supabase
        .from(
          "restaurant_billing_settings",
        )
        .upsert(
          {
            restaurant_id:
              restaurant.id,
            ...parsed.data,
          },
          {
            onConflict:
              "restaurant_id",
          },
        );

    if (error) {
      logger.error({
        message:
          "Failed to update billing settings",
        error,
        context: {
          module: "settings",
          action:
            "updateBillingSettings",
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
        "Billing settings updated",
      context: {
        module: "settings",
        action:
          "updateBillingSettings",
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
      "Billing settings updated successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while updating billing settings",
      error,
      context: {
        module: "settings",
        action:
          "updateBillingSettings",
      },
    });

    return fail(error);
  }
}