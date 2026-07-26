"use client";

import {
  ReceiptText,
  ShoppingBag,
  Package2,
  IndianRupee,
} from "lucide-react";

type ReceiptTotals = {
  subtotal: number;
  gstAmount: number;
  serviceChargeAmount: number;
  roundOff: number;
  grandTotal: number;
};

type Order = {
  order_items: {
    qty: number;
  }[];
};

type Props = {
  totals: ReceiptTotals;
  orders: Order[];
  actions?: React.ReactNode;
};

export default function CashierBillSummary({
  totals,
  orders,
  actions,
}: Props) {
  const totalOrders = orders.length;

  const totalItems = orders.reduce(
    (sum, order) =>
      sum +
      order.order_items.reduce(
        (itemSum, item) => itemSum + item.qty,
        0,
      ),
    0,
  );

  return (
    <section
      className="
      rounded-xl
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      "
    >
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            bg-[var(--color-primary-soft)]
            "
          >
            <ReceiptText
              size={18}
              className="text-[var(--color-primary)]"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-heading)]">
              Bill Summary
            </h2>

            <p className="text-sm text-[var(--color-text-muted)]">
              Review before payment
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 px-5 py-5">
        <MoneyRow
          label="Subtotal"
          value={totals.subtotal}
        />

        <MoneyRow
          label="GST"
          value={totals.gstAmount}
        />

        {totals.serviceChargeAmount > 0 && (
          <MoneyRow
            label="Service Charge"
            value={totals.serviceChargeAmount}
          />
        )}

        {totals.roundOff !== 0 && (
          <MoneyRow
            label="Round Off"
            value={totals.roundOff}
          />
        )}

        <div className="border-t border-dashed border-[var(--color-border)] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">
              Grand Total
            </span>

            <div className="flex items-center gap-1 text-2xl font-bold text-[var(--color-primary)]">
              <IndianRupee size={20} />
              {totals.grandTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div
        className="
        grid
        grid-cols-2
        border-y
        border-[var(--color-border)]
        "
      >
        <div className="flex items-center gap-3 p-4">
          <ShoppingBag
            size={18}
            className="text-[var(--color-primary)]"
          />

          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Orders
            </p>

            <p className="font-semibold">
              {totalOrders}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-[var(--color-border)] p-4">
          <Package2
            size={18}
            className="text-[var(--color-primary)]"
          />

          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Items
            </p>

            <p className="font-semibold">
              {totalItems}
            </p>
          </div>
        </div>
      </div>

      {actions && (
        <div className="p-5">
          {actions}
        </div>
      )}
    </section>
  );
}

function MoneyRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--color-text-muted)]">
        {label}
      </span>

      <span className="flex items-center gap-1 font-medium">
        <IndianRupee
          size={14}
          className="text-[var(--color-primary)]"
        />

        {value.toFixed(2)}
      </span>
    </div>
  );
}