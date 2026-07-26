import {
  AlertTriangle,
  MessageSquareText,
} from "lucide-react";

import type { Order } from "../order-types";

type Props = {
  order: Order;
};

export default function NotesSection({
  order,
}: Props) {
  const hasCustomerNote =
    !!order.customer_note?.trim();

  const hasCancelReason =
    !!order.cancel_reason?.trim();

  if (!hasCustomerNote && !hasCancelReason) {
    return (
      <section
        className="
          rounded-[var(--radius-lg)]
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          p-5
        "
      >
        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-[var(--color-surface-soft)]
              text-[var(--color-text-muted)]
            "
          >
            <MessageSquareText className="size-5" />
          </div>

          <div>

            <h2 className="text-lg font-semibold text-[var(--color-heading)]">
              Notes
            </h2>

            <p className="text-sm text-[var(--color-text-muted)]">
              No customer notes available.
            </p>

          </div>

        </div>
      </section>
    );
  }

  return (
    <section
      className="
        overflow-hidden
        rounded-[var(--radius-lg)]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
      "
    >
      <div className="border-b border-[var(--color-border)] p-5">

        <h2 className="text-lg font-semibold text-[var(--color-heading)]">
          Notes
        </h2>

      </div>

      <div className="space-y-5 p-5">

        {hasCustomerNote && (
          <div
            className="
              rounded-2xl
              border
              border-blue-200
              bg-blue-50
              p-4

              dark:border-blue-900/30
              dark:bg-blue-950/20
            "
          >
            <div className="flex items-center gap-2">

              <MessageSquareText className="size-4 text-blue-600 dark:text-blue-400" />

              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Customer Note
              </span>

            </div>

            <p className="mt-3 text-sm leading-6 text-blue-900 dark:text-blue-100">
              {order.customer_note}
            </p>

          </div>
        )}

        {hasCancelReason && (
          <div
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-4

              dark:border-red-900/30
              dark:bg-red-950/20
            "
          >
            <div className="flex items-center gap-2">

              <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />

              <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                Cancellation Reason
              </span>

            </div>

            <p className="mt-3 text-sm leading-6 text-red-900 dark:text-red-100">
              {order.cancel_reason}
            </p>

          </div>
        )}

      </div>
    </section>
  );
}