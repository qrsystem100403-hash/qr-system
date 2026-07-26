import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import OperationsRealtime from "./OperationRealtime"
import Link from "next/link"
import OperationsClient from "./OperationsClient"

export default async function OperationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string
  }>
}) {

  const params =
  await searchParams

const activeTab =
  params.tab === "resolved"
    ? "resolved"
    : "pending"

  const { restaurant, supabase } =
    await requireRestaurantUser()

  const { data: requests } = await supabase
  .from("requests")
  .select(`
  id,
  request_type,
  table_name,
  custom_message,
  status,
  created_at,
  resolved_at
`)
  .eq("restaurant_id", restaurant.id)
  .eq(
  "status",
  activeTab === "resolved"
    ? "resolved"
    : "pending"
)


  async function resolveRequest(
  requestId: string
) {
  "use server"

  console.log(
    "RESOLVING REQUEST",
    requestId
  )

  const { restaurant, supabase } =
    await requireRestaurantUser()

  const { data, error } = await supabase
  .from("requests")
  .update({
    status: "resolved",
    resolved_at: new Date().toISOString(),
  })
  .eq("id", requestId)
  .eq("restaurant_id", restaurant.id)
  .select()

console.log("UPDATED ROWS", data)
console.log("UPDATE ERROR", error)
console.log("UPDATE RESTAURANT", restaurant.id)

  console.log(
    "RESOLVE ERROR",
    error
  )
}

function getTimeAgo(
  dateString: string
) {
  const seconds =
    Math.floor(
      (Date.now() -
        new Date(
          dateString
        ).getTime()) /
        1000
    )

  if (seconds < 60)
    return `${seconds}s ago`

  const minutes =
    Math.floor(seconds / 60)

  if (minutes < 60)
    return `${minutes}m ago`

  const hours =
    Math.floor(minutes / 60)

  if (hours < 24)
    return `${hours}h ago`

  const days =
    Math.floor(hours / 24)

  return `${days}d ago`
}

const sortedRequests =
  [...(requests ?? [])].sort(
    (a, b) => {
      if (activeTab === "resolved") {
        return (
          new Date(
            b.resolved_at ?? ""
          ).getTime() -
          new Date(
            a.resolved_at ?? ""
          ).getTime()
        )
      }

      const priority: Record<string, number> = {
  bill: 1,
  other: 2,
  waiter: 3,
  water: 4,
  spoon: 5,
  fork: 6,
  tissue: 7,
}

      return (
        (priority[a.request_type] ??
          999) -
        (priority[b.request_type] ??
          999)
      )
    }
  )

  const billCount =
  requests?.filter(
    (r) => r.request_type === "bill"
  ).length ?? 0

const customCount =
  requests?.filter(
    (r) => r.request_type === "other"
  ).length ?? 0

const serviceCount =
  requests?.filter(
    (r) =>
      r.request_type !== "bill" &&
      r.request_type !== "other"
  ).length ?? 0


  const requestLabels: Record<
  string,
  string
> = {
  bill: "💳 Bill Request",
  waiter: "🙋 Waiter Request",
  water: "💧 Water Request",
  spoon: "🥄 Spoon Request",
  fork: "🍴 Fork Request",
  tissue: "🧻 Tissue Request",
  other: "💬 Custom Request",
}



  return (
  <>
    <OperationsRealtime
      restaurantId={restaurant.id}
    />

    <OperationsClient
      activeTab={activeTab}
      requests={sortedRequests}
      billCount={billCount}
      customCount={customCount}
      serviceCount={serviceCount}
      resolveRequest={resolveRequest}
    />
  </>
);
}