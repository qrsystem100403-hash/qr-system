import { notFound } from "next/navigation"
import { resolveRestaurant } from "@/lib/restaurantResolver"
import QRCartClient from "@/modules/qr-ordering/components/QRCartClient"

type Props = {
  params: Promise<{
    table: string
  }>
}

export default async function QRCartPage({ params }: Props) {
  const { table } = await params

  const restaurant = await resolveRestaurant()

  if (!restaurant) {
    notFound()
  }

  const decodedTable = decodeURIComponent(table)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-bg)] px-4 py-5 text-[var(--color-text)] sm:px-6 lg:px-8">
      <QRCartClient table={decodedTable} restaurantId={restaurant.id} />
    </main>
  )
}