import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import PrintQRCodesClient from "./PrintQRCodesClient"

type RestaurantTable = {
  id: string
  name: string
  is_active: boolean
}

export default async function PrintTablesPage() {
  const { restaurant, supabase } = await requireRestaurantUser()

  const { data: tables, error } = await supabase
    .from("restaurant_tables")
    .select("id, name, is_active")
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("PRINT TABLES LOAD ERROR:", error)

    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 text-black">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-2xl font-bold text-red-700">
            Failed to load QR codes
          </h1>

          <p className="mt-2 text-sm text-red-600">
            Please refresh the page or try again.
          </p>
        </div>
      </main>
    )
  }

  return (
    <PrintQRCodesClient
      restaurantName={restaurant.name}
      tables={(tables ?? []) as RestaurantTable[]}
    />
  )
}