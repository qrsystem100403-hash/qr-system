import {
  Clock3,
  MapPin,
  PackageCheck,
  Phone,
  User,
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
  workflowMode: string
}

export default function OrderDetailsPanel({
  order,
  workflowMode,
}: Props) {
  if (!order) {
    return (
      <aside className="hidden xl:flex xl:flex-col rounded-3xl border border-[#E4DED3] bg-white dark:border-[#2A2F35] dark:bg-[#171A1F]">
        <div className="flex h-full items-center justify-center p-10 text-center">
          <div>
            <PackageCheck className="mx-auto size-12 text-[#98A2B3]" />

            <h3 className="mt-4 text-xl font-bold text-[#111827] dark:text-[#E7E9EC]">
              Select an Order
            </h3>

            <p className="mt-2 text-sm text-[#667085] dark:text-[#AAB2BD]">
              Choose an order from the queue
            </p>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="hidden xl:flex xl:flex-col overflow-hidden rounded-3xl border border-[#E4DED3] bg-white dark:border-[#2A2F35] dark:bg-[#171A1F]">
      {/* HEADER */}
      <div className="border-b border-[#E4DED3] p-6 dark:border-[#2A2F35]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-mono text-4xl font-semibold text-[#111827] dark:text-[#E7E9EC]">
              {order.table_name || "ONLINE"}
            </h2>

            <p className="mt-2 font-mono text-sm text-[#98A2B3]">
              #{shortOrderId(order)}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#667085] dark:text-[#AAB2BD]">
              <span>{getOrderType(order)}</span>

              <span>•</span>

              <span>
                {formatOrderTime(
                  order.created_at
                )}
              </span>
            </div>
          </div>

          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusStyle(
              order.order_status
            )}`}
          >
            {order.order_status}
          </span>
        </div>

        {/* CUSTOMER CARD */}
        {(order.customer_name ||
          order.customer_phone ||
          order.address) && (
          <div className="mt-6 rounded-2xl bg-[#F7F8FA] p-4 dark:bg-[#20242A]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
              Customer
            </p>

            <div className="space-y-3">
              {order.customer_name && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="size-4 text-[#98A2B3]" />
                  <span>
                    {order.customer_name}
                  </span>
                </div>
              )}

              {order.customer_phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="size-4 text-[#98A2B3]" />
                  <span>
                    {order.customer_phone}
                  </span>
                </div>
              )}

              {order.address && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#98A2B3]" />
                  <span>
                    {order.address}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <Clock3 className="size-4 text-[#98A2B3]" />
                <span>
                  {formatOrderTime(
                    order.created_at
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-6">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
          Order Items
        </p>

        <div className="space-y-4">
          {order.order_items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#EEF0F3] p-4 dark:border-[#2A2F35]"
            >
              <div className="flex gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#F7F8FA] font-bold dark:bg-[#20242A]">
                  {item.qty}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-[#111827] dark:text-[#E7E9EC]">
                      {item.item_name ??
                        "Unknown Item"}
                    </p>

                    <p className="shrink-0 font-semibold">
                      ₹
                      {item.item_price *
                        item.qty}
                    </p>
                  </div>

                  {item.variant_name && (
                    <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
                      {item.variant_name}
                    </p>
                  )}

                  {item.order_item_addons.map(
                    (addon) => (
                      <p
                        key={addon.id}
                        className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]"
                      >
                        +{" "}
                        {
                          addon.addon_name
                        }
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NOTE */}
        {order.customer_note && (
          <div className="mt-6 rounded-2xl bg-[#FCFAF6] p-4 dark:bg-[#20242A]">
            <p className="font-semibold text-[#111827] dark:text-[#E7E9EC]">
              Customer Note
            </p>

            <p className="mt-2 text-sm text-[#667085] dark:text-[#AAB2BD]">
              {order.customer_note}
            </p>
          </div>
        )}

        {/* CANCEL REASON */}
        {order.cancel_reason && (
          <div className="mt-6 rounded-2xl bg-[#FDECEC] p-4 dark:bg-[#2A1A1A]">
            <p className="font-semibold text-[#B42318] dark:text-[#FCA5A5]">
              Cancel Reason
            </p>

            <p className="mt-2 text-sm text-[#B42318] dark:text-[#FCA5A5]">
              {order.cancel_reason}
            </p>
          </div>
        )}
      </div>

      {/* BILL */}
      <div className="border-t border-[#E4DED3] bg-[#FCFAF6] p-6 dark:border-[#2A2F35] dark:bg-[#15181D]">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-[#667085] dark:text-[#AAB2BD]">
            <span>Subtotal</span>
            <span>₹{order.total}</span>
          </div>

          <div className="flex justify-between text-sm text-[#667085] dark:text-[#AAB2BD]">
            <span>Restaurant Charges</span>
            <span>₹0</span>
          </div>

          <div className="flex justify-between text-sm text-[#667085] dark:text-[#AAB2BD]">
            <span>GST</span>
            <span>₹0</span>
          </div>

          <div className="border-t border-[#E4DED3] pt-3 dark:border-[#2A2F35]" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>

            <span className="font-mono text-[#2F7D57] dark:text-[#7BC99A]">
              ₹{order.total}
            </span>
          </div>
        </div>

        <div className="mt-6">
          {order.order_status ===
            "pending" && (
            <p className="text-center text-sm text-[#667085]">
              Accept order from queue
              first
            </p>
          )}

          {workflowMode ===
            "simple" &&
            order.order_status ===
              "preparing" && (
              <OrderStatusAction
                orderId={order.id}
                currentStatus="preparing"
                nextStatus="served"
                label="Complete Order"
                variant="green"
                icon="complete"
              />
            )}

          {workflowMode ===
            "advanced" &&
            order.order_status ===
              "preparing" && (
              <OrderStatusAction
                orderId={order.id}
                currentStatus="preparing"
                nextStatus="ready"
                label="Mark Ready"
                variant="green"
                icon="ready"
              />
            )}

          {workflowMode ===
            "advanced" &&
            order.order_status ===
              "ready" && (
              <OrderStatusAction
                orderId={order.id}
                currentStatus="ready"
                nextStatus="served"
                label="Complete Order"
                variant="outline"
                icon="complete"
              />
            )}
        </div>
      </div>
    </aside>
  )
}