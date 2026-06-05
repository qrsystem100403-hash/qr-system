import type { Order, OrderStatus } from "./order-types"

export function formatOrderTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value))
}

export function shortOrderId(order: Order) {
  return order.tracking_token?.slice(0, 6).toUpperCase() ?? order.id.slice(0, 6)
}

export function getItemCount(order: Order) {
  return order.order_items.reduce((sum, item) => sum + item.qty, 0)
}

export function getOrderType(order: Order) {
  if (order.order_type) return order.order_type.replace("_", " ")
  if (order.table_name) return "dine in"
  return "online"
}

export function buildOrdersHref(params: {
  status?: string
  selected?: string
  q?: string
}) {
  const search = new URLSearchParams()

  if (params.status && params.status !== "pending") {
    search.set("status", params.status)
  }

  if (params.selected) search.set("selected", params.selected)
  if (params.q) search.set("q", params.q)

  const query = search.toString()
  return query ? `/dashboard/orders?${query}` : "/dashboard/orders"
}

export function statusStyle(status: OrderStatus) {
  if (status === "pending") {
    return "border-[#F3C6C2] bg-[#FDECEC] text-[#B42318] dark:border-[#5B2A2A] dark:bg-[#2A1A1A] dark:text-[#FCA5A5]"
  }

  if (status === "preparing") {
    return "border-[#FED7AA] bg-[#FFF4E5] text-[#C2410C] dark:border-[#7C2D12] dark:bg-[#332313] dark:text-[#FDBA74]"
  }

  if (status === "ready") {
    return "border-[#BFE4CE] bg-[#E7F3EC] text-[#2F7D57] dark:border-[#24583D] dark:bg-[#183026] dark:text-[#7BC99A]"
  }

  if (status === "served") {
    return "border-[#D8DEE8] bg-[#F1F5F9] text-[#475467] dark:border-[#374151] dark:bg-[#20242A] dark:text-[#CBD5E1]"
  }

  return "border-[#F3C6C2] bg-[#FDECEC] text-[#B42318] dark:border-[#5B2A2A] dark:bg-[#2A1A1A] dark:text-[#FCA5A5]"
}