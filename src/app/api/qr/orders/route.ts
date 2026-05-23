import { NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"

const cartAddonSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number().min(0),
})

const cartVariantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number().positive(),
})

const cartItemSchema = z.object({
  cartKey: z.string().min(1),
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  name: z.string(),
  basePrice: z.number().positive(),
  price: z.number().positive(),
  image: z.string().nullable().optional(),
  quantity: z.number().int().positive(),
  variant: cartVariantSchema.nullable(),
  addons: z.array(cartAddonSchema).max(10),
})

const orderSchema = z.object({
  table: z.string().min(1).max(20),
  cart: z.array(cartItemSchema).min(1).max(50),
  customerNote: z.string().max(300).optional(),
})

type MenuItem = {
  id: string
  name: string
  price: number
  category_id: string | null
  is_available: boolean
  is_archived: boolean
}

type MenuCategory = {
  id: string
  name: string
  parent_id: string | null
  available_from: string | null
  available_until: string | null
}

type MenuVariant = {
  id: string
  menu_item_id: string
  name: string
  price: number
  is_available: boolean
}

type MenuAddon = {
  id: string
  menu_item_id: string
  variant_id: string | null
  name: string
  price: number
  is_active: boolean
}

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
  const until = category.available_until ? timeToMinutes(category.available_until) : 24 * 60 - 1

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

function normalizeTableName(value: string) {
  return decodeURIComponent(value).trim().replace(/\s+/g, "-")
}

export async function POST(request: Request) {
  try {
    const restaurant = await resolvePublicRestaurant()

    const body = await request.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid order data" },
        { status: 400 }
      )
    }

    const { table, cart, customerNote } = parsed.data

    const normalizedTable = normalizeTableName(table)
    const cleanedCustomerNote = customerNote?.trim() || null

    const { data: restaurantTable, error: tableError } = await supabaseAdmin
      .from("restaurant_tables")
      .select("id, name, is_active")
      .eq("restaurant_id", restaurant.id)
      .ilike("name", normalizedTable)
      .single()

    if (tableError || !restaurantTable) {
      return NextResponse.json(
        { success: false, error: "Invalid table" },
        { status: 400 }
      )
    }

    if (!restaurantTable.is_active) {
      return NextResponse.json(
        { success: false, error: "This table is not accepting orders" },
        { status: 400 }
      )
    }

    const cartKeys = cart.map((item) => item.cartKey)
    const uniqueCartKeys = Array.from(new Set(cartKeys))

    if (uniqueCartKeys.length !== cartKeys.length) {
      return NextResponse.json(
        { success: false, error: "Duplicate cart items are not allowed" },
        { status: 400 }
      )
    }

    const itemIds = Array.from(new Set(cart.map((item) => item.id)))

    const { data: menuItemsData, error: menuError } = await supabaseAdmin
      .from("menu_items")
      .select("id, name, price, category_id, is_available, is_archived")
      .eq("restaurant_id", restaurant.id)
      .in("id", itemIds)

    if (menuError) throw new Error(menuError.message)

    const menuItems = (menuItemsData ?? []) as MenuItem[]

    if (menuItems.length !== itemIds.length) {
      return NextResponse.json(
        { success: false, error: "Some cart items are no longer available" },
        { status: 400 }
      )
    }

    const variantIds = cart
      .map((item) => item.variant?.id)
      .filter((id): id is string => Boolean(id))

    let variantsMap = new Map<string, MenuVariant>()

    if (variantIds.length > 0) {
      const { data: variantsData, error: variantsError } = await supabaseAdmin
        .from("menu_item_variants")
        .select("id, menu_item_id, name, price, is_available")
        .eq("restaurant_id", restaurant.id)
        .in("id", variantIds)

      if (variantsError) throw new Error(variantsError.message)

      variantsMap = new Map(
        ((variantsData ?? []) as MenuVariant[]).map((variant) => [
          variant.id,
          variant,
        ])
      )
    }

    const addonIds = Array.from(
      new Set(cart.flatMap((item) => item.addons.map((addon) => addon.id)))
    )

    let addonsMap = new Map<string, MenuAddon>()

    if (addonIds.length > 0) {
      const { data: addonsData, error: addonsError } = await supabaseAdmin
        .from("menu_item_addons")
        .select("id, menu_item_id, variant_id, name, price, is_active")
        .eq("restaurant_id", restaurant.id)
        .in("id", addonIds)

      if (addonsError) throw new Error(addonsError.message)

      addonsMap = new Map(
        ((addonsData ?? []) as MenuAddon[]).map((addon) => [addon.id, addon])
      )
    }

    const categoryIds = Array.from(
      new Set(
        menuItems
          .map((item) => item.category_id)
          .filter((id): id is string => Boolean(id))
      )
    )

    let categoriesMap = new Map<string, MenuCategory>()

    if (categoryIds.length > 0) {
      const { data: directCategoriesData, error: directCategoriesError } =
        await supabaseAdmin
          .from("menu_categories")
          .select("id, name, parent_id, available_from, available_until")
          .eq("restaurant_id", restaurant.id)
          .eq("is_active", true)
          .in("id", categoryIds)

      if (directCategoriesError) throw new Error(directCategoriesError.message)

      const directCategories = (directCategoriesData ?? []) as MenuCategory[]

      const parentIds = Array.from(
        new Set(
          directCategories
            .map((category) => category.parent_id)
            .filter((id): id is string => Boolean(id))
        )
      )

      let parentCategories: MenuCategory[] = []

      if (parentIds.length > 0) {
        const { data: parentCategoriesData, error: parentCategoriesError } =
          await supabaseAdmin
            .from("menu_categories")
            .select("id, name, parent_id, available_from, available_until")
            .eq("restaurant_id", restaurant.id)
            .eq("is_active", true)
            .in("id", parentIds)

        if (parentCategoriesError) throw new Error(parentCategoriesError.message)

        parentCategories = (parentCategoriesData ?? []) as MenuCategory[]
      }

      categoriesMap = new Map(
        [...directCategories, ...parentCategories].map((category) => [
          category.id,
          category,
        ])
      )
    }

    const blockedItem = menuItems.find(
      (item) => !item.is_available || item.is_archived
    )

    if (blockedItem) {
      return NextResponse.json(
        { success: false, error: `${blockedItem.name} is currently unavailable` },
        { status: 400 }
      )
    }

    const timeBlockedItem = menuItems.find((item) => {
      const subCategory = item.category_id
        ? categoriesMap.get(item.category_id)
        : null

      const parentCategory = subCategory?.parent_id
        ? categoriesMap.get(subCategory.parent_id)
        : null

      return !isCategoryAvailable(subCategory) || !isCategoryAvailable(parentCategory)
    })

    if (timeBlockedItem) {
      const subCategory = timeBlockedItem.category_id
        ? categoriesMap.get(timeBlockedItem.category_id)
        : null

      const parentCategory = subCategory?.parent_id
        ? categoriesMap.get(subCategory.parent_id)
        : null

      const blockedCategory = !isCategoryAvailable(parentCategory)
        ? parentCategory
        : subCategory

      return NextResponse.json(
        {
          success: false,
          error: `${timeBlockedItem.name} is ${getAvailabilityMessage(
            blockedCategory
          )}`,
        },
        { status: 400 }
      )
    }

    const validatedCart = cart.map((cartItem) => {
      const dbItem = menuItems.find((item) => item.id === cartItem.id)

      if (!dbItem) throw new Error("Invalid menu item")

      let unitPrice = dbItem.price
      let variantName: string | null = null
      const addonNames: string[] = []

      if (cartItem.variant) {
        const dbVariant = variantsMap.get(cartItem.variant.id)

        if (
          !dbVariant ||
          dbVariant.menu_item_id !== cartItem.id ||
          !dbVariant.is_available
        ) {
          throw new Error(`Invalid variant for ${dbItem.name}`)
        }

        unitPrice = dbVariant.price
        variantName = dbVariant.name
      }

      for (const cartAddon of cartItem.addons) {
        const dbAddon = addonsMap.get(cartAddon.id)

        if (
          !dbAddon ||
          dbAddon.menu_item_id !== cartItem.id ||
          !dbAddon.is_active ||
          (dbAddon.variant_id &&
            dbAddon.variant_id !== (cartItem.variant?.id ?? null))
        ) {
          throw new Error(`Invalid add-on for ${dbItem.name}`)
        }

        unitPrice += dbAddon.price
        addonNames.push(`${dbAddon.name} +₹${dbAddon.price}`)
      }

      const itemNameParts = [dbItem.name]

      if (variantName) itemNameParts.push(`(${variantName})`)
      if (addonNames.length > 0) itemNameParts.push(`[${addonNames.join(", ")}]`)

      return {
        menuItemId: dbItem.id,
        itemName: itemNameParts.join(" "),
        unitPrice,
        quantity: cartItem.quantity,
      }
    })

    const total = validatedCart.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    )

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        restaurant_id: restaurant.id,
        order_type: "dine_in",
        table_name: restaurantTable.name,
        total,
        order_status: "pending",
        payment_status: "pending",
        customer_note: cleanedCustomerNote,
      })
      .select("id")
      .single()

    if (orderError || !order) {
      throw new Error(orderError?.message || "Failed to create order")
    }

    const orderItems = validatedCart.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menuItemId,
      item_name: item.itemName,
      item_price: item.unitPrice,
      qty: item.quantity,
    }))

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems)

    if (itemsError) throw new Error(itemsError.message)

    return NextResponse.json({
      success: true,
      orderId: order.id,
    })
  } catch (error) {
    console.error("QR ORDER ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to place order",
      },
      { status: 500 }
    )
  }
}