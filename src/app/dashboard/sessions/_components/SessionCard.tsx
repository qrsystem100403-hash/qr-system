"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  ReceiptText,
  IndianRupee,
} from "lucide-react";
import type { SessionListItem } from "@/modules/sessions/types";

type Props = {
  session: SessionListItem;
};

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function getDuration(start: string) {
  const diff =
    Date.now() - new Date(start).getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m`;
}

export default function SessionCard({
  session,
}: Props) {
  const isBillRequested =
    session.status === "bill_requested";

  const total = Number(
    session.grand_total ?? 0,
  ).toFixed(2);

  return (
    <Link
      href={`/dashboard/sessions/${session.id}`}
      className="
      block
      rounded-xl
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      transition-all
      duration-200
      hover:border-[var(--color-primary)]
      hover:shadow-sm
      "
    >
      <div className="flex items-start justify-between p-5">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-[var(--color-heading)]">
            {session.restaurant_tables.name}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`
              rounded-md
              px-2.5
              py-1
              text-xs
              font-medium
              ${
                isBillRequested
                  ? "bg-orange-100 text-orange-700"
                  : "bg-emerald-100 text-emerald-700"
              }
              `}
            >
              {isBillRequested
                ? "Bill Requested"
                : "Active"}
            </span>

            <span
              className={`
              rounded-md
              px-2.5
              py-1
              text-xs
              ${
                session.payment_status ===
                "paid"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-700"
              }
              `}
            >
              {session.payment_status ===
              "paid"
                ? "Paid"
                : "Pending"}
            </span>
          </div>
        </div>

        {isBillRequested && (
          <div className="text-right">
            <p className="text-xs text-[var(--color-text-muted)]">
              Bill Amount
            </p>

            <div className="mt-1 flex items-center justify-end gap-1">
              <IndianRupee
                size={16}
                className="text-[var(--color-primary)]"
              />

              <span className="text-2xl font-semibold text-[var(--color-heading)]">
                {total}
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        className="
        grid
        grid-cols-3
        border-y
        border-[var(--color-border)]
        "
      >
        <div className="p-4">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <ReceiptText size={15} />

            <span className="text-xs">
              Orders
            </span>
          </div>

          <p className="mt-2 font-semibold">
            {session.orders.length}
          </p>
        </div>

        <div className="border-x border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <Clock3 size={15} />

            <span className="text-xs">
              Started
            </span>
          </div>

          <p className="mt-2 text-sm font-medium">
            {formatTime(
              session.started_at!,
            )}
          </p>
        </div>

        <div className="p-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            Running
          </p>

          <p className="mt-2 text-sm font-medium">
            {getDuration(
              session.started_at!,
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          {isBillRequested
            ? "Customer waiting for billing"
            : "Dining session in progress"}
        </p>

        <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]">
          {isBillRequested
            ? "Collect Payment"
            : "Open Session"}

          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}