"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Package2,
  UtensilsCrossed,
} from "lucide-react";

import type { WaiterOrder } from "@/modules/waiter/type";

type Props = {
  order: WaiterOrder;
};

function getWaitingTime(date: string) {
  const diff =
    Date.now() - new Date(date).getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m`;
}

export default function ReadyOrderCard({
  order,
}: Props) {
  return (
    <Link
      href={`/dashboard/waiter/${order.id}`}
      className="
        group
        block
        rounded-[28px]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        transition-all
        duration-200
        hover:border-[var(--color-primary)]
        hover:shadow-[var(--shadow-lg)]
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between p-6">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1">

            <UtensilsCrossed className="size-4 text-emerald-600" />

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Ready
            </span>

          </div>

          <h2 className="mt-4 text-3xl font-black text-[var(--color-heading)]">
            {order.table_name || "ONLINE"}
          </h2>

        </div>

      </div>

      {/* Metrics */}

      <div className="grid grid-cols-2 border-y border-[var(--color-border)]">

        <div className="p-5">

          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">

            <Package2 className="size-4" />

            <span className="text-xs uppercase">
              Items
            </span>

          </div>

          <p className="mt-2 text-2xl font-black">
            {order.itemCount}
          </p>

        </div>

        <div className="border-l border-[var(--color-border)] p-5">

          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">

            <Clock3 className="size-4" />

            <span className="text-xs uppercase">
              Waiting
            </span>

          </div>

          <p className="mt-2 text-2xl font-black text-orange-500">
            {getWaitingTime(
              order.created_at,
            )}
          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between p-5">

        <p className="text-sm text-[var(--color-text-muted)]">
          Ready to serve customer
        </p>

        <div className="flex items-center gap-2 font-bold text-[var(--color-primary)]">

          Open

          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />

        </div>

      </div>

    </Link>
  );
}