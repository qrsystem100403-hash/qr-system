import Link from "next/link"
import type { Order, StatusTabValue } from "./order-types"
import {
  buildOrdersHref,
  formatRelativeTime,
  getItemCount,
  getOrderType,
  shortOrderId,
  statusStyle,
} from "./order-utils"
import OrderStatusAction from "./OrderStatusAction"

type Props = {
  orders: Order[]
  selectedOrderId?: string
  activeStatus: StatusTabValue
  searchQuery: string
}

export default function OrderQueue({
  orders,
  selectedOrderId,
  activeStatus,
  searchQuery,
}: Props) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-3">
        {orders.map((order) => {
          const selected =
            selectedOrderId === order.id

          const statusBorder =
            order.order_status === "pending"
              ? "border-l-[#B42318]"
              : order.order_status ===
                "preparing"
              ? "border-l-[#C2410C]"
              : order.order_status ===
                "ready"
              ? "border-l-[#2F7D57]"
              : "border-l-[#D0D5DD]"

          return (
            <Link
              key={order.id}
              href={buildOrdersHref({
                status: activeStatus,
                selected: order.id,
                q: searchQuery,
              })}
              className={`
                block
                rounded-3xl
                border
                border-l-4
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-lg
                dark:bg-[#171A1F]
                ${statusBorder}
                ${
                  selected
                    ? "border-[#2F7D57] bg-[#F7FAF8] ring-2 ring-[#2F7D57]/15 shadow-lg dark:bg-[#1B231E]"
                    : "border-[#E4DED3] dark:border-[#2A2F35]"
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-mono text-3xl font-semibold text-[#111827] dark:text-[#E7E9EC]">
                      {order.table_name ||
                        "ONLINE"}
                    </h3>

                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase ${statusStyle(
                        order.order_status
                      )}`}
                    >
                      {order.order_status}
                    </span>
                  </div>

                  <p className="mt-1 font-mono text-xs text-[#98A2B3]">
                    #
                    {shortOrderId(
                      order
                    )}
                  </p>

                  {order.customer_name && (
                    <p className="mt-3 text-sm font-medium text-[#475467] dark:text-[#AAB2BD]">
                      {
                        order.customer_name
                      }
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium text-[#98A2B3]">
                    Age
                  </p>

                  <p className="mt-1 font-mono text-lg font-semibold text-[#B42318] dark:text-[#FCA5A5]">
                    {formatRelativeTime(
                      order.created_at
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#667085] dark:text-[#AAB2BD]">
                <span>
                  {
                    getItemCount(
                      order
                    )
                  }{" "}
                  items
                </span>

                <span>•</span>

                <span>
                  {getOrderType(
                    order
                  )}
                </span>

                <span>•</span>

                <span className="font-mono font-semibold text-[#2F7D57] dark:text-[#7BC99A]">
                  ₹{order.total}
                </span>
              </div>

              {order.order_status ===
                "pending" && (
                <div className="mt-5 flex gap-2">
                  <OrderStatusAction
                    orderId={
                      order.id
                    }
                    currentStatus={
                      order.order_status
                    }
                    nextStatus="preparing"
                    label="Accept"
                    variant="green"
                    compact
                  />

                  <OrderStatusAction
                    orderId={
                      order.id
                    }
                    currentStatus={
                      order.order_status
                    }
                    nextStatus="cancelled"
                    label="Cancel"
                    variant="danger"
                    icon="cancel"
                    compact
                  />
                </div>
              )}
            </Link>
          )
        })}

        {!orders.length && (
          <div className="rounded-3xl border border-dashed border-[#E4DED3] bg-white p-12 text-center dark:border-[#2A2F35] dark:bg-[#171A1F]">
            <p className="text-xl font-black text-[#111827] dark:text-[#E7E9EC]">
              No orders found
            </p>

            <p className="mt-2 text-sm text-[#667085] dark:text-[#AAB2BD]">
              New orders will
              appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}