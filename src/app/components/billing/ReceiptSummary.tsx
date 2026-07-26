import type { ReceiptSettings } from "./receipt-types";

type Props = {
  settings: ReceiptSettings;
  totals: {
    subtotal: number;
    gstAmount: number;
    serviceChargeAmount: number;
    roundOff: number;
    grandTotal: number;
  };
};

export default function ReceiptSummary({
  settings,
  totals,
}: Props) {
  return (
    <section className="mt-4 border-t border-dashed border-neutral-300 pt-3">

      <MoneyRow
        label="Subtotal"
        value={totals.subtotal}
      />

      {settings.gstEnabled &&
        totals.gstAmount > 0 && (
          <MoneyRow
            label={
              settings.gstMode === "inclusive"
                ? `GST Included (${settings.gstPercent}%)`
                : `GST (${settings.gstPercent}%)`
            }
            value={totals.gstAmount}
          />
        )}

      {settings.serviceChargeEnabled &&
        totals.serviceChargeAmount > 0 && (
          <MoneyRow
            label={
              settings.serviceChargeType ===
              "percentage"
                ? `Service Charge (${settings.serviceChargeValue}%)`
                : "Service Charge"
            }
            value={totals.serviceChargeAmount}
          />
        )}

      {settings.roundOffEnabled && (
  <MoneyRow
    label="Round Off"
    value={totals.roundOff}
  />
)}

      <div className="my-3 border-t-2 border-dashed border-neutral-500" />

      <div className="flex items-center justify-between">

        <span className="text-[13px] font-black uppercase tracking-wide">
          GRAND TOTAL
        </span>

        <span className="text-[20px] font-black">
          ₹{totals.grandTotal.toFixed(2)}
        </span>

      </div>

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
  const formatted =
    value < 0
      ? `-₹${Math.abs(value).toFixed(2)}`
      : `₹${value.toFixed(2)}`;

  return (
    <div className="flex items-center justify-between py-1 text-[11px] leading-5">

      <span className="text-neutral-700">
        {label}
      </span>

      <span className="font-semibold tabular-nums">
        {formatted}
      </span>

    </div>
  );
}