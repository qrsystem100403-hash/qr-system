import { notFound } from "next/navigation"
import QRSuccessClient from "@/modules/qr-ordering/components/QRSuccessClient"
import { resolveRestaurant } from "@/lib/restaurantResolver"

type Props = {
  params: Promise<{
    table: string
  }>
  searchParams: Promise<{
    orderId?: string
  }>
}

export default async function QRSuccessPage({
  params,
  searchParams,
}: Props) {
  const { table } = await params
  const { orderId } = await searchParams

  const restaurant = await resolveRestaurant()

  if (!restaurant) {
    notFound()
  }

  const decodedTable = decodeURIComponent(table)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-4 py-5 text-[var(--color-text)] sm:px-6 lg:px-8">
      <QRSuccessClient
        orderId={orderId}
        table={decodedTable}
        restaurantId={restaurant.id}
      />
    </main>
  )
}