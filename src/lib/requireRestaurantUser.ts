import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveRestaurant } from "@/lib/restaurantResolver";
import { logger } from "@/lib/logger";

import { RestaurantFeatureService } from "@/modules/core/restaurants/services/restaurant-feature.service";

import {
  ROLES,
  VALID_ROLES,
  type RestaurantRole,
} from "@/lib/auth/roles";

const restaurantFeatureService =
  new RestaurantFeatureService();

export async function requireRestaurantUser() {
  const supabase = await createSupabaseServerClient();

  const [restaurant, authResult] =
    await Promise.all([
      resolveRestaurant(),
      supabase.auth.getUser(),
    ]);

  const features =
    await restaurantFeatureService.getFeatures(
      restaurant.id,
    );

  const {
    data: { user },
    error: userError,
  } = authResult;

  if (userError || !user) {
    logger.warn({
  message: "Unauthorized access attempt",
  context: {
    module: "auth",
    action: "requireRestaurantUser",
    restaurantId: restaurant.id,
  },
});

    redirect("/login");
  }

  const {
    data: membership,
    error: membershipError,
  } = await supabase
    .from("restaurant_users")
    .select(`
      id,
      role,
      is_active,
      attendance_shift_start,
      attendance_shift_end
    `)
    .eq("restaurant_id", restaurant.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) {
    logger.error({
  message: "Failed to fetch restaurant membership",
  error: membershipError,
  context: {
    module: "auth",
    action: "loadMembership",
    restaurantId: restaurant.id,
    userId: user.id,
  },
});
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("users")
    .select("id, full_name, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    logger.error({
  message: "Failed to fetch user profile",
  error: profileError,
  context: {
    module: "auth",
    action: "loadProfile",
    restaurantId: restaurant.id,
    userId: user.id,
  },
});
  }

  if (
    !membership ||
    !VALID_ROLES.includes(
      membership.role as RestaurantRole,
    )
  ) {
    logger.warn({
  message: "Unauthorized restaurant membership",
  context: {
    module: "auth",
    action: "validateMembership",
    restaurantId: restaurant.id,
    userId: user.id,
  },
});

    redirect("/login");
  }

  if (
    profile?.is_active === false ||
    membership.is_active === false
  ) {
    logger.warn({
  message: "Disabled account attempted login",
  context: {
    module: "auth",
    action: "accountDisabled",
    restaurantId: restaurant.id,
    userId: user.id,
  },
});

    await supabase.auth.signOut();

    redirect(
      "/login?error=account_disabled",
    );
  }

  return {
    restaurant,
    features,
    supabase,
    user,
    profile,
    restaurantUser: membership,
    role: membership.role as RestaurantRole,
  };
}

export async function requireOwnerUser() {
  const session =
    await requireRestaurantUser();

  if (session.role !== ROLES.OWNER) {
    logger.warn({
  message: "Owner route accessed without permission",
  context: {
    module: "auth",
    action: "requireOwnerUser",
    restaurantId: session.restaurant.id,
    userId: session.user.id,
  },
});

    redirect("/dashboard/orders");
  }

  return session;
}