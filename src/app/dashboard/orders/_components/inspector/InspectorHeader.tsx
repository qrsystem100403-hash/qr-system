import {
  Table2,
} from "lucide-react";
import type { Order } from "../order-types";
import OrderAge from "../shared/OrderAge";
import StatusChip from "../shared/StatusChip";

type Props = {
  order: Order;
};

export default function InspectorHeader({
  order,
}: Props) {
  return (
    <header
      className="
        border-b
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-5
        py-4
      "
    >
      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-[var(--color-primary-soft)]
              text-[var(--color-primary)]
            "
          >
            <Table2 className="h-5 w-5" />
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h1 className="truncate text-xl font-semibold text-[var(--color-heading)]">
                {order.table_name ?? "ONLINE"}
              </h1>

              <StatusChip
                status={order.order_status}
              />

            </div>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Order #{order.tracking_token ?? order.id.slice(0, 8)}
            </p>

          </div>

        </div>

        <div
          className="
            shrink-0
            rounded-lg
            border
            border-[var(--color-border)]
            bg-[var(--color-surface-soft)]
            px-3
            py-2
          "
        >
          <OrderAge
            createdAt={order.created_at}
          />
        </div>

      </div>
    </header>
  );
}