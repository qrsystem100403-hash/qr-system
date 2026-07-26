"use client";

import { useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  ReceiptText,
} from "lucide-react";

import type { Order } from "../order-types";
import PaymentChip from "../shared/PaymentChip";

type Props = {
  order: Order;
};

const money = (value: number) =>
  `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function MobileSummarySection({
  order,
}: Props) {
  const [expanded, setExpanded] =
    useState(false);

  return (
    <section
      className="
        overflow-hidden
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
      "
    >
      {/* Header */}

      <div className="flex items-center gap-3 border-b border-[var(--color-border)] p-5">

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-2xl
            bg-[var(--color-primary-soft)]
          "
        >
          <ReceiptText
            className="
              size-5
              text-[var(--color-primary)]
            "
          />
        </div>

        <div>

          <h2 className="font-bold">
            Bill Summary
          </h2>

          <p
            className="
              text-xs
              text-[var(--color-text-muted)]
            "
          >
            Payment details
          </p>

        </div>

      </div>

      {/* Grand Total */}

      <div className="p-5">

        <div className="flex items-center justify-between">

          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-wide
                text-[var(--color-text-soft)]
              "
            >
              Grand Total
            </p>

            <h3
              className="
                mt-1
                text-3xl
                font-black
                text-[var(--color-primary)]
              "
            >
              {money(order.total)}
            </h3>

          </div>

          <PaymentChip
            status={order.payment_status}
          />

        </div>

        {/* Expand */}

        <button
          type="button"
          onClick={() =>
            setExpanded(!expanded)
          }
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-[var(--color-surface-soft)]
            py-3
            text-sm
            font-semibold
          "
        >
          {expanded ? (
            <>
              Hide Breakdown
              <ChevronUp className="size-4" />
            </>
          ) : (
            <>
              View Breakdown
              <ChevronDown className="size-4" />
            </>
          )}
        </button>

        {/* Expanded */}

        {expanded && (
          <div
            className="
              mt-5
              space-y-4
              border-t
              border-[var(--color-border)]
              pt-5
            "
          >
            <Row
              label="Subtotal"
              value={money(order.subtotal)}
            />

            {order.service_charge_enabled && (
              <Row
                label={
                  order.service_charge_type ===
                  "percentage"
                    ? `Service Charge (${order.service_charge_value}%)`
                    : "Service Charge"
                }
                value={money(
                  order.service_charge
                )}
              />
            )}

            {order.gst_enabled && (
              <Row
                label={`GST (${order.gst_percent}%)`}
                value={money(
                  order.gst_amount
                )}
              />
            )}

            {Number(order.round_off) !==
              0 && (
              <Row
                label="Round Off"
                value={money(
                  order.round_off
                )}
              />
            )}

            <div className="border-t border-[var(--color-border)] pt-4">

              <Row
                label="Total"
                value={money(order.total)}
                bold
              />

            </div>

          </div>
        )}
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">

      <span
        className={
          bold
            ? "font-semibold text-[var(--color-heading)]"
            : "text-sm text-[var(--color-text-muted)]"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "font-bold text-[var(--color-heading)]"
            : "font-semibold"
        }
      >
        {value}
      </span>

    </div>
  );
}