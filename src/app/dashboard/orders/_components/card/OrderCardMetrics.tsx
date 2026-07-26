import {
  CreditCard,
  IndianRupee,
  Package,
} from "lucide-react";

import PaymentChip from "../shared/PaymentChip";
import { getItemCount } from "../order-utils";
import type { Order } from "../order-types";

type Props = {
  order: Order;
};

export default function OrderCardMetrics({
  order,
}: Props) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-[var(--color-border)]
        px-5
        py-3
      "
    >
      <div className="flex items-center gap-5">
        <div
          className="
            flex
            items-center
            gap-2
            text-sm
          "
        >
          <Package
            className="
              size-4
              text-[var(--color-primary)]
            "
          />

          <span className="font-semibold">
            {getItemCount(order)}
          </span>

          <span className="text-[var(--color-text-muted)]">
            Items
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
          "
        >
          <IndianRupee
            className="
              size-4
              text-green-600
            "
          />

          <span className="font-semibold">
            ₹{Number(order.total).toLocaleString()}
          </span>
        </div>
      </div>

      <PaymentChip
        status={order.payment_status}
      />
    </div>
  );
}