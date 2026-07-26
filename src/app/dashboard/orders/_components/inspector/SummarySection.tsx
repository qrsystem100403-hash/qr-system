import {
  CreditCard,
  IndianRupee,
  Package,
  ReceiptText,
} from "lucide-react";
import type { Order } from "../order-types";
import PaymentChip from "../shared/PaymentChip";

type Props = {
  order: Order;
};

const formatMoney = (value: number) =>
  `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function SummarySection({
  order,
}: Props) {
  const itemsTotal = order.order_items.reduce(
    (sum, item) => sum + item.item_price * item.qty,
    0,
  );

  const addonsTotal = order.order_items.reduce((sum, item) => {
    const addonTotal = item.order_item_addons.reduce(
      (a, addon) => a + addon.addon_price,
      0,
    );

    return sum + addonTotal * item.qty;
  }, 0);

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
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-[var(--color-primary-soft)]
              text-[var(--color-primary)]
            "
          >
            <CreditCard className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-heading)]">
              Bill Summary
            </h2>

            <p className="text-sm text-[var(--color-text-muted)]">
              Payment & order totals
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="size-4 text-[var(--color-text-muted)]" />
            <span className="text-sm text-[var(--color-text-muted)]">
              Items Total
            </span>
          </div>

          <span className="font-semibold text-[var(--color-heading)]">
            {formatMoney(itemsTotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IndianRupee className="size-4 text-[var(--color-text-muted)]" />
            <span className="text-sm text-[var(--color-text-muted)]">
              Add-ons
            </span>
          </div>

          <span className="font-semibold text-[var(--color-heading)]">
            {formatMoney(addonsTotal)}
          </span>
        </div>

        <div className="h-px bg-[var(--color-border)]" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-muted)]">
            Subtotal
          </span>

          <span className="font-semibold text-[var(--color-heading)]">
            {formatMoney(order.subtotal)}
          </span>
        </div>

        {order.service_charge_enabled && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-muted)]">
              Service Charge
              {order.service_charge_type === "percentage"
                ? ` (${order.service_charge_value}%)`
                : ""}
            </span>

            <span className="font-semibold text-[var(--color-heading)]">
              {formatMoney(order.service_charge)}
            </span>
          </div>
        )}

        {order.gst_enabled && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-muted)]">
              GST ({order.gst_percent}%)
              <span className="ml-1 text-xs opacity-70">
                ({order.gst_mode})
              </span>
            </span>

            <span className="font-semibold text-[var(--color-heading)]">
              {formatMoney(order.gst_amount)}
            </span>
          </div>
        )}

        {Number(order.round_off) !== 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-muted)]">
              Round Off
            </span>

            <span className="font-semibold text-[var(--color-heading)]">
              {formatMoney(order.round_off)}
            </span>
          </div>
        )}

        

        <div className="h-px bg-[var(--color-border)]" />

        <div
  className="
    flex
    items-center
    justify-between
    rounded-[var(--radius-lg)]
    bg-[var(--color-primary-soft)]
    px-4
    py-4
  "
>
          <div className="flex items-center gap-2">
            <ReceiptText className="size-4 text-[var(--color-primary)]" />

            <span className="text-base font-semibold text-[var(--color-heading)]">
              Grand Total
            </span>
          </div>

          <span className="text-2xl font-bold text-[var(--color-primary)]">
            {formatMoney(order.total)}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <span className="text-sm text-[var(--color-text-muted)]">
            Payment
          </span>

          <PaymentChip status={order.payment_status} />
        </div>
      </div>
    </section>
  );
}