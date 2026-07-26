"use client";

import {
  CheckCircle2,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";

export default function EmptyReadyOrders() {
  return (
    <section
      className="
        flex
        min-h-[380px]
        items-center
        justify-center
        rounded-[32px]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-8
        shadow-[var(--shadow-sm)]
      "
    >
      <div className="max-w-lg text-center">
        <div
          className="
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            bg-emerald-500/10
            text-emerald-500
          "
        >
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h2 className="mt-6 text-3xl font-black tracking-tight text-[var(--color-heading)]">
          All Orders Served
        </h2>

        <p className="mx-auto mt-3 max-w-md text-base leading-7 text-[var(--color-text-muted)]">
          Every customer has been served successfully.
          New ready orders and table requests will appear here
          automatically in real time.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[var(--color-primary-soft)]
              px-5
              py-3
              text-sm
              font-semibold
              text-[var(--color-primary)]
            "
          >
            <UtensilsCrossed className="h-4 w-4" />
            Waiting for Orders
          </div>

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[var(--color-border)]
              bg-[var(--color-surface-soft)]
              px-5
              py-3
              text-sm
              font-semibold
              text-[var(--color-text-muted)]
            "
          >
            <Sparkles className="h-4 w-4" />
            Great Job!
          </div>
        </div>
      </div>
    </section>
  );
}