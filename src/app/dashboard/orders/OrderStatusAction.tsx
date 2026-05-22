"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Timer,
  Utensils,
  X,
  XCircle,
} from "lucide-react";

type OrderStatus = "pending" | "preparing" | "ready" | "served" | "cancelled";

type Props = {
  orderId: string;
  currentStatus: OrderStatus;
};

const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  if (currentStatus === "pending") return ["preparing", "cancelled"];
  if (currentStatus === "preparing") return ["ready", "served", "cancelled"];
  if (currentStatus === "ready") return ["served", "cancelled"];

  return [];
};

const statusLabel: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Start Preparing",
  ready: "Mark Ready",
  served: "Mark Served",
  cancelled: "Cancel",
};

const statusIcon: Record<
  OrderStatus,
  React.ComponentType<{ className?: string }>
> = {
  preparing: Timer,
  ready: CheckCircle2,
  served: Utensils,
  cancelled: XCircle,
  pending: Timer,
};

export default function OrderStatusActions({
  orderId,
  currentStatus,
}: Props) {
  const router = useRouter();

  const [loadingStatus, setLoadingStatus] = useState<OrderStatus | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const nextStatuses = getNextStatuses(currentStatus);

  const updateStatus = async (status: OrderStatus, reason?: string) => {
    if (status === currentStatus || loadingStatus) return;

    setLoadingStatus(status);
    setErrorMessage("");

    try {
      const response = await fetch("/api/dashboard/orders/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status,
          cancelReason: reason,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Failed to update status.");
        return;
      }

      setCancelModalOpen(false);
      setCancelReason("");

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoadingStatus(null);
    }
  };

  const handleStatusClick = (status: OrderStatus) => {
    if (status === "cancelled") {
      setCancelModalOpen(true);
      setErrorMessage("");
      return;
    }

    updateStatus(status);
  };

  const confirmCancel = () => {
    const reason = cancelReason.trim();

    if (!reason) {
      setErrorMessage("Cancellation reason is required.");
      return;
    }

    updateStatus("cancelled", reason);
  };

  const closeCancelModal = () => {
    if (loadingStatus) return;

    setCancelModalOpen(false);
    setCancelReason("");
    setErrorMessage("");
  };

  if (!nextStatuses.length) return null;

  const primaryStatuses = nextStatuses.filter(
    (status) => status !== "cancelled"
  );
  const cancelStatus = nextStatuses.find((status) => status === "cancelled");

  return (
    <>
      <div className="space-y-2">
        <div className="grid gap-2">
          {primaryStatuses.map((status) => {
            const Icon = statusIcon[status];

            return (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusClick(status)}
                disabled={loadingStatus !== null}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--color-bg)] shadow-[0_14px_34px_rgba(211,181,74,0.16)] transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
              >
                {loadingStatus === status ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Icon className="size-4" />
                )}

                {loadingStatus === status ? "Updating..." : statusLabel[status]}
              </button>
            );
          })}
        </div>

        {cancelStatus && (
          <button
            type="button"
            onClick={() => handleStatusClick(cancelStatus)}
            disabled={loadingStatus !== null}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 text-xs font-bold uppercase tracking-[0.14em] text-red-200 transition hover:border-red-500/45 hover:bg-red-500/15 disabled:pointer-events-none disabled:opacity-50"
          >
            {loadingStatus === "cancelled" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <XCircle className="size-4" />
            )}

            {loadingStatus === "cancelled" ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>

      {cancelModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/75 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0">
          <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-red-500/20 bg-[var(--color-surface)] shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
            <div className="flex items-start justify-between gap-4 border-b border-red-500/15 bg-red-500/[0.06] p-5">
              <div className="flex min-w-0 gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-300">
                  <AlertTriangle className="size-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-300">
                    Confirm Cancellation
                  </p>

                  <h2 className="mt-1 font-heading text-2xl font-normal">
                    Cancel this order?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                    Add a reason so the cancellation is clear in history.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCancelModal}
                disabled={loadingStatus !== null}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition hover:text-white disabled:opacity-40"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-300">
                Cancellation Reason
              </label>

              <textarea
                value={cancelReason}
                onChange={(e) => {
                  setCancelReason(e.target.value);
                  setErrorMessage("");
                }}
                rows={4}
                placeholder="Example: Customer requested cancellation..."
                className="mt-2 w-full resize-none rounded-2xl border border-[var(--color-border)] bg-black/30 px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-soft)] focus:border-red-400/50"
              />

              {errorMessage && (
                <div className="mt-3 flex gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={loadingStatus !== null}
                  onClick={closeCancelModal}
                  className="min-h-12 rounded-2xl border border-[var(--color-border)] px-4 text-sm font-bold text-[var(--color-text-muted)] transition hover:text-white disabled:opacity-40"
                >
                  Keep Order
                </button>

                <button
                  type="button"
                  disabled={loadingStatus !== null}
                  onClick={confirmCancel}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 text-sm font-bold text-white transition hover:bg-red-400 disabled:opacity-40"
                >
                  {loadingStatus === "cancelled" && (
                    <Loader2 className="size-4 animate-spin" />
                  )}

                  {loadingStatus === "cancelled"
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}