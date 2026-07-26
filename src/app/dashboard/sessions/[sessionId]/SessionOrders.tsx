"use client";

import {
  CalendarClock,
  MessageSquareText,
  Package2,
  IndianRupee,
} from "lucide-react";

type Addon = {
  id: string;
  addon_name: string;
  addon_price: number;
};

type OrderItem = {
  id: string;
  qty: number;
  item_name: string | null;
  variant_name: string |null;
  item_price: number;
  order_item_addons: Addon[];
};

type Order = {
  id: string;
  tracking_token: string | null;
  total: number;
  order_status: string;
  payment_status: string;
  customer_note: string |null;
  created_at: string;
  order_items: OrderItem[];
};

type Props = {
  orders: Order[];
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  preparing: "bg-blue-100 text-blue-700",
  ready: "bg-emerald-100 text-emerald-700",
  served: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export default function SessionOrders({
  orders,
}: Props) {
  if (!orders.length) {
    return (
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
        <Package2
          size={40}
          className="mx-auto text-[var(--color-primary)]"
        />

        <h2 className="mt-4 text-lg font-semibold">
          No Orders
        </h2>

        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          This session doesn't contain any orders yet.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {orders.map((order, index) => (
        <article
          key={order.id}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <div className="border-b border-[var(--color-border)] px-5 py-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold">
                Order #{index + 1}
              </h2>

              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    statusStyles[
                      order.order_status
                    ] ??
                    "bg-slate-100 text-slate-700"
                  }`}
                >
                  {order.order_status}
                </span>

                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                  {order.payment_status}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1 font-semibold text-[var(--color-primary)]">
                <IndianRupee size={16} />
                {Number(order.total).toFixed(2)}
              </div>

              <div className="mt-1 flex items-center justify-end gap-1 text-xs text-[var(--color-text-muted)]">
                <CalendarClock size={14} />
                {formatTime(order.created_at)}
              </div>
            </div>
          </div>

          <div className="space-y-3 p-5">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-[var(--color-border)] p-4"
              >
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.qty} × {item.item_name}
                    </p>

                    {item.variant_name && (
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {item.variant_name}
                      </p>
                    )}

                    {item.order_item_addons.length >
                      0 && (
                      <div className="mt-2 space-y-1">
                        {item.order_item_addons.map(
                          (addon) => (
                            <p
                              key={addon.id}
                              className="text-sm text-[var(--color-text-muted)]"
                            >
                              +{" "}
                              {addon.addon_name}
                            </p>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  <div className="font-medium">
                    ₹
                    {(
                      item.item_price *
                      item.qty
                    ).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}

            {order.customer_note && (
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquareText size={16} />
                  Customer Note
                </div>

                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {order.customer_note}
                </p>
              </div>
            )}
          </div>

          
        </article>
      ))}
    </section>
  );
}