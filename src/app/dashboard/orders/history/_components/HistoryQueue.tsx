import { ScrollText } from "lucide-react";
import type { Order } from "../../_components/order-types";
import HistoryCard from "./HistoryCard";

export type HistoryTab =
  | "all"
  | "served"
  | "cancelled";

type Props = {
  orders: Order[];
  selectedOrderId?: string;
  activeStatus: HistoryTab;
  searchQuery: string;
};

export default function HistoryQueue({
  orders,
  selectedOrderId,
  activeStatus,
  searchQuery,
}: Props) {
  return (
    <section
  className="
    flex
    h-full
    flex-col
    overflow-hidden
  "
>
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[var(--color-border)]
          px-6
          py-5
        "
      >

          <h2 className="mt-1 text-2xl font-bold text-[var(--color-heading)]">
            Archived Orders
          </h2>
        

        <div
          className="
            rounded-full
            bg-[var(--color-surface-soft)]
            px-3
            py-1
            text-sm
            font-semibold
          "
        >
          {orders.length}
        </div>
      </div>

      {/* List */}

      <div
  className="
    flex-1
    min-h-0
    overflow-y-auto
  "
>
  <div className="space-y-4 p-5">
        {orders.length === 0 ? (
          <div
            className="
              flex
              h-full
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-[var(--color-surface-soft)]
              "
            >
              <ScrollText className="size-8 text-[var(--color-text-soft)]" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-[var(--color-heading)]">
              No Orders Found
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--color-text-muted)]">
              No archived orders match your current filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <HistoryCard
                key={order.id}
                order={order}
                selected={
                  selectedOrderId === order.id
                }
                activeStatus={activeStatus}
                searchQuery={searchQuery}
              />
            ))}

          </div>
        )}
        </div>
      </div>
    </section>
  );
}