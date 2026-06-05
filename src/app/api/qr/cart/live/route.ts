// src/app/api/qr/cart/live/route.ts

import { NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"

const schema = z.object({
  itemIds: z.array(z.string().uuid()).min(1).max(100),
})

type MenuAddon = {
  id: string
  name: string
  price: number
  sort_order: number
  is_active: boolean
}

type MenuVariant = {
  id: string
  name: string
  price: number
  sort_order: number
  is_available: boolean
  menu_item_addons?: MenuAddon[] | null
}

type LiveMenuItem = {
  id: string
  restaurant_id: string
  name: string
  price: number
  image: string | null
  is_available: boolean
  is_archived: boolean
  category_id: string | null
  menu_item_variants?: MenuVariant[] | null
}

type Category = {
  id: string
  name: string
  available_from: string | null
  available_until: string | null
  parent_id: string | null
}

export async function POST(request: Request) {
  try {
    const restaurant = await resolvePublicRestaurant()

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid cart data" },
        { status: 400 }
      )
    }

    const itemIds = Array.from(new Set(parsed.data.itemIds))

    const { data: items, error: itemsError } = await supabaseAdmin
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
      .eq("restaurant_id", restaurant.id)
      .in("id", itemIds)

    if (itemsError) {
      console.error("QR CART LIVE ITEMS ERROR:", itemsError)

      return NextResponse.json(
        { success: false, error: "Failed to load cart items" },
        { status: 500 }
      )
    }

    const liveItems = (items ?? []) as LiveMenuItem[]

    const categoryIds = Array.from(
      new Set(
        liveItems
          .map((item) => item.category_id)
          .filter((id): id is string => Boolean(id))
      )
    )

    let categories: Category[] = []

    if (categoryIds.length > 0) {
      const { data: directCategories, error: directCategoryError } =
        await supabaseAdmin
          .from("menu_categories")
          .select("id, name, available_from, available_until, parent_id")
          .eq("restaurant_id", restaurant.id)
          .in("id", categoryIds)

      if (directCategoryError) {
        console.error("QR CART DIRECT CATEGORY ERROR:", directCategoryError)

        return NextResponse.json(
          { success: false, error: "Failed to load cart categories" },
          { status: 500 }
        )
      }

      const direct = (directCategories ?? []) as Category[]

      const parentIds = Array.from(
        new Set(
          direct
            .map((category) => category.parent_id)
            .filter((id): id is string => Boolean(id))
        )
      )

      let parents: Category[] = []

      if (parentIds.length > 0) {
        const { data: parentCategories, error: parentCategoryError } =
          await supabaseAdmin
            .from("menu_categories")
            .select("id, name, available_from, available_until, parent_id")
            .eq("restaurant_id", restaurant.id)
            .in("id", parentIds)

        if (parentCategoryError) {
          console.error("QR CART PARENT CATEGORY ERROR:", parentCategoryError)

          return NextResponse.json(
            { success: false, error: "Failed to load cart categories" },
            { status: 500 }
          )
        }

        parents = (parentCategories ?? []) as Category[]
      }

      categories = [...direct, ...parents]
    }

    return NextResponse.json({
      success: true,
      data: {
        items: liveItems,
        categories,
      },
    })
  } catch (error) {
    console.error("QR CART LIVE ERROR:", error)

    return NextResponse.json(
      { success: false, error: "Failed to load live cart data" },
      { status: 500 }
    )
  }
}