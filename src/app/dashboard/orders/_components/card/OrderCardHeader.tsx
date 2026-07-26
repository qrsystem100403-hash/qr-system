import Link from "next/link";

import type {
  Order,
  StatusTabValue,
} from "../order-types";

import { buildOrdersHref } from "../order-utils";

import OrderAge from "../shared/OrderAge";
import StatusChip from "../shared/StatusChip";
import { Hash } from "lucide-react";

type Props = {
  order: Order;
  selected: boolean;
  activeStatus: StatusTabValue;
  searchQuery: string;
};

export default function OrderCardHeader({
  order,
  selected,
  activeStatus,
  searchQuery,
}: Props) {
  return (
    <Link
      href={buildOrdersHref({
        status: activeStatus,
        selected: order.id,
        q: searchQuery,
      })}
      className={`
  block
  border-b
  border-[var(--color-border)]
  px-5
  py-4
  transition-all
  ${
    selected
      ? "bg-[var(--color-primary-soft)]"
      : "hover:bg-[var(--color-surface-soft)]"
  }
`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h2
  className="
    truncate
    text-2xl
    font-bold
    tracking-tight
    text-[var(--color-heading)]
  "
>
              {order.table_name || "ONLINE"}
            </h2>

            <StatusChip
              status={order.order_status}
            />
          </div>

          <div
  className="
    mt-2
    flex
    items-center
    gap-1.5
    text-sm
    text-[var(--color-text-muted)]
  "
>
  <Hash className="size-3.5" />
  <span>
    {order.tracking_token ?? order.id.slice(0, 8)}
  </span>
</div>
        </div>

        <div
  className="
    flex
    shrink-0
    flex-col
    items-end
    gap-2
  "
>
  <OrderAge createdAt={order.created_at} />
</div>
      </div>
    </Link>
  );
}