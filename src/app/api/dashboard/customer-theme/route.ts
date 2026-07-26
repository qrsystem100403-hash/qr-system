import { NextRequest } from "next/server";

import { ok, fail } from "@/lib/api/api-response";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { logger } from "@/lib/logger";

import { createRestaurantServices } from "@/modules/core/services/restaurantServices";
import { customerThemeSchema } from "@/modules/customer-theme/validators/customerThemeSchema";

async function getContext() {
  const session = await requireRestaurantUser();

  return {
    session,
    services: createRestaurantServices(session.supabase),
  };
}

export async function GET() {
  try {
    const { session, services } = await getContext();

    const theme = await services.customerTheme.getTheme(
      session.restaurant.id,
    );

    return ok(theme);
  } catch (error) {
    logger.error({
      message: "Failed to load customer theme",
      error,
      context: {
        module: "customer-theme",
        action: "GET",
      },
    });

    return fail(error);
  }
}

export async function PATCH(
  request: NextRequest,
) {
  try {
    const { session, services } = await getContext();

    const body = await request.json();

    const updates = customerThemeSchema.parse(body);

    const theme = await services.customerTheme.updateTheme(
      session.restaurant.id,
      updates,
    );

    return ok(
      theme,
      "Customer theme updated successfully",
    );
  } catch (error) {
    logger.error({
      message: "Failed to update customer theme",
      error,
      context: {
        module: "customer-theme",
        action: "PATCH",
      },
    });

    return fail(error);
  }
}