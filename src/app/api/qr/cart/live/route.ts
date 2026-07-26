import { z } from "zod";

import {
  badRequest,
  fail,
  notFound,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { resolvePublicRestaurant } from "@/modules/core/restaurants/utils/resolvePublicRestaurant";
import { supabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  itemIds: z.array(z.string().uuid()).min(1).max(100),
});

type MenuAddon = {
  id: string;
  name: string;
  price: number;
  sort_order: number;
  is_active: boolean;
};

type MenuVariant = {
  id: string;
  name: string;
  price: number;
  sort_order: number;
  is_available: boolean;
  menu_item_addons?: MenuAddon[] | null;
};

type LiveMenuItem = {
  id: string;
  restaurant_id: string;
  name: string;
  price: number;
  image: string | null;
  is_available: boolean;
  is_archived: boolean;
  category_id: string | null;
  menu_item_variants?: MenuVariant[] | null;
};

type Category = {
  id: string;
  name: string;
  available_from: string | null;
  available_until: string | null;
  parent_id: string | null;
};

export async function POST(request: Request) {
  try {
    const resolved =
  await resolvePublicRestaurant();

if (!resolved) {
  logger.warn({
    message:
      "Live cart requested for unknown restaurant",
    context: {
      module: "public-cart",
      action: "liveCart",
    },
  });

  return notFound(
    "Restaurant not found",
  );
}

const { restaurant, features } = resolved;

    const body =
      await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid live cart payload",
        context: {
          module: "public-cart",
          action: "liveCart",
          restaurantId: restaurant.id,
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid cart data",
        parsed.error.flatten(),
      );
    }

    const itemIds = Array.from(
      new Set(parsed.data.itemIds),
    );

    const {
      data: items,
      error: itemsError,
    } = await supabaseAdmin
      .from("menu_items")
      .select(`
        id,
        restaurant_id,
        name,
        price,
        image,
        is_available,
        is_archived,
        category_id,
        menu_item_variants (
          id,
          name,
          price,
          sort_order,
          is_available,
          menu_item_addons (
            id,
            name,
            price,
            sort_order,
            is_active
          )
        )
      `)
      .eq(
        "restaurant_id",
        restaurant.id,
      )
      .in("id", itemIds);

    if (itemsError) {
      logger.error({
        message:
          "Failed to load cart menu items",
        error: itemsError,
        context: {
          module: "public-cart",
          action: "liveCart",
          restaurantId: restaurant.id,
        },
      });

      return fail(itemsError);
    }

    const liveItems =
      (items ?? []) as LiveMenuItem[];

    const categoryIds = Array.from(
      new Set(
        liveItems
          .map(
            (item) =>
              item.category_id,
          )
          .filter(
            (
              id,
            ): id is string =>
              Boolean(id),
          ),
      ),
    );

    let categories: Category[] = [];

    if (categoryIds.length > 0) {
      const {
        data: directCategories,
        error:
          directCategoryError,
      } = await supabaseAdmin
        .from("menu_categories")
        .select(
          "id, name, available_from, available_until, parent_id",
        )
        .eq(
          "restaurant_id",
          restaurant.id,
        )
        .in("id", categoryIds);

      if (directCategoryError) {
        logger.error({
          message:
            "Failed to load direct categories",
          error:
            directCategoryError,
          context: {
            module:
              "public-cart",
            action:
              "liveCart",
            restaurantId:
              restaurant.id,
          },
        });

        return fail(
          directCategoryError,
        );
      }

      const direct =
        (directCategories ??
          []) as Category[];

      const parentIds =
        Array.from(
          new Set(
            direct
              .map(
                (
                  category,
                ) =>
                  category.parent_id,
              )
              .filter(
                (
                  id,
                ): id is string =>
                  Boolean(id),
              ),
          ),
        );

      let parents: Category[] =
        [];

      if (
        parentIds.length > 0
      ) {
        const {
          data: parentCategories,
          error:
            parentCategoryError,
        } =
          await supabaseAdmin
            .from(
              "menu_categories",
            )
            .select(
              "id, name, available_from, available_until, parent_id",
            )
            .eq(
              "restaurant_id",
              restaurant.id,
            )
            .in(
              "id",
              parentIds,
            );

        if (
          parentCategoryError
        ) {
          logger.error({
            message:
              "Failed to load parent categories",
            error:
              parentCategoryError,
            context: {
              module:
                "public-cart",
              action:
                "liveCart",
              restaurantId:
                restaurant.id,
            },
          });

          return fail(
            parentCategoryError,
          );
        }

        parents =
          (parentCategories ??
            []) as Category[];
      }

      categories = [
        ...direct,
        ...parents,
      ];
    }

    logger.info({
      message:
        "Live cart synchronized",
      context: {
        module: "public-cart",
        action: "liveCart",
        restaurantId:
          restaurant.id,
        metadata: {
          itemCount:
            liveItems.length,
        },
      },
    });

    return ok({
      items: liveItems,
      categories,
    });
  } catch (error) {
    logger.error({
      message:
        "Unexpected live cart error",
      error,
      context: {
        module: "public-cart",
        action: "liveCart",
      },
    });

    return fail(error);
  }
}