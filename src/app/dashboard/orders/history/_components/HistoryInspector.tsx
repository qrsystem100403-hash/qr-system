import {
  Calendar,
  CheckCircle2,
  CreditCard,
  FileText,
  Phone,
  ReceiptText,
  Table2,
  User,
  XCircle,
} from "lucide-react";
import type { Order } from "../../_components/order-types";

type Props = {
  order: Order | null;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function HistoryInspector({
  order,
}: Props) {
  if (!order) {
    return (
      <div className="flex h-full items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="text-center">
          <ReceiptText className="mx-auto size-12 text-[var(--color-text-soft)]" />
          <h3 className="mt-4 text-lg font-semibold text-[var(--color-heading)]">
            No Order Selected
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Select an order to view its details.
          </p>
        </div>
      </div>
    );
  }

  const completed = order.order_status === "served";

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* Header */}

      <div className="border-b border-[var(--color-border)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
              Order
            </p>

            <h2 className="mt-2 text-xl font-bold text-[var(--color-heading)]">
              #{order.id.slice(0, 8)}
            </h2>

            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Calendar className="size-4" />
              {formatDate(order.created_at)}
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
              completed
                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {completed ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <XCircle className="size-4" />
            )}

            {completed ? "Completed" : "Cancelled"}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">

        {/* Customer */}

        <section className="rounded-2xl border border-[var(--color-border)] p-4">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-heading)]">
            Customer
          </h3>

          <div className="space-y-3">

            <Row
              icon={<User className="size-4" />}
              label="Name"
              value={order.customer_name || "Walk-in Customer"}
            />

            <Row
              icon={<Phone className="size-4" />}
              label="Phone"
              value={order.customer_phone || "-"}
            />

            <Row
              icon={<Table2 className="size-4" />}
              label="Table"
              value={order.table_name || "-"}
            />
          </div>
        </section>

        {/* Items */}

        <section className="rounded-2xl border border-[var(--color-border)] p-4">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-heading)]">
            Ordered Items
          </h3>

          <div className="space-y-3">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-[var(--color-surface-soft)] p-3"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-[var(--color-heading)]">
                      {item.item_name}
                    </p>

                    {item.variant_name && (
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {item.variant_name}
                      </p>
                    )}

                    {item.order_item_addons.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {item.order_item_addons.map((addon) => (
                          <p
                            key={addon.id}
                            className="text-xs text-[var(--color-text-muted)]"
                          >
                            • {addon.addon_name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      ×{item.qty}
                    </p>

                    <p className="text-sm text-[var(--color-text-muted)]">
                      ₹{item.item_price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment */}

        <section className="rounded-2xl border border-[var(--color-border)] p-4">
  <h3 className="mb-4 text-sm font-semibold text-[var(--color-heading)]">
    Payment Summary
  </h3>

  <div className="space-y-3">

    <Row
      icon={<CreditCard className="size-4" />}
      label="Payment Status"
      value={order.payment_status}
    />

    <div className="my-2 h-px bg-[var(--color-border)]" />

    <Row
      icon={<ReceiptText className="size-4" />}
      label="Subtotal"
      value={`₹${Number(order.subtotal).toFixed(2)}`}
    />

    {order.service_charge_enabled && (
      <Row
        icon={<ReceiptText className="size-4" />}
        label={
          order.service_charge_type === "percentage"
            ? `Service Charge (${Number(order.service_charge_value)}%)`
            : "Service Charge"
        }
        value={`₹${Number(order.service_charge).toFixed(2)}`}
      />
    )}

    {order.gst_enabled && (
      <Row
        icon={<ReceiptText className="size-4" />}
        label={
          order.gst_mode === "inclusive"
            ? `GST Included (${Number(order.gst_percent)}%)`
            : `GST (${Number(order.gst_percent)}%)`
        }
        value={`₹${Number(order.gst_amount).toFixed(2)}`}
      />
    )}

    {Number(order.round_off) !== 0 && (
      <Row
        icon={<ReceiptText className="size-4" />}
        label="Round Off"
        value={`₹${Number(order.round_off).toFixed(2)}`}
      />
    )}

    <div className="h-px bg-[var(--color-border)]" />

    <div className="flex items-center justify-between">
      <span className="text-base font-semibold text-[var(--color-heading)]">
        Grand Total
      </span>

      <span className="text-xl font-bold text-[var(--color-primary)]">
        ₹{Number(order.total).toFixed(2)}
      </span>
    </div>

  </div>
</section>

        {order.customer_note && (
          <section className="rounded-2xl border border-[var(--color-border)] p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <FileText className="size-4" />
              Customer Note
            </h3>

            <p className="text-sm leading-6 text-[var(--color-text-muted)]">
              {order.customer_note}
            </p>
          </section>
        )}

        {order.cancel_reason && (
          <section className="rounded-2xl border border-red-300 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-300">
              <XCircle className="size-4" />
              Cancellation Reason
            </h3>

            <p className="text-sm leading-6 text-red-600 dark:text-red-300">
              {order.cancel_reason}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
        {icon}
        <span>{label}</span>
      </div>

      <span className="text-right font-medium text-[var(--color-heading)]">
        {value}
      </span>
    </div>
  );
}