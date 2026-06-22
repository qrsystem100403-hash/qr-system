import { notFound } from "next/navigation"
import QRMyOrdersClient from "@/modules/qr-ordering/components/QRMyOrdersClient"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"
import { supabaseAdmin } from "@/lib/supabase/admin"

type PageProps = {
  params: Promise<{
    table: string
  }>
}

export default async function QRMyOrdersPage({
  params,
}: PageProps) {
  const { table: tableToken } =
    await params

  const restaurant =
    await resolvePublicRestaurant()

  if (!restaurant) {
    notFound()
  }

  const {
    data: restaurantTable,
  } = await supabaseAdmin
    .from("restaurant_tables")
    .select(
      "id,name,qr_token,is_active"
    )
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .eq(
      "qr_token",
      tableToken
    )
    .single()

  if (!restaurantTable) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-4xl px-4 py-5">
        <QRMyOrdersClient
          table={restaurantTable.name}
          tableToken={
            restaurantTable.qr_token
          }
          restaurantPhone={
            restaurant.phone ?? null
          }
        />
      </div>
    </main>
  )
}