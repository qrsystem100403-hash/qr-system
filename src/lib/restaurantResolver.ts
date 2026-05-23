import { headers } from "next/headers"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function resolveRestaurant() {
  const headersList = await headers()
  const host = headersList.get("host")

  let domain = host?.split(":")[0]

  if (domain === "localhost" || domain === "127.0.0.1") {
    domain = "localhost"
  }

  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("restaurants")
    .select("id, name, slug, logo, primary_color, domain")
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