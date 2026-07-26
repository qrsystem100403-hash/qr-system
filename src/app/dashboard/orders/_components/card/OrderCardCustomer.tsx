import { Phone, User } from "lucide-react";
import type { Order } from "../order-types";

type Props = {
  order: Order;
};

export default function OrderCardCustomer({
  order,
}: Props) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        border-b
        border-[var(--color-border)]
        px-5
        py-3
      "
    >
      <div className="min-w-0 flex items-center gap-2">
        <User
          className="
            size-4
            shrink-0
            text-[var(--color-text-muted)]
          "
        />

        <span
          className="
            truncate
            text-sm
            font-medium
            text-[var(--color-text)]
          "
        >
          {order.customer_name || "Walk-in Customer"}
        </span>
      </div>

      {order.customer_phone && (
        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5
            text-xs
            text-[var(--color-text-muted)]
          "
        >
          <Phone className="size-3.5" />
          <span>{order.customer_phone}</span>
        </div>
      )}
    </div>
  );
}