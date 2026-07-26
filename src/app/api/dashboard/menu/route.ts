import { z } from "zod";

import {
  badRequest,
  created,
  fail,
  forbidden,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

const ALLOWED_BADGES = [
  "Best Seller",
  "Chef's Choice",
  "Recommended",
  "Limited Time",
  "New",
  "Popular",
  "Spicy",
  "Special",
  "Today Special",
  "Must Try",
] as const;

const ALLOWED_MENU_ROLES = [
  "owner",
  "manager",
] as const;

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  price: z
    .number()
    .positive()
    .max(99999)
    .multipleOf(0.01),
  categoryId: z.string().uuid(),
  image: z.string().url().nullable().optional(),
  imagePublicId: z
    .string()
    .trim()
    .max(255)
    .nullable()
    .optional(),
  isAvailable: z.boolean(),
  tag: z
    .array(z.enum(ALLOWED_BADGES))
    .max(3)
    .optional(),
});

export async function POST(
  request: Request,
) {
  try {
    const {
      restaurant,
      supabase,
      role,
      restaurantUser,
    } =
      await requireRestaurantUser();

    if (
      !ALLOWED_MENU_ROLES.includes(
        role as (typeof ALLOWED_MENU_ROLES)[number],
      )
    ) {
      logger.warn({
        message:
          "Unauthorized menu creation attempt",
        context: {
          module: "menu",
          action: "createMenuItem",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
        },
      });

      return forbidden();
    }

    const body =
      await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid menu item payload",
        context: {
          module: "menu",
          action: "createMenuItem",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid menu item data",
        parsed.error.flatten(),
      );
    }

    const {
      name,
      price,
      categoryId,
      image,
      imagePublicId,
      isAvailable,
      tag,
    } = parsed.data;

    const cleanedTag = Array.from(
      new Set(tag ?? []),
    );

    const {
      data: category,
      error: categoryError,
    } = await supabase
      .from("menu_categories")
      .select("id, parent_id")
      .eq("id", categoryId)
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .eq("is_active", true)
      .not(
        "parent_id",
        "is",
        null,
      )
      .single();

    if (
      categoryError ||
      !category
    ) {
      logger.warn({
        message:
          "Invalid menu subcategory",
        context: {
          module: "menu",
          action: "createMenuItem",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
          metadata: {
            categoryId,
          },
        },
      });

      return badRequest(
        "Invalid subcategory",
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("menu_items")
      .insert({
        restaurant_id:
          restaurant.id,
        name,
        price,
        category_id:
          categoryId,
        image:
          image ?? null,
        image_public_id:
          imagePublicId ??
          null,
        is_available:
          isAvailable,
        is_archived: false,
        tag: cleanedTag,
      })
      .select("id")
      .single();

    if (error || !data) {
      logger.error({
        message:
          "Failed to create menu item",
        error,
        context: {
          module: "menu",
          action: "createMenuItem",
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
        "Menu item created",
      context: {
        module: "menu",
        action: "createMenuItem",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
        metadata: {
          menuItemId: data.id,
          categoryId,
        },
      },
    });

    return created(
      {
        itemId: data.id,
      },
      "Menu item created successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while creating menu item",
      error,
      context: {
        module: "menu",
        action: "createMenuItem",
      },
    });

    return fail(error);
  }
}