import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getRestaurantBySlug(slug: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}