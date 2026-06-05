import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Hash,
  ReceiptIndianRupee,
  StickyNote,
  Table2,
} from "lucide-react"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"

type OrderItemAddon = {
  id: string
  addon_name: string
  addon_price: number
}

type OrderItem = {
  id: string
  qty: number
  item_price: number
  item_name: string | null
  variant_name: string | null
  menu_item_id: string
  order_item_addons: OrderItemAddon[]
}

type Order = {
  id: string
  tracking_token: string | null
  table_name: string
  total: number
  payment_status: string
  order_status: string
  customer_note: string | null
  created_at: string
  order_items: OrderItem[]
}

const formatOrderTime = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date))

function shortId(order: Order) {
  return (
    order.tracking_token?.slice(0, 8).toUpperCase() ??
    order.id.slice(0, 8).toUpperCase()
  )
}

export default async function HistoryPage() {
  const { restaurant, supabase } = await requireRestaurantUser()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      tracking_token,
      table_name,
      total,
      payment_status,
      order_status,
      customer_note,
      created_at,
      order_items (
        id,
        qty,
        item_price,
        item_name,
        variant_name,
        menu_item_id,
        order_item_addons (
          id,
          addon_name,
          addon_price
        )
      )
    `)
    .eq("restaurant_id", restaurant.id)
    .eq("order_status", "served")
    .order("created_at", { ascending: false })
    .order("id", { referencedTable: "order_items", ascending: true })

  const orders = (data ?? []) as Order[]

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  )

  if (error) {
    return (
      <div className="rounded-xl border border-[#F3C6C2] bg-[#FDECEC] p-4 text-[#B42318]">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-bold">Failed to load order history</p>
            <p className="mt-1 text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="mb-4 rounded-2xl border border-[#E6E1D8] bg-white p-4 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0F8A43] dark:text-[#7BC99A]">
              Completed Orders
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-[#111827] dark:text-[#E7E9EC]">
              Order History
            </h2>

            <p className="mt-1 text-sm text-[#667085] dark:text-[#AAB2BD]">
              Served orders for {restaurant.name}.
            </p>
          </div>

          <div className="rounded-xl border border-[#E6E1D8] bg-[#FCFAF6] px-4 py-3 sm:text-right dark:border-[#2A2F35] dark:bg-[#20242A]">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#667085] dark:text-[#AAB2BD]">
              Total Revenue
            </p>

            <p className="mt-1 text-2xl font-black text-[#0F8A43] dark:text-[#7BC99A]">
              ₹{totalRevenue}
            </p>

            <p className="mt-1 text-xs text-[#98A2B3]">
              {orders.length} orders
            </p>
          </div>
        </div>
      </section>

      {!orders.length ? (
        <div className="rounded-2xl border border-[#E6E1D8] bg-white p-8 text-center shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#E7F3EC] text-[#0F8A43] dark:bg-[#183026] dark:text-[#7BC99A]">
            <CheckCircle2 className="size-5" />
          </div>

          <h2 className="mt-4 text-2xl font-black text-[#111827] dark:text-[#E7E9EC]">
            No completed orders
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#667085] dark:text-[#AAB2BD]">
            Served orders will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border border-[#E6E1D8] bg-white shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]"
            >
              <div className="border-b border-[#EEF0F2] bg-[#FCFAF6] p-4 dark:border-[#2A2F35] dark:bg-[#20242A]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0F8A43] dark:text-[#7BC99A]">
                      Table
                    </p>

                    <h2 className="mt-1 truncate text-3xl font-black tracking-tight text-[#111827] dark:text-[#E7E9EC]">
                      {order.table_name}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#667085] dark:text-[#AAB2BD]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F3EC] px-2.5 py-1 font-black uppercase text-[#0F8A43] dark:bg-[#183026] dark:text-[#7BC99A]">
                        <CheckCircle2 className="size-3.5" />
                        Served
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {formatOrderTime(order.created_at)}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Hash className="size-3.5" />
                        {shortId(order)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-black text-[#0F8A43] dark:text-[#7BC99A]">
                      ₹{order.total}
                    </p>

                    <p className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#98A2B3]">
                      Total
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="space-y-2">
                  {order.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[#E6E1D8] bg-[#FCFAF6] px-3 py-2.5 dark:border-[#2A2F35] dark:bg-[#20242A]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[#111827] dark:text-[#E7E9EC]">
                            {item.qty} × {item.item_name ?? "Unknown item"}
                          </p>

                          <div className="mt-1 space-y-1 text-xs leading-5 text-[#667085] dark:text-[#AAB2BD]">
                            {item.variant_name && (
                              <p>Size: {item.variant_name}</p>
                            )}

                            {item.order_item_addons?.length > 0 && (
                              <p>
                                Add-ons:{" "}
                                {item.order_item_addons
                                  .map(
                                    (addon) =>
                                      `${addon.addon_name} +₹${addon.addon_price}`
                                  )
                                  .join(", ")}
                              </p>
                            )}

                            <p>₹{item.item_price} each</p>
                          </div>
                        </div>

                        <p className="shrink-0 text-sm font-black text-[#111827] dark:text-[#E7E9EC]">
                          ₹{item.item_price * item.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.customer_note && (
                  <div className="mt-3 rounded-xl border border-[#F4D58D] bg-[#FFF8E7] p-3 dark:border-[#5B4620] dark:bg-[#2A2416]">
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#B7791F] dark:text-[#FACC15]">
                      <StickyNote className="size-3.5" />
                      Customer Note
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#7A4F01] dark:text-[#FDE68A]">
                      {order.customer_note}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#EEF0F2] pt-3 dark:border-[#2A2F35]">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#98A2B3]">
                      Payment
                    </p>

                    <p className="mt-1 truncate text-sm capitalize text-[#667085] dark:text-[#AAB2BD]">
                      {order.payment_status}
                    </p>
                  </div>

                  <div className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border border-[#E6E1D8] bg-white px-3 text-xs font-black uppercase tracking-[0.1em] text-[#667085] dark:border-[#2A2F35] dark:bg-[#171A1F] dark:text-[#AAB2BD]">
                    <ReceiptIndianRupee className="size-4" />
                    Bill
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}