import {
  AlertTriangle,
  Ban,
  Clock,
  Hash,
  ReceiptIndianRupee,
  XCircle,
} from "lucide-react";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

type OrderItem = {
  id: string;
  qty: number;
  item_price: number;
  item_name: string | null;
  menu_item_id: string;
};

type Order = {
  id: string;
  table_name: string;
  total: number;
  payment_status: string;
  order_status: string;
  customer_note: string | null;
  cancel_reason: string | null;
  created_at: string;
  order_items: OrderItem[];
};

const formatOrderTime = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));

export default async function CancelledPage() {
  const { restaurant, supabase } = await requireRestaurantUser();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      table_name,
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
        menu_item_id
      )
    `)
    .eq("restaurant_id", restaurant.id)
    .eq("order_status", "cancelled")
    .order("created_at", { ascending: false })
    .order("id", { referencedTable: "order_items", ascending: true });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-100">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-semibold">Failed to load cancelled orders</p>
            <p className="mt-1 text-sm text-red-200">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const orders = (data ?? []) as Order[];

  const totalCancelledAmount = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  return (
    <>
      <section className="mb-5 rounded-[24px] border border-red-500/15 bg-red-500/[0.04] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-300">
              Cancelled Orders
            </p>

            <h2 className="mt-2 font-heading text-3xl font-normal">
              Cancellation Log
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Cancelled orders for {restaurant.name}.
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/15 bg-black/20 px-4 py-3 sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
              Cancelled Value
            </p>

            <p className="mt-1 font-heading text-3xl font-normal text-red-300">
              ₹{totalCancelledAmount}
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-soft)]">
              {orders.length} orders
            </p>
          </div>
        </div>
      </section>

      {!orders.length ? (
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70 p-8 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-red-500/10 text-red-300">
            <Ban className="size-5" />
          </div>

          <h2 className="mt-4 font-heading text-3xl font-normal">
            No cancelled orders
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--color-text-muted)]">
            Cancelled orders will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-[22px] border border-red-500/20 bg-[var(--color-surface-soft)]/70 shadow-[0_16px_42px_rgba(0,0,0,0.18)]"
            >
              <div className="border-b border-red-500/15 bg-red-500/[0.04] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">
                      Table
                    </p>

                    <h2 className="mt-1 truncate font-heading text-4xl font-normal leading-none">
                      {order.table_name}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-soft)]">
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 font-bold uppercase tracking-[0.12em] text-red-200">
                        <XCircle className="size-3.5" />
                        Cancelled
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {formatOrderTime(order.created_at)}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Hash className="size-3.5" />
                        {order.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-heading text-2xl font-normal leading-none text-red-200">
                      ₹{order.total}
                    </p>

                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                      Total
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">
                    Cancellation Reason
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-100">
                    {order.cancel_reason?.trim() || "No reason provided"}
                  </p>
                </div>

                <div className="mt-3 space-y-2">
                  {order.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-black/20 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium">
                          {item.qty} × {item.item_name ?? "Unknown item"}
                        </p>

                        <p className="mt-1 text-xs text-[var(--color-text-soft)]">
                          ₹{item.item_price} each
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold">
                        ₹{item.item_price * item.qty}
                      </p>
                    </div>
                  ))}
                </div>

                {order.customer_note && (
                  <div className="mt-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-300">
                      Customer Note
                    </p>

                    <p className="mt-1 text-sm leading-6 text-yellow-100">
                      {order.customer_note}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                      Payment
                    </p>

                    <p className="mt-1 truncate text-sm capitalize text-[var(--color-text-muted)]">
                      {order.payment_status}
                    </p>
                  </div>

                  <div className="inline-flex h-10 shrink-0 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-black/20 px-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
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
  );
}