import { NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"
import { createNotification } from "@/lib/createNotification"
import { NOTIFICATION_TYPES } from "@/lib/notification-types"
import { cookies } from "next/headers"

const MAX_ITEM_QUANTITY = 20
const MAX_TOTAL_QUANTITY = 100
const MAX_ORDER_TOTAL = 100000

class OrderValidationError extends Error {
  status = 400
}

const cartAddonSchema = z.object({
  id: z.string().uuid(),
})

const cartVariantSchema = z.object({
  id: z.string().uuid(),
})

const cartItemSchema = z.object({
  cartKey: z.string().min(1).max(300),
  id: z.string().uuid(),
  quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY),
  variant: cartVariantSchema.nullable(),
  addons: z.array(cartAddonSchema).max(10),
})

const orderSchema = z.object({
  tableToken: z.string().min(20).max(100),
  cart: z.array(cartItemSchema).min(1).max(50),
  customerNote: z.string().trim().max(300).optional(),
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



function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? "unknown"

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  )
}

async function rollbackOrder(orderId: string) {
  const { data: items } = await supabaseAdmin
    .from("order_items")
    .select("id")
    .eq("order_id", orderId)

  const itemIds = (items ?? []).map((item) => item.id)

  if (itemIds.length > 0) {
    await supabaseAdmin.from("order_item_addons").delete().in("order_item_id", itemIds)
  }

  await supabaseAdmin.from("order_items").delete().eq("order_id", orderId)
  await supabaseAdmin.from("orders").delete().eq("id", orderId)
}

export async function POST(request: Request) {
  let createdOrderId: string | null = null

  try {
    const restaurant = await resolvePublicRestaurant()

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid order data" },
        { status: 400 }
      )
    }

    const {
  tableToken,
  cart,
  customerNote,
} = parsed.data
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)

    if (totalQuantity > MAX_TOTAL_QUANTITY) {
      return NextResponse.json(
        { success: false, error: "Too many items in one order" },
        { status: 400 }
      )
    }

    const cleanedCustomerNote = customerNote || null
    const clientIp = getClientIp(request)

    

    

    const { data: restaurantTable, error: tableError } = await supabaseAdmin
      .from("restaurant_tables")
.select(`
  id,
  name,
  is_active,
  qr_token,
  current_session_token,
  session_expires_at
`)
.eq(
  "restaurant_id",
  restaurant.id
)
.eq(
  "qr_token",
  tableToken
)
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


const sessionToken =
  (await cookies()).get("qr_session")?.value

if (!sessionToken) {
  return NextResponse.json(
    {
      success: false,
      error: "Session expired",
    },
    { status: 403 }
  )
}

if (
  restaurantTable.current_session_token !==
  sessionToken
) {
  return NextResponse.json(
    {
      success: false,
      error: "Session expired",
    },
    { status: 403 }
  )
}

if (
  restaurantTable.session_expires_at &&
  new Date(
    restaurantTable.session_expires_at
  ) < new Date()
) {
  return NextResponse.json(
    {
      success: false,
      error: "Session expired",
    },
    { status: 403 }
  )
}
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

    const { count: recentOrderCount, error: recentOrderError } =
      await supabaseAdmin
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("restaurant_id", restaurant.id)
        .eq(
  "table_id",
  restaurantTable.id
)
        .gte("created_at", fiveMinutesAgo)

    if (recentOrderError) {
      console.error("QR ORDER RATE CHECK ERROR:", recentOrderError)
    }

    if ((recentOrderCount ?? 0) >= 10) {
      return NextResponse.json(
        { success: false, error: "Too many orders from this table. Try again shortly." },
        { status: 429 }
      )
    }

    console.info("QR ORDER ATTEMPT:", {
      restaurantId: restaurant.id,
      table: restaurantTable.name,
      clientIp,
    })

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

    if (menuError) {
      console.error("QR ORDER MENU FETCH ERROR:", menuError)
      throw new Error("Menu validation failed")
    }

    const menuItems = (menuItemsData ?? []) as MenuItem[]

    if (menuItems.length !== itemIds.length) {
      return NextResponse.json(
        { success: false, error: "Some cart items are no longer available" },
        { status: 400 }
      )
    }

    const variantIds = Array.from(
      new Set(
        cart
          .map((item) => item.variant?.id)
          .filter((id): id is string => Boolean(id))
      )
    )

    let variantsMap = new Map<string, MenuVariant>()

    if (variantIds.length > 0) {
      const { data: variantsData, error: variantsError } = await supabaseAdmin
        .from("menu_item_variants")
        .select("id, menu_item_id, name, price, is_available")
        .eq("restaurant_id", restaurant.id)
        .in("id", variantIds)

      if (variantsError) {
        console.error("QR ORDER VARIANT FETCH ERROR:", variantsError)
        throw new Error("Variant validation failed")
      }

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

      if (addonsError) {
        console.error("QR ORDER ADDON FETCH ERROR:", addonsError)
        throw new Error("Add-on validation failed")
      }

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

      if (directCategoriesError) {
        console.error("QR ORDER CATEGORY FETCH ERROR:", directCategoriesError)
        throw new Error("Category validation failed")
      }

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

        if (parentCategoriesError) {
          console.error("QR ORDER PARENT CATEGORY FETCH ERROR:", parentCategoriesError)
          throw new Error("Category validation failed")
        }

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

      return (
        !isCategoryAvailable(subCategory) ||
        !isCategoryAvailable(parentCategory)
      )
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
          error: `${timeBlockedItem.name} is ${getAvailabilityMessage(blockedCategory)}`,
        },
        { status: 400 }
      )
    }

    const validatedCart = cart.map((cartItem) => {
      const dbItem = menuItems.find((item) => item.id === cartItem.id)

      if (!dbItem) {
        throw new OrderValidationError("Some cart items are no longer available")
      }

      let unitPrice = dbItem.price
      let variantId: string | null = null
      let variantName: string | null = null

      if (cartItem.variant) {
        const dbVariant = variantsMap.get(cartItem.variant.id)

        if (
          !dbVariant ||
          dbVariant.menu_item_id !== cartItem.id ||
          !dbVariant.is_available
        ) {
          throw new OrderValidationError(`${dbItem.name} option is no longer available`)
        }

        unitPrice = dbVariant.price
        variantId = dbVariant.id
        variantName = dbVariant.name
      }

      const addons: {
        addonId: string
        addonName: string
        addonPrice: number
      }[] = []

      for (const cartAddon of cartItem.addons) {
        const dbAddon = addonsMap.get(cartAddon.id)

        if (
          !dbAddon ||
          dbAddon.menu_item_id !== cartItem.id ||
          !dbAddon.is_active ||
          (dbAddon.variant_id && dbAddon.variant_id !== (cartItem.variant?.id ?? null))
        ) {
          throw new OrderValidationError(`${dbItem.name} add-on is no longer available`)
        }

        unitPrice += dbAddon.price

        addons.push({
          addonId: dbAddon.id,
          addonName: dbAddon.name,
          addonPrice: dbAddon.price,
        })
      }

      return {
        cartKey: cartItem.cartKey,
        menuItemId: dbItem.id,
        itemName: dbItem.name,
        variantId,
        variantName,
        unitPrice,
        quantity: cartItem.quantity,
        addons,
      }
    })

    const total = validatedCart.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    )

    if (total <= 0 || total > MAX_ORDER_TOTAL) {
      return NextResponse.json(
        { success: false, error: "Invalid order total" },
        { status: 400 }
      )
    }

    const { data: order, error: orderError } = await supabaseAdmin
  .from("orders")
  .insert({
    restaurant_id: restaurant.id,
    table_id: restaurantTable.id,
    order_type: "dine_in",
    table_name: restaurantTable.name,
    total,
    order_status: "pending",
    payment_status: "pending",
    customer_note: cleanedCustomerNote,
  })
      .select("id, tracking_token")
      .single()

    if (orderError || !order) {
      console.error("QR ORDER INSERT ERROR:", orderError)
      throw new Error("Failed to create order")
    }

    createdOrderId = order.id

    await createNotification({
  restaurantId: restaurant.id,

  type:
    NOTIFICATION_TYPES.NEW_ORDER,

  title: "New Order",

  message: `${restaurantTable.name} placed an order worth ₹${total}`,

  entityType: "order",

  entityId: order.id,
})

    const orderItems = validatedCart.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menuItemId,
      variant_id: item.variantId,
      variant_name: item.variantName,
      item_name: item.itemName,
      item_price: item.unitPrice,
      qty: item.quantity,
    }))

    const { data: insertedItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems)
      .select("id, menu_item_id, variant_id, item_name")

    if (itemsError || !insertedItems) {
      console.error("QR ORDER ITEMS INSERT ERROR:", itemsError)
      await rollbackOrder(order.id)

      return NextResponse.json(
        { success: false, error: "Failed to place order" },
        { status: 500 }
      )
    }

    const addonRows = validatedCart.flatMap((cartItem, index) => {
      const insertedItem = insertedItems[index]

      if (!insertedItem) return []

      return cartItem.addons.map((addon) => ({
        order_item_id: insertedItem.id,
        addon_id: addon.addonId,
        addon_name: addon.addonName,
        addon_price: addon.addonPrice,
      }))
    })

    if (addonRows.length > 0) {
  const { error: addonsInsertError } = await supabaseAdmin
    .from("order_item_addons")
    .insert(addonRows)

  if (addonsInsertError) {
    console.error("QR ORDER ITEM ADDONS INSERT ERROR:", addonsInsertError)
    await rollbackOrder(order.id)

    return NextResponse.json(
      { success: false, error: "Failed to place order" },
      { status: 500 }
    )
  }
}

if (
  restaurant.table_workflow_mode !==
  "expert"
) {
  await supabaseAdmin
    .from("restaurant_tables")
    .update({
      status: "occupied",

      last_activity_at:
        new Date().toISOString(),

      session_expires_at:
        new Date(
          Date.now() +
            90 * 60 * 1000
        ).toISOString(),
    })
    .eq(
      "id",
      restaurantTable.id
    )
}

createdOrderId = null

return NextResponse.json({
  success: true,
  orderId: order.id,
  trackingToken:
    order.tracking_token,
})
  } catch (error) {
    console.error("QR ORDER ERROR:", error)

    if (createdOrderId) {
      await rollbackOrder(createdOrderId)
    }

    if (error instanceof OrderValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to place order" },
      { status: 500 }
    )
  }
}