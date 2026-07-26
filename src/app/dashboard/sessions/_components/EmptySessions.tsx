"use client";

import { ReceiptText } from "lucide-react";

export default function EmptySessions() {
  return (
    <div
      className="
      flex
      flex-col
      items-center
      justify-center
      rounded-xl
      border
      border-dashed
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      px-6
      py-14
      text-center
      "
    >
      <div
        className="
        mb-5
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-lg
        bg-[var(--color-surface-hover)]
        "
      >
        <ReceiptText
          className="
          h-6
          w-6
          text-[var(--color-text-muted)]
          "
        />
      </div>

      <h2
        className="
        text-lg
        font-semibold
        text-[var(--color-heading)]
        "
      >
        No Active Sessions
      </h2>

      <p
        className="
        mt-2
        max-w-sm
        text-sm
        leading-6
        text-[var(--color-text-muted)]
        "
      >
        Active dining sessions will appear here
        automatically when customers place their
        first order.
      </p>
    </div>
  );
}