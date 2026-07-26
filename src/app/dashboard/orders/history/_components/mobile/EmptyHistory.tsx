"use client";

import {
  History,
  Sparkles,
} from "lucide-react";

export default function EmptyHistory() {
  return (
    <section
      className="
        flex
        min-h-[70vh]
        items-center
        justify-center
        px-6
      "
    >
      <div className="max-w-sm text-center">

        <div
          className="
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            bg-[var(--color-primary-soft)]
          "
        >
          <History
            className="
              h-10
              w-10
              text-[var(--color-primary)]
            "
          />
        </div>

        <h2
          className="
            mt-6
            text-2xl
            font-black
            text-[var(--color-heading)]
          "
        >
          No Order History
        </h2>

        <p
          className="
            mt-3
            text-sm
            leading-7
            text-[var(--color-text-muted)]
          "
        >
          Completed and cancelled orders
          will appear here once your
          restaurant starts serving
          customers.
        </p>

        <div
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-[var(--color-primary-soft)]
            px-5
            py-2.5
            text-sm
            font-semibold
            text-[var(--color-primary)]
          "
        >
          <Sparkles className="size-4" />
          Nothing to show yet
        </div>

      </div>
    </section>
  );
}