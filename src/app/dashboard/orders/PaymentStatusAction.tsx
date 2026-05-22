"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";

type PaymentStatus = "pending" | "paid";

type Props = {
  orderId: string;
  currentPaymentStatus: PaymentStatus | string;
};

export default function PaymentStatusActions({
  orderId,
  currentPaymentStatus,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isPaid = currentPaymentStatus === "paid";

  const markPaid = async () => {
    if (isPaid || loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/dashboard/orders/payment", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          paymentStatus: "paid",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.error || "Failed to update payment.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("PAYMENT UPDATE ERROR:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (isPaid) {
    return (
      <span className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-2xl border border-green-500/25 bg-green-500/10 px-3 text-xs font-bold uppercase tracking-[0.14em] text-green-200">
        <CheckCircle2 className="size-4" />
        Paid
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={markPaid}
      disabled={loading}
      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 px-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-gold)] transition hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] disabled:pointer-events-none disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <CreditCard className="size-4" />
      )}

      {loading ? "Updating" : "Mark Paid"}
    </button>
  );
}