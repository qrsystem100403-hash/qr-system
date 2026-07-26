import { can } from "@/lib/auth/can";
import { forbidden } from "next/navigation";

import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

import MobileHistoryView from "./_components/mobile/MobileHistoryView";


import type {
  Order
} from "../_components/order-types"
import HistoryQueue from "./_components/HistoryQueue";
import HistoryRail from "./_components/HistoryRail";
import HistoryInspector from "./_components/HistoryInspector";
import HistoryHeader from "./_components/HistoryHeader";

type HistoryTab =
  | "all"
  | "served"
  | "cancelled"

type Props = {
  searchParams?: Promise<{
    status?: HistoryTab
    selected?: string
    q?: string
  }>
}

function isValidStatus(
  value: unknown
): value is HistoryTab {
  return (
    value === "all" ||
    value === "served" ||
    value === "cancelled"
  )
}

export default async function OrderHistoryPage({
  searchParams,
}: Props) {
  const { restaurant, supabase, role } =
  await requireRestaurantUser();
    if (!can(role, "orders")) {
  forbidden();
}

  const params =
    await searchParams

  const activeStatus: HistoryTab =
    isValidStatus(params?.status)
      ? params.status
      : "all"

  const selectedId =
    params?.selected

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

  subtotal,
  service_charge,
  service_charge_enabled,
  service_charge_type,
  service_charge_value,

  gst_enabled,
  gst_mode,
  gst_percent,
  gst_amount,

  round_off,
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
    data,
    error,
  } = await supabase
    .from("orders")
    .select(baseSelect)
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .in("order_status", [
      "served",
      "cancelled",
    ])
    .order("created_at", {
      ascending: false,
    })

  if (error) {
    return (
      <div className="rounded-3xl border border-[#F3C6C2] bg-[#FDECEC] p-5 text-[#B42318]">
        {error.message}
      </div>
    )
  }

  const allOrders =
    (data ?? []) as Order[]

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

  const completedOrders =
    allOrders.filter(
      (order) =>
        order.order_status ===
        "served"
    )

  const cancelledOrders =
    allOrders.filter(
      (order) =>
        order.order_status ===
        "cancelled"
    )

  const revenue =
    completedOrders.reduce(
      (sum, order) =>
        sum + Number(order.total),
      0
    )

  const counts = {
  all: allOrders.length,
  served: completedOrders.length,
  cancelled: cancelledOrders.length,
};

  return (
    <>
  <HistoryHeader />

  {/* Mobile & Tablet */}

  <div className="lg:hidden">
    <MobileHistoryView
      orders={orders}
      activeStatus={activeStatus}
      searchQuery={searchQuery}
      counts={counts}
    />
  </div>

  {/* Desktop */}

  <section
    className="
      hidden
      lg:grid
      xl:h-[calc(100vh-135px)]
      xl:grid-cols-[320px_minmax(0,1fr)_440px]
      gap-5
    "
  >
    {/* Sidebar */}

    <aside
      className="
        sticky
        top-15
        h-fit
      "
    >
      <HistoryRail
        activeStatus={activeStatus}
        searchQuery={searchQuery}
        completedOrders={completedOrders.length}
        cancelledOrders={cancelledOrders.length}
        revenue={revenue}
      />
    </aside>

    {/* Queue */}

    <main
      className="
        min-w-0
        overflow-hidden
        rounded-[var(--radius-xl)]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        shadow-[var(--shadow-sm)]
      "
    >
      <HistoryQueue
        orders={orders}
        selectedOrderId={selectedOrder?.id}
        activeStatus={activeStatus}
        searchQuery={searchQuery}
      />
    </main>

    {/* Inspector */}

    <aside
      className="
        sticky
        top-24
        h-[calc(100vh-135px)]
      "
    >
      <div
        className="
          h-full
          overflow-hidden
          rounded-[var(--radius-xl)]
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          shadow-[var(--shadow-sm)]
        "
      >
        <HistoryInspector
          order={selectedOrder}
        />
      </div>
    </aside>
  </section>
</>
    
  )
}