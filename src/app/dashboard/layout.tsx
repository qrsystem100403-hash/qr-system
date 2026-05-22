import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRestaurantUser()

  return <>{children}</>
}