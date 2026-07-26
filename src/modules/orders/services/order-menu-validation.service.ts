import { MenuRepository } from "@/modules/menu/repositories/menu.repository";

import { ValidationError } from "@/lib/errors/error";

import type {
  MenuItem,
  MenuCategory,
  MenuVariant,
  MenuAddon,
} from "../types/menu.types";

import type {
  CartItem,
  ValidatedCartItem,
} from "../types/order.types";

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function getIndiaCurrentMinutes() {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date())

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0)
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0)

  return hour * 60 + minute
}

function isCategoryAvailable(category: MenuCategory | null | undefined) {
  if (!category?.available_from && !category?.available_until) return true

  const current = getIndiaCurrentMinutes()
  const from = category.available_from ? timeToMinutes(category.available_from) : 0
  const until = category.available_until
    ? timeToMinutes(category.available_until)
    : 24 * 60 - 1

  return current >= from && current <= until
}

function formatTime(time: string | null) {
  if (!time) return ""

  const [hourRaw, minute] = time.split(":")
  const hour = Number(hourRaw)
  const suffix = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12

  return `${displayHour}:${minute} ${suffix}`
}

function getAvailabilityMessage(category: MenuCategory | null | undefined) {
  if (!category?.available_from && !category?.available_until) {
    return "currently unavailable"
  }

  if (category.available_from && !category.available_until) {
    return `available after ${formatTime(category.available_from)}`
  }

  if (!category.available_from && category.available_until) {
    return `available until ${formatTime(category.available_until)}`
  }

  return `available from ${formatTime(category.available_from)} to ${formatTime(
    category.available_until
  )}`
}




export class OrderMenuValidationService {
  constructor(
  private readonly repository =
    new MenuRepository(),
) {}

  async validateCart(
  restaurantId: string,
  cart: CartItem[],
) {

    const cartKeys = cart.map(
  (item) => item.cartKey,
);

const uniqueCartKeys = new Set(cartKeys);

if (uniqueCartKeys.size !== cartKeys.length) {
  throw new ValidationError(
    "Duplicate cart items are not allowed",
  );
}

  const itemIds = Array.from(
    new Set(cart.map((item) => item.id)),
  );

  const variantIds = Array.from(
    new Set(
      cart
        .map((item) => item.variant?.id)
        .filter((id): id is string => Boolean(id)),
    ),
  );

  const addonIds = Array.from(
    new Set(
      cart.flatMap((item) =>
        item.addons.map((addon) => addon.id),
      ),
    ),
  );

  const menuItems =
    await this.repository.getMenuItems(
      restaurantId,
      itemIds,
    );

    if (menuItems.length !== itemIds.length) {
  throw new ValidationError(
    "Some cart items are no longer available",
  );
}
  const categoryIds = Array.from(
    new Set(
      menuItems
        .map((item) => item.category_id)
        .filter(
          (id): id is string => Boolean(id),
        ),
    ),
  );

  const categories =
    await this.repository.getCategories(
      restaurantId,
      categoryIds,
    );

  const variants =
    await this.repository.getVariants(
      restaurantId,
      variantIds,
    );

  const addons =
    await this.repository.getAddons(
      restaurantId,
      addonIds,
    );

  // Create lookup maps
  const menuItemsMap = new Map(
    menuItems.map((item) => [item.id, item]),
  );

  const variantsMap = new Map(
    variants.map((variant) => [
      variant.id,
      variant,
    ]),
  );

  const addonsMap = new Map(
    addons.map((addon) => [
      addon.id,
      addon,
    ]),
  );

  const categoriesMap = new Map(
    categories.map((category) => [
      category.id,
      category,
    ]),
  );

  // Menu availability
  const blockedItem = menuItems.find(
    (item) =>
      !item.is_available ||
      item.is_archived,
  );

  if (blockedItem) {
    throw new ValidationError(
      `${blockedItem.name} is currently unavailable`,
    );
  }

  // Category time availability
  const timeBlockedItem = menuItems.find(
    (item) => {
      const subCategory = item.category_id
        ? categoriesMap.get(item.category_id)
        : null;

      const parentCategory =
        subCategory?.parent_id
          ? categoriesMap.get(
              subCategory.parent_id,
            )
          : null;

      return (
        !isCategoryAvailable(
          subCategory,
        ) ||
        !isCategoryAvailable(
          parentCategory,
        )
      );
    },
  );

  if (timeBlockedItem) {
    const subCategory =
      timeBlockedItem.category_id
        ? categoriesMap.get(
            timeBlockedItem.category_id,
          )
        : null;

    const parentCategory =
      subCategory?.parent_id
        ? categoriesMap.get(
            subCategory.parent_id,
          )
        : null;

    const blockedCategory =
      !isCategoryAvailable(
        parentCategory,
      )
        ? parentCategory
        : subCategory;

    throw new ValidationError(
      `${timeBlockedItem.name} is ${getAvailabilityMessage(
        blockedCategory,
      )}`,
    );

    
  }


 const validatedCart: ValidatedCartItem[] = cart.map((cartItem) => {
  const dbItem = menuItemsMap.get(cartItem.id);

  if (!dbItem) {
    throw new ValidationError("Some cart items are no longer available");
  }

  let unitPrice = dbItem.price;
  let variantId: string | null = null;
  let variantName: string |null = null;

  if (cartItem.variant) {
    const dbVariant = variantsMap.get(cartItem.variant.id);

    if (
      !dbVariant ||
      dbVariant.menu_item_id !== cartItem.id ||
      !dbVariant.is_available
    ) {
      throw new ValidationError(
        `${dbItem.name} option is no longer available`,
      );
    }

    unitPrice = dbVariant.price;
    variantId = dbVariant.id;
    variantName = dbVariant.name;
  }

  const validatedAddons: {
    addonId: string;
    addonName: string;
    addonPrice: number;
  }[] = [];

  for (const cartAddon of cartItem.addons) {
    const dbAddon = addonsMap.get(cartAddon.id);

    if (
      !dbAddon ||
      dbAddon.menu_item_id !== cartItem.id ||
      !dbAddon.is_active ||
      (
        dbAddon.variant_id &&
        dbAddon.variant_id !==
          (cartItem.variant?.id ?? null)
      )
    ) {
      throw new ValidationError(
        `${dbItem.name} add-on is no longer available`,
      );
    }

    unitPrice += dbAddon.price;

    validatedAddons.push({
      addonId: dbAddon.id,
      addonName: dbAddon.name,
      addonPrice: dbAddon.price,
    });
  }

  return {
    cartKey: cartItem.cartKey,
    menuItemId: dbItem.id,
    itemName: dbItem.name,
    variantId,
    variantName,
    unitPrice,
    quantity: cartItem.quantity,
    addons: validatedAddons,
  };
});
  

  return {
  validatedCart,
};
}
}