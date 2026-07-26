import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  CreditCard,
  Clock3,
  User,
  Table2,
} from "lucide-react";

import type { Order } from "../../_components/order-types";
import { buildHistoryHref } from "../history-utils";
import {
  formatOrderTime,
  shortOrderId,
} from "../../_components/order-utils";

type HistoryTab =
  | "all"
  | "served"
  | "cancelled";

type Props = {
  order: Order;
  selected: boolean;
  activeStatus: HistoryTab;
  searchQuery: string;
};

export default function HistoryCard({
  order,
  selected,
  activeStatus,
  searchQuery,
}: Props) {
  const completed =
    order.order_status === "served";

  return (
    <Link
      href={buildHistoryHref({
        status: activeStatus,
        q: searchQuery,
        selected: order.id,
      })}
      className={`
        group
        block
        rounded-[var(--radius-xl)]
        border
        transition-all
        duration-200

        ${
          selected
            ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] shadow-[var(--shadow-md)]"
            : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-border)] hover:shadow-[var(--shadow-sm)]"
        }
      `}
    >
      <div className="p-5">

        {/* Top */}

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              {completed ? (
                <CheckCircle2 className="size-4 text-emerald-600" />
              ) : (
                <XCircle className="size-4 text-red-500" />
              )}

              <span
                className={`text-xs font-bold uppercase tracking-[0.18em]
                ${
                  completed
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {completed
                  ? "Completed"
                  : "Cancelled"}
              </span>

            </div>

            <h3 className="mt-3 text-lg font-bold text-[var(--color-heading)]">

              {order.table_name || "ONLINE"}

            </h3>

            <p className="mt-1 font-mono text-xs text-[var(--color-text-soft)]">

              #{shortOrderId(order)}

            </p>

          </div>

          <div className="rounded-2xl bg-[var(--color-primary-soft)] px-4 py-2">
  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
    Total
  </p>
  <p className="text-xl font-black text-[var(--color-primary)]">
    ₹{Number(order.total).toFixed(0)}
  </p>
</div>

        </div>

        {/* Divider */}

        <div className="my-4 h-px bg-[var(--color-border)]" />

        {/* Customer */}

        <div className="mt-5 flex flex-wrap gap-2">
  <div className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-soft)] px-3 py-2 text-sm">
    <User className="size-4 text-[var(--color-primary)]" />
    {order.customer_name || "Walk-in Customer"}
  </div>

  <div className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-soft)] px-3 py-2 text-sm">
    <Table2 className="size-4 text-[var(--color-primary)]" />
    {order.order_type}
  </div>

  <div className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-soft)] px-3 py-2 text-sm">
    <Clock3 className="size-4 text-[var(--color-primary)]" />
    {formatOrderTime(order.created_at)}
  </div>
</div>

        {/* Cancellation */}

        {!completed &&
          order.cancel_reason && (
            <div
              className="
                mt-4
                rounded-[var(--radius-lg)]
                border
                border-red-200
                bg-red-50
                p-3
                dark:border-red-900/40
                dark:bg-red-950/20
              "
            >
              <p className="text-xs font-semibold text-red-600 dark:text-red-300">

                Cancellation Reason

              </p>

              <p className="mt-1 text-sm text-red-500 dark:text-red-200">

                {order.cancel_reason}

              </p>
            </div>
          )}

        {/* Footer */}

        <div className="mt-6 flex items-center justify-between">
  <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--color-primary)]">
    {order.order_items.length} Item{order.order_items.length > 1 ? "s" : ""}
  </span>

  <span
    className={`rounded-full px-3 py-1 text-xs font-bold ${
      order.payment_status === "paid"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-orange-100 text-orange-700"
    }`}
  >
    {order.payment_status === "paid" ? "Paid" : "Pending"}
  </span>
</div>

      </div>
    </Link>
  );
}