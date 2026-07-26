"use client";

import {
  ClipboardList,
  Sparkles,
} from "lucide-react";

export default function EmptyMobileOrders() {
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
          <ClipboardList
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
          You're All Caught Up
        </h2>

        <p
          className="
            mt-3
            text-sm
            leading-7
            text-[var(--color-text-muted)]
          "
        >
          There are no orders in this queue.
          New customer orders will appear here
          automatically.
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
          Waiting for orders...
        </div>

      </div>
    </section>
  );
}