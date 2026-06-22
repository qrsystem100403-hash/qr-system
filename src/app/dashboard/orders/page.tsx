import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import OrderQueue from "./_components/OrderQueue"
import OrderDetailsPanel from "./_components/OrderDetailsPanel"
import type {
  Order,
  StatusTabValue,
} from "./_components/order-types"
import OrdersRealtime from "./OrdersRealtime"
import StatusRail from "./_components/StatusRail"

type Props = {
  searchParams?: Promise<{
    status?: StatusTabValue
    selected?: string
    q?: string
  }>
}

function isValidStatus(
  value: unknown
): value is StatusTabValue {
  return (
    value === "pending" ||
    value === "preparing" ||
    value === "ready" ||
    value === "served" ||
    value === "cancelled" ||
    value === "all"
  )
}

export default async function OrdersPage({
  searchParams,
}: Props) {
  const { supabase, restaurant } =
    await requireRestaurantUser()

  const params = await searchParams

  const activeStatus: StatusTabValue =
    isValidStatus(params?.status)
      ? params.status
      : "pending"

  const selectedId = params?.selected

  const searchQuery =
    params?.q?.trim() ?? ""

  const baseSelect = `
    id,
    order_type,
    table_name,
    customer_name,
    customer_phone,
    address,
    tracking_token,
    total,
    payment_status,
    order_status,
    customer_note,
    cancel_reason,
    created_at,
    order_items (
      id,
      qty,
      item_price,
      item_name,
      variant_name,
      order_item_addons (
        id,
        addon_name,
        addon_price
      )
    )
  `

  const {
    data: allData,
    error: allError,
  } = await supabase
    .from("orders")
    .select(baseSelect)
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .order("created_at", {
      ascending: false,
    })

  if (allError) {
    return (
      <div className="rounded-2xl border border-[#F3C6C2] bg-[#FDECEC] p-4 text-sm font-semibold text-[#B42318]">
        Failed to load orders:{" "}
        {allError.message}
      </div>
    )
  }

  const allOrders =
    (allData ?? []) as Order[]

  let orders = allOrders

  if (activeStatus !== "all") {
    orders = orders.filter(
      (order) =>
        order.order_status ===
        activeStatus
    )
  }

  if (searchQuery) {
    const q =
      searchQuery.toLowerCase()

    orders = orders.filter(
      (order) =>
        order.tracking_token
          ?.toLowerCase()
          .includes(q) ||
        order.table_name
          ?.toLowerCase()
          .includes(q) ||
        order.customer_name
          ?.toLowerCase()
          .includes(q) ||
        order.customer_phone
          ?.toLowerCase()
          .includes(q)
    )
  }

  const selectedOrder =
    orders.find(
      (order) =>
        order.id === selectedId
    ) ??
    orders[0] ??
    null

  const todayStart = new Date()

  todayStart.setHours(
    0,
    0,
    0,
    0
  )

  const todayOrders =
    allOrders.filter(
      (order) =>
        new Date(
          order.created_at
        ) >= todayStart
    )

  const counts = {
    pending: allOrders.filter(
      (order) =>
        order.order_status ===
        "pending"
    ).length,

    preparing: allOrders.filter(
      (order) =>
        order.order_status ===
        "preparing"
    ).length,

    ready: allOrders.filter(
      (order) =>
        order.order_status ===
        "ready"
    ).length,

    served: allOrders.filter(
      (order) =>
        order.order_status ===
        "served"
    ).length,

    cancelled: allOrders.filter(
      (order) =>
        order.order_status ===
        "cancelled"
    ).length,

    all: allOrders.length,
  }

  const activeOrders =
    counts.pending +
    counts.preparing +
    counts.ready

  const revenue =
    todayOrders
      .filter(
        (order) =>
          order.order_status ===
          "served"
      )
      .reduce(
        (sum, order) =>
          sum +
          Number(order.total),
        0
      )

  return (
    <>
      <OrdersRealtime
        restaurantId={
          restaurant.id
        }
      />

      <section
        className="
          flex
          flex-col
          gap-5

          xl:grid
          xl:min-h-[calc(100vh-118px)]
          xl:grid-cols-[280px_minmax(0,1fr)_360px]
        "
      >
        <div className="xl:sticky xl:top-5 xl:h-fit">
          <StatusRail
            activeStatus={
              activeStatus
            }
            searchQuery={
              searchQuery
            }
            counts={counts}
            workflowMode={
              restaurant.workflow_mode
            }
            activeOrders={
              activeOrders
            }
            newOrders={
              counts.pending
            }
            revenue={revenue}
          />
        </div>

        <div className="min-w-0">
          <OrderQueue
            orders={orders}
            selectedOrderId={
              selectedOrder?.id
            }
            activeStatus={
              activeStatus
            }
            searchQuery={
              searchQuery
            }
          />
        </div>

        <div className="hidden xl:block">
          <OrderDetailsPanel
            order={
              selectedOrder
            }
            workflowMode={
              restaurant.workflow_mode
            }
          />
        </div>
      </section>
    </>
  )
}