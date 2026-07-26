import { headers } from "next/headers";

import { DatabaseError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { supabaseAdmin } from "@/lib/supabase/admin";

import { normalizeHost } from "@/modules/core/restaurants/utils/restaurant.mapper";

export async function resolvePublicRestaurant() {
  const headersList = await headers();

  const host =
    headersList.get("x-forwarded-host") ??
    headersList.get("host") ??
    "";

  const domain = normalizeHost(host);

  const { data: restaurant, error: restaurantError } =
    await supabaseAdmin
      .from("restaurants")
      .select(`
        id,
        name,
        slug,
        logo,
        primary_color,
        domain,
        phone,
        table_workflow_mode
      `)
      .eq("domain", domain)
      .maybeSingle();

  if (restaurantError) {
    logger.error({
      message: "Failed to resolve public restaurant",
      error: restaurantError,
      context: {
        module: "restaurant",
        action: "resolvePublicRestaurant",
        metadata: {
          domain,
        },
      },
    });

    throw new DatabaseError(
      "Failed to resolve restaurant",
      restaurantError,
    );
  }

  if (!restaurant) {
    logger.warn({
      message: "Restaurant not found for domain",
      context: {
        module: "restaurant",
        action: "resolvePublicRestaurant",
        metadata: {
          domain,
        },
      },
    });

    return null;
  }

  const { data: features, error: featuresError } =
    await supabaseAdmin
      .from("restaurant_features")
      .select(`
        kitchen_display_enabled,
        waiter_dashboard_enabled,
        cashier_dashboard_enabled,
        online_orders_enabled,
        attendance_enabled,
        inventory_enabled
      `)
      .eq("restaurant_id", restaurant.id)
      .maybeSingle();

  if (featuresError) {
    logger.error({
      message: "Failed to load restaurant features",
      error: featuresError,
      context: {
        module: "restaurant",
        action: "loadFeatures",
        restaurantId: restaurant.id,
      },
    });

    throw new DatabaseError(
      "Failed to load restaurant features",
      featuresError,
    );
  }

  return {
  restaurant,
  features,
}
}