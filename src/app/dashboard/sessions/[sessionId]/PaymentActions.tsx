"use client";

import { useState } from "react";
import {
  Banknote,
  Smartphone,
  CreditCard,
  CheckCircle2,
  Loader2,
  Printer,
  CircleDollarSign,
} from "lucide-react";
import PrintBillButton from "./PrintBillButton";

type PaymentMethod =
  | "cash"
  | "upi"
  | "card";

type Session = {
  id: string;
  payment_status: "pending" | "paid";
};

type Props = {
  session: Session;
};

export default function PaymentActions({
  session,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [printing, setPrinting] =
    useState(false);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<PaymentMethod>("cash");

  async function receivePayment() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/dashboard/sessions/${session.id}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            paymentMethod,
          }),
        },
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        alert(
          data.error ??
            "Payment failed.",
        );
        return;
      }

      location.reload();
    } finally {
      setLoading(false);
    }
  }

  async function completeSession() {
    if (
      !confirm(
        "Complete this dining session?",
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/dashboard/sessions/${session.id}/complete`,
        {
          method: "POST",
        },
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        alert(
          data.error ??
            "Unable to complete session.",
        );
        return;
      }

      window.location.href =
        "/dashboard/sessions";
    } finally {
      setLoading(false);
    }
  }

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
            <CircleDollarSign
              size={18}
              className="text-[var(--color-primary)]"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Payment
            </h2>

            <p className="text-sm text-[var(--color-text-muted)]">
              Collect payment and close
              the session.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3">
          <span className="text-sm text-[var(--color-text-muted)]">
            Status
          </span>

          <span
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              session.payment_status ===
              "paid"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {session.payment_status ===
            "paid"
              ? "Paid"
              : "Pending"}
          </span>
        </div>

        {session.payment_status !==
          "paid" && (
          <>
            <div>
              <p className="mb-3 text-sm font-medium">
                Payment Method
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    id: "cash",
                    label: "Cash",
                    icon: Banknote,
                  },
                  {
                    id: "upi",
                    label: "UPI",
                    icon: Smartphone,
                  },
                  {
                    id: "card",
                    label: "Card",
                    icon: CreditCard,
                  },
                ].map((method) => {
                  const Icon =
                    method.icon;

                  const active =
                    paymentMethod ===
                    method.id;

                  return (
                    <button
                      key={method.id}
                      onClick={() =>
                        setPaymentMethod(
                          method.id as PaymentMethod,
                        )
                      }
                      className={`rounded-lg border p-3 transition ${
                        active
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                          : "border-[var(--color-border)]"
                      }`}
                    >
                      <Icon
                        size={18}
                        className="mx-auto"
                      />

                      <p className="mt-2 text-sm font-medium">
                        {method.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              disabled={loading}
              onClick={
                receivePayment
              }
              className="
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-emerald-600
              text-sm
              font-medium
              text-white
              transition
              hover:bg-emerald-500
              disabled:opacity-50
              "
            >
              {loading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <CheckCircle2
                  size={18}
                />
              )}

              Receive Payment
            </button>
          </>
        )}

        <PrintBillButton
          className="
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-[var(--color-border)]
          text-sm
          font-medium
          transition
          hover:bg-[var(--color-background)]
          "
          disabled={printing}
          onBeforePrint={() =>
            setPrinting(true)
          }
          onAfterPrint={() =>
            setPrinting(false)
          }
        >
          {printing ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Printer size={18} />
          )}

          {printing
            ? "Printing..."
            : "Print Bill"}
        </PrintBillButton>

        <button
          disabled={
            loading ||
            session.payment_status !==
              "paid"
          }
          onClick={
            completeSession
          }
          className="
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-[var(--color-primary)]
          text-sm
          font-medium
          text-[var(--color-bg)]
          transition
          hover:brightness-105
          disabled:opacity-40
          "
        >
          <CheckCircle2
            size={18}
          />

          Complete Session
        </button>
      </div>
    </section>
  );
}