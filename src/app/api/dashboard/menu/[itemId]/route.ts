import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

import {
  badRequest,
  fail,
  forbidden,
  notFound,
  ok,
} from "@/lib/api";

import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

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
] as const

const ALLOWED_MENU_ROLES = ["owner", "manager"] as const

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  price: z.number().positive().max(99999),
  categoryId: z.string().uuid(),
  image: z.string().url().nullable().optional(),
  imagePublicId: z.string().trim().max(255).nullable().optional(),
  isAvailable: z.boolean(),
  tag: z.array(z.enum(ALLOWED_BADGES)).max(3).optional(),
})

type Props = {
  params: Promise<{
    itemId: string
  }>
}

function canManageMenu(role: string) {
  return ALLOWED_MENU_ROLES.includes(role as (typeof ALLOWED_MENU_ROLES)[number])
}

async function safeDeleteCloudinaryImage(
  publicId: string,
) {
  try {
    await cloudinary.uploader.destroy(
      publicId,
    );
  } catch (error) {
    logger.error({
      message:
        "Failed to delete Cloudinary image",
      error,
      context: {
        module: "menu",
        action: "deleteCloudinaryImage",
        metadata: {
          publicId,
        },
      },
    });
  }
}

export async function PATCH(
  request: Request,
  { params }: Props,
) {
  try {
    const { itemId } = await params;

    const {
      restaurant,
      supabase,
      role,
      restaurantUser,
    } = await requireRestaurantUser();

    if (!canManageMenu(role)) {
      logger.warn({
        message:
          "Unauthorized menu update attempt",
        context: {
          module: "menu",
          action: "updateMenuItem",
          restaurantId: restaurant.id,
          userId: restaurantUser.id,
          metadata: {
            itemId,
          },
        },
      });

      return forbidden();
    }

    const body = await request.json();

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid menu update payload",
        context: {
          module: "menu",
          action: "updateMenuItem",
          restaurantId: restaurant.id,
          userId: restaurantUser.id,
          metadata: {
            itemId,
            issues: parsed.error.flatten(),
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
      data: existingItem,
      error: existingError,
    } = await supabase
      .from("menu_items")
      .select("id, image_public_id")
      .eq("id", itemId)
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .eq("is_archived", false)
      .single();

    if (existingError) {
      logger.error({
        message:
          "Failed to fetch menu item",
        error: existingError,
        context: {
          module: "menu",
          action: "updateMenuItem",
          restaurantId: restaurant.id,
          userId: restaurantUser.id,
          metadata: {
            itemId,
          },
        },
      });

      return fail(existingError);
    }

    if (!existingItem) {
      return notFound(
        "Menu item not found",
      );
    }

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
      .not("parent_id", "is", null)
      .single();

    if (categoryError || !category) {
      logger.warn({
        message:
          "Invalid menu subcategory",
        context: {
          module: "menu",
          action: "updateMenuItem",
          restaurantId: restaurant.id,
          userId: restaurantUser.id,
          metadata: {
            categoryId,
          },
        },
      });

      return badRequest(
        "Invalid subcategory",
      );
    }

    const updatePayload: {
      name: string;
      price: number;
      category_id: string;
      image: string | null;
      is_available: boolean;
      tag: string[];
      image_public_id?: string | null;
    } = {
      name,
      price,
      category_id: categoryId,
      image: image ?? null,
      is_available: isAvailable,
      tag: cleanedTag,
    };

    if (
      imagePublicId !== undefined
    ) {
      updatePayload.image_public_id =
        imagePublicId;
    }

    const {
      data,
      error,
    } = await supabase
      .from("menu_items")
      .update(updatePayload)
      .eq("id", itemId)
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .eq("is_archived", false)
      .select("id")
      .single();

    if (error || !data) {
      logger.error({
        message:
          "Failed to update menu item",
        error,
        context: {
          module: "menu",
          action: "updateMenuItem",
          restaurantId: restaurant.id,
          userId: restaurantUser.id,
          metadata: {
            itemId,
          },
        },
      });

      return fail(error);
    }

    const oldPublicId =
      existingItem.image_public_id;

    if (
      oldPublicId &&
      imagePublicId &&
      oldPublicId !== imagePublicId
    ) {
      await safeDeleteCloudinaryImage(
        oldPublicId,
      );
    }

    logger.audit({
      message:
        "Menu item updated",
      context: {
        module: "menu",
        action: "updateMenuItem",
        restaurantId: restaurant.id,
        userId: restaurantUser.id,
        metadata: {
          menuItemId: itemId,
          categoryId,
        },
      },
    });

    return ok(
      undefined,
      "Menu item updated successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while updating menu item",
      error,
      context: {
        module: "menu",
        action: "updateMenuItem",
      },
    });

    return fail(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: Props,
) {
  try {
    const { itemId } = await params;

    const {
      restaurant,
      supabase,
      role,
      restaurantUser,
    } = await requireRestaurantUser();

    if (!canManageMenu(role)) {
      logger.warn({
        message:
          "Unauthorized menu deletion attempt",
        context: {
          module: "menu",
          action: "deleteMenuItem",
          restaurantId: restaurant.id,
          userId: restaurantUser.id,
          metadata: {
            menuItemId: itemId,
          },
        },
      });

      return forbidden();
    }

    const {
      data: existingItem,
      error: existingError,
    } = await supabase
      .from("menu_items")
      .select("id, image_public_id")
      .eq("id", itemId)
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .eq("is_archived", false)
      .single();

    if (existingError) {
      logger.error({
        message:
          "Failed to fetch menu item for deletion",
        error: existingError,
        context: {
          module: "menu",
          action: "deleteMenuItem",
          restaurantId: restaurant.id,
          userId: restaurantUser.id,
          metadata: {
            menuItemId: itemId,
          },
        },
      });

      return fail(existingError);
    }

    if (!existingItem) {
      return notFound(
        "Menu item not found",
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("menu_items")
      .update({
        is_archived: true,
        is_available: false,
        image: null,
        image_public_id: null,
      })
      .eq("id", itemId)
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .eq("is_archived", false)
      .select("id")
      .single();

    if (error || !data) {
      logger.error({
        message:
          "Failed to archive menu item",
        error,
        context: {
          module: "menu",
          action: "deleteMenuItem",
          restaurantId: restaurant.id,
          userId: restaurantUser.id,
          metadata: {
            menuItemId: itemId,
          },
        },
      });

      return fail(error);
    }

    if (
      existingItem.image_public_id
    ) {
      await safeDeleteCloudinaryImage(
        existingItem.image_public_id,
      );
    }

    logger.audit({
      message:
        "Menu item archived",
      context: {
        module: "menu",
        action: "deleteMenuItem",
        restaurantId: restaurant.id,
        userId: restaurantUser.id,
        metadata: {
          menuItemId: itemId,
        },
      },
    });

    return ok(
      undefined,
      "Menu item deleted successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while deleting menu item",
      error,
      context: {
        module: "menu",
        action: "deleteMenuItem",
      },
    });

    return fail(error);
  }
}