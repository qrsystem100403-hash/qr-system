import Link from "next/link"
import {
  Banknote,
  CheckCircle2,
  XCircle,
  ReceiptText,
} from "lucide-react"

import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

import OrderQueue from "../_components/OrderQueue"
import OrderDetailsPanel from "../_components/OrderDetailsPanel"

import type {
  Order,
  StatusTabValue,
} from "../_components/order-types"

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
  const { restaurant, supabase } =
    await requireRestaurantUser()

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

  return (
    <section
      className="
        grid
        gap-5
        min-h-[calc(100vh-118px)]
        xl:grid-cols-[320px_minmax(520px,1fr)_340px]
      "
    >
      {/* LEFT SIDEBAR */}

      <aside className="hidden xl:flex xl:flex-col">
        <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 dark:border-[#2A2F35] dark:bg-[#171A1F]">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
              History
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#111827] dark:text-[#E7E9EC]">
              Orders
            </h1>

            <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
              Completed & cancelled orders
            </p>
          </div>

          <div className="mt-6 space-y-3">

            <div className="rounded-2xl bg-[#F7F8FA] p-4 dark:bg-[#20242A]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#667085]">
                    Completed
                  </p>

                  <p className="mt-1 font-mono text-2xl font-bold">
                    {completedOrders.length}
                  </p>
                </div>

                <CheckCircle2 className="size-5 text-[#2F7D57]" />
              </div>
            </div>

            <div className="rounded-2xl bg-[#F7F8FA] p-4 dark:bg-[#20242A]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#667085]">
                    Cancelled
                  </p>

                  <p className="mt-1 font-mono text-2xl font-bold">
                    {cancelledOrders.length}
                  </p>
                </div>

                <XCircle className="size-5 text-[#B42318]" />
              </div>
            </div>

            <div className="rounded-2xl bg-[#F7F8FA] p-4 dark:bg-[#20242A]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#667085]">
                    Revenue
                  </p>

                  <p className="mt-1 font-mono text-2xl font-bold">
                    ₹{revenue}
                  </p>
                </div>

                <Banknote className="size-5 text-[#2F7D57]" />
              </div>
            </div>

          </div>

          <div className="my-6 h-px bg-[#E4DED3] dark:bg-[#2A2F35]" />

          <div className="space-y-2">

            <Link
              href="/dashboard/orders/history"
              className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all ${
                activeStatus === "all"
                  ? "bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]"
                  : "hover:bg-[#F7F8FA] dark:hover:bg-[#20242A]"
              }`}
            >
              <span className="font-medium">
                All Orders
              </span>

              <span className="font-mono">
                {allOrders.length}
              </span>
            </Link>

            <Link
              href="/dashboard/orders/history?status=served"
              className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all ${
                activeStatus ===
                "served"
                  ? "bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]"
                  : "hover:bg-[#F7F8FA] dark:hover:bg-[#20242A]"
              }`}
            >
              <span className="font-medium">
                Completed
              </span>

              <span className="font-mono">
                {completedOrders.length}
              </span>
            </Link>

            <Link
              href="/dashboard/orders/history?status=cancelled"
              className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all ${
                activeStatus ===
                "cancelled"
                  ? "bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]"
                  : "hover:bg-[#F7F8FA] dark:hover:bg-[#20242A]"
              }`}
            >
              <span className="font-medium">
                Cancelled
              </span>

              <span className="font-mono">
                {cancelledOrders.length}
              </span>
            </Link>

          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}

      <div className="xl:hidden">
        <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 dark:border-[#2A2F35] dark:bg-[#171A1F]">

          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]">
              <ReceiptText className="size-5" />
            </div>

            <div>
              <h1 className="text-xl font-black">
                Order History
              </h1>

              <p className="text-sm text-[#667085]">
                Completed & cancelled
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto">

            <Link
              href="/dashboard/orders/history"
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold ${
                activeStatus === "all"
                  ? "bg-[#2F7D57] text-white"
                  : "border border-[#E4DED3]"
              }`}
            >
              All
            </Link>

            <Link
              href="/dashboard/orders/history?status=served"
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold ${
                activeStatus ===
                "served"
                  ? "bg-[#2F7D57] text-white"
                  : "border border-[#E4DED3]"
              }`}
            >
              Completed
            </Link>

            <Link
              href="/dashboard/orders/history?status=cancelled"
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold ${
                activeStatus ===
                "cancelled"
                  ? "bg-[#2F7D57] text-white"
                  : "border border-[#E4DED3]"
              }`}
            >
              Cancelled
            </Link>

          </div>
        </div>
      </div>

      {/* ORDER LIST */}

      <div className="min-w-0">
        <OrderQueue
          orders={orders}
          selectedOrderId={
            selectedOrder?.id
          }
          activeStatus="all"
          searchQuery={
            searchQuery
          }
        />
      </div>

      {/* DETAILS */}

      <OrderDetailsPanel
        order={selectedOrder}
        workflowMode={
          restaurant.workflow_mode
        }
      />
    </section>
  )
}