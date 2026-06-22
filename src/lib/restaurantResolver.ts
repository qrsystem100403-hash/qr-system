import { headers } from "next/headers"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function resolveRestaurant() {
  const headersList = await headers()
  const host =
  headersList.get("x-forwarded-host") ||
  headersList.get("host") ||
  ""

let domain = host
  .split(":")[0]
  .trim()
  .toLowerCase()

  if (domain === "localhost" || domain === "127.0.0.1") {
    domain = "localhost"
  }

  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("restaurants")
    .select(`
  id,
  name,
  slug,
  logo,
  primary_color,
  domain,
  workflow_mode,
  table_workflow_mode
`)
    .eq("domain", domain)
    .single()

  if (error || !data) {
    console.error("RESTAURANT RESOLVE FAILED:", {
      host,
      domain,
      error,
    })

    throw new Error("Restaurant not found")
  }

  return data
}