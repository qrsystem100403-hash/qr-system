import { notFound } from "next/navigation"
import QRMyOrdersClient from "@/modules/qr-ordering/components/QRMyOrdersClient"
import { resolvePublicRestaurant } from "@/lib/resolvePublicRestaurant"

type PageProps = {
  params: Promise<{
    table: string
  }>
}

export default async function QRMyOrdersPage({ params }: PageProps) {
  const { table } = await params
  const restaurant = await resolvePublicRestaurant()

  if (!restaurant) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-4xl px-4 py-5">
        <QRMyOrdersClient
          table={decodeURIComponent(table)}
          restaurantPhone={restaurant.phone ?? null}
        />
      </div>
    </main>
  )
}