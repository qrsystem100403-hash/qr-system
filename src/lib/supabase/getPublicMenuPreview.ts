import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getPublicMenuPreview() {
  const supabase = await createSupabaseServerClient()

  const itemsQuery = supabase
    .from("menu_items")
    .select(`
      id,
      name,
      price,
      image,
      description,
      is_available,
      is_archived,
      category,
      category_id,
      tag,
      sort_order,
      menu_categories (
        id,
        name,
        parent_id,
        sort_order,
        is_active
      )
    `)
    .eq("is_archived", false)
    .eq("is_available", true)
    .order("sort_order", { ascending: true })

  const categoriesQuery = supabase
    .from("menu_categories")
    .select("id, name, parent_id, sort_order, is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  const [itemsResult, categoriesResult] = await Promise.all([
    itemsQuery,
    categoriesQuery,
  ])

  return {
    items: itemsResult.data ?? [],
    categories: categoriesResult.data ?? [],
    error: itemsResult.error?.message || categoriesResult.error?.message || null,
  }
}