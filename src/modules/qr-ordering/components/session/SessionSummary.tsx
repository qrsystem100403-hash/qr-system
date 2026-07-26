"use client";

import {
  Clock3,
  CreditCard,
  ReceiptText,
  Table2,
} from "lucide-react";

import type { DiningSession } from "@/modules/qr-ordering/types/session";

type Props = {
  session: DiningSession;
  orderCount: number;
  total: number;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export default function SessionSummary({
  session,
  orderCount,
  total,
}: Props) {
  const billRequested =
    session.status === "bill_requested";

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,var(--color-gold)/0.12,transparent_70%)]" />

      <div className="relative flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10">
          <ReceiptText className="h-6 w-6 text-[var(--color-gold)]" />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Current Dining Session
          </p>

          <h1 className="mt-2 font-heading text-4xl leading-none tracking-[-0.04em]">
            {session.table_name}
          </h1>

          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            All orders placed during this dining session.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-4">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <Table2 className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-[0.14em]">
              Orders
            </span>
          </div>

          <p className="mt-3 text-3xl font-black">
            {orderCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-4">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-[0.14em]">
              Total
            </span>
          </div>

          <p className="mt-3 text-3xl font-black text-[var(--color-gold)]">
            ₹{total}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-4">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <Clock3 className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-[0.14em]">
              Started
            </span>
          </div>

          <p className="mt-3 text-sm font-semibold">
            {formatDate(session.started_at)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Session Status
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                billRequested
                  ? "bg-yellow-500/10 text-yellow-300"
                  : "bg-green-500/10 text-green-300"
              }`}
            >
              {billRequested
                ? "Bill Requested"
                : "Active"}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                session.payment_status === "paid"
                  ? "bg-green-500/10 text-green-300"
                  : "bg-red-500/10 text-red-300"
              }`}
            >
              {session.payment_status === "paid"
                ? "Paid"
                : "Payment Pending"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}