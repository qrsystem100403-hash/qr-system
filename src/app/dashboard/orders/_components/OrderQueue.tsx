import Link from "next/link"
import { Clock3, Table2 } from "lucide-react"
import type { Order, StatusTabValue } from "./order-types"
import {
  buildOrdersHref,
  formatOrderTime,
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
    <div className="mt-5 h-[calc(100%-230px)] overflow-y-auto pr-1">
      <div className="space-y-4">
        {orders.map((order) => {
          const selected = selectedOrderId === order.id

          return (
            <Link
              key={order.id}
              href={buildOrdersHref({
                status: activeStatus,
                selected: order.id,
                q: searchQuery,
              })}
              className={`grid grid-cols-1 gap-4 rounded-2xl border bg-white p-5 shadow-sm transition md:grid-cols-[220px_1fr_140px_180px] ${
                selected
                  ? "border-[#22C55E] ring-1 ring-[#22C55E]"
                  : "border-[#E4DED3] hover:border-[#BFE4CE] dark:border-[#2A2F35]"
              } dark:bg-[#171A1F]`}
            >
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-black text-[#111827] dark:text-[#E7E9EC]">
                    #{shortOrderId(order)}
                  </p>

                  <span
                    className={`rounded-lg border px-2 py-1 text-[10px] font-black uppercase ${statusStyle(
                      order.order_status
                    )}`}
                  >
                    {order.order_status}
                  </span>
                </div>

                {order.table_name && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-bold text-[#1F2933] dark:text-[#E7E9EC]">
                    <Table2 className="size-4 text-[#667085]" />
                    {order.table_name}
                  </p>
                )}

                <p className="mt-2 flex items-center gap-2 text-sm text-[#667085] dark:text-[#AAB2BD]">
                  <Clock3 className="size-4" />
                  {formatOrderTime(order.created_at)}
                </p>
              </div>

              <div>
                <p className="font-black text-[#111827] dark:text-[#E7E9EC]">
                  {getItemCount(order)} items
                </p>

                <p className="mt-2 text-sm capitalize text-[#667085] dark:text-[#AAB2BD]">
                  {getOrderType(order)}
                </p>

                {order.customer_name && (
                  <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
                    {order.customer_name}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-[#667085] dark:text-[#AAB2BD]">
                  Payment
                </p>

                <p
                  className={`mt-2 inline-flex rounded-lg px-2 py-1 text-xs font-black capitalize ${
                    order.payment_status === "paid"
                      ? "bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]"
                      : "bg-[#FFF4E5] text-[#C2410C] dark:bg-[#332313] dark:text-[#FDBA74]"
                  }`}
                >
                  {order.payment_status}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2">
  {order.order_status === "pending" ? (
    <>
      <OrderStatusAction
        orderId={order.id}
        currentStatus={order.order_status}
        nextStatus="preparing"
        label="Accept"
        variant="green"
        compact
      />

      <OrderStatusAction
        orderId={order.id}
        currentStatus={order.order_status}
        nextStatus="cancelled"
        label="Cancel"
        variant="danger"
        icon="cancel"
        compact
      />
    </>
  ) : (
    <p className="text-xl font-black text-[#2F7D57] dark:text-[#7BC99A]">
      ₹{order.total}
    </p>
  )}
</div>
            </Link>
          )
        })}

        {!orders.length && (
          <div className="rounded-2xl border border-dashed border-[#E4DED3] bg-white p-10 text-center dark:border-[#2A2F35] dark:bg-[#171A1F]">
            <p className="text-lg font-black text-[#111827] dark:text-[#E7E9EC]">
              No orders found
            </p>
            <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
              New orders will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}