import { notFound } from "next/navigation"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"
import { supabaseAdmin } from "@/lib/supabase/admin"
import QRCartClient from "@/modules/qr-ordering/components/QRCartClient"

type Props = {
  params: Promise<{
    table: string
  }>
}

export default async function QRCartPage({
  params,
}: Props) {
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
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-4 py-5 text-[var(--color-text)] sm:px-6 lg:px-8">
      <QRCartClient
        table={restaurantTable.name}
        tableToken={
          restaurantTable.qr_token
        }
        restaurantId={
          restaurant.id
        }
      />
    </main>
  )
}