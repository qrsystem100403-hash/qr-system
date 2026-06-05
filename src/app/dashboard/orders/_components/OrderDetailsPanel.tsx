import {
  Clock3,
  MapPin,
  PackageCheck,
  Phone,
  Table2,
  User,
  ChefHat,
ShieldCheck,
CheckCircle2,
} from "lucide-react"
import type { Order } from "./order-types"
import {
  formatOrderTime,
  getOrderType,
  shortOrderId,
  statusStyle,
} from "./order-utils"
import OrderStatusAction from "./OrderStatusAction"

type Props = {
  order: Order | null
}

export default function OrderDetailsPanel({ order }: Props) {
  if (!order) {
    return (
      <aside className="hidden min-h-0 overflow-hidden rounded-2xl border border-[#E4DED3] bg-white shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F] xl:flex xl:flex-col">
        <div className="grid h-full place-items-center p-8 text-center">
          <div>
            <PackageCheck className="mx-auto size-10 text-[#98A2B3]" />
            <p className="mt-3 font-black text-[#111827] dark:text-[#E7E9EC]">
              Select an order
            </p>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="hidden min-h-0 overflow-hidden rounded-2xl border border-[#E4DED3] bg-white shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F] xl:flex xl:flex-col">
      <div className="border-b border-[#E4DED3] p-5 dark:border-[#2A2F35]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#111827] dark:text-[#E7E9EC]">
              Order #{shortOrderId(order)}
            </h2>
            <p className="mt-2 text-sm capitalize text-[#667085] dark:text-[#AAB2BD]">
              {getOrderType(order)}
            </p>
          </div>

          <span
            className={`rounded-lg border px-3 py-1 text-[10px] font-black uppercase ${statusStyle(
              order.order_status
            )}`}
          >
            {order.order_status}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          {order.table_name && (
            <p className="flex items-center gap-2 text-[#667085] dark:text-[#AAB2BD]">
              <Table2 className="size-4" />
              {order.table_name}
            </p>
          )}

          <p className="flex items-center gap-2 text-[#667085] dark:text-[#AAB2BD]">
            <Clock3 className="size-4" />
            {formatOrderTime(order.created_at)}
          </p>

          {order.customer_name && (
            <p className="flex items-center gap-2 text-[#667085] dark:text-[#AAB2BD]">
              <User className="size-4" />
              {order.customer_name}
            </p>
          )}

          {order.customer_phone && (
            <p className="flex items-center gap-2 text-[#667085] dark:text-[#AAB2BD]">
              <Phone className="size-4" />
              {order.customer_phone}
            </p>
          )}
        </div>

        {order.address && (
          <p className="mt-3 flex gap-2 rounded-xl bg-[#FCFAF6] p-3 text-sm text-[#667085] dark:bg-[#20242A] dark:text-[#AAB2BD]">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {order.address}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <p className="mb-4 font-black text-[#111827] dark:text-[#E7E9EC]">
          Items
        </p>

        <div className="space-y-4">
          {order.order_items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[34px_1fr_auto] gap-3"
            >
              <div className="grid size-8 place-items-center rounded-lg border border-[#E4DED3] text-sm font-black dark:border-[#2A2F35]">
                {item.qty}
              </div>

              <div>
                <p className="font-black text-[#111827] dark:text-[#E7E9EC]">
                  {item.item_name ?? "Unknown item"}
                </p>

                {item.variant_name && (
                  <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
                    {item.variant_name}
                  </p>
                )}

                {item.order_item_addons.map((addon) => (
                  <p
                    key={addon.id}
                    className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]"
                  >
                    + {addon.addon_name}
                  </p>
                ))}
              </div>

              <p className="font-black text-[#111827] dark:text-[#E7E9EC]">
                ₹{item.item_price * item.qty}
              </p>
            </div>
          ))}
        </div>

        <div className="my-5 border-t border-[#E4DED3] dark:border-[#2A2F35]" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-[#667085] dark:text-[#AAB2BD]">
            <span>Subtotal</span>
            <span>₹{order.total}</span>
          </div>

          <div className="flex justify-between text-xl font-black text-[#111827] dark:text-[#E7E9EC]">
            <span>Total</span>
            <span className="text-[#2F7D57] dark:text-[#7BC99A]">
              ₹{order.total}
            </span>
          </div>
        </div>

        {order.customer_note && (
          <div className="mt-5 rounded-2xl bg-[#FCFAF6] p-4 dark:bg-[#20242A]">
            <p className="font-black text-[#111827] dark:text-[#E7E9EC]">
              Customer Note
            </p>
            <p className="mt-2 text-sm text-[#667085] dark:text-[#AAB2BD]">
              {order.customer_note}
            </p>
          </div>
        )}

        {order.cancel_reason && (
          <div className="mt-5 rounded-2xl bg-[#FDECEC] p-4 text-[#B42318] dark:bg-[#2A1A1A] dark:text-[#FCA5A5]">
            <p className="font-black">Cancel Reason</p>
            <p className="mt-2 text-sm">{order.cancel_reason}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-[#E4DED3] p-5 dark:border-[#2A2F35]">
  <OrderStatusAction
    orderId={order.id}
    currentStatus={order.order_status}
    nextStatus="preparing"
    label="Start Preparing"
    variant="orange"
    icon="chef"
  />

  <OrderStatusAction
    orderId={order.id}
    currentStatus={order.order_status}
    nextStatus="ready"
    label="Mark Ready"
    variant="green"
    icon="ready"
  />

  <OrderStatusAction
    orderId={order.id}
    currentStatus={order.order_status}
    nextStatus="served"
    label="Complete"
    variant="outline"
    icon="complete"
  />
</div>
    </aside>
  )
}