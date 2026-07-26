"use client";

import {
  BadgeHelp,
  CreditCard,
  Droplets,
  MessageSquareMore,
  Phone,
  UserRound,
  Utensils,
  CheckCircle2
} from "lucide-react";

type Props = {
  restaurantPhone?: string | null;
  requestingBill: boolean;
  billRequested: boolean;
  onRequestBill: () => void;
  requestingKey: string | null;
  requestedTypes: Record<string, number>;
  onRequest: (type: string) => void;
};

const actions = [
  {
    label: "Water",
    value: "water",
    icon: Droplets,
  },
  {
    label: "Spoon",
    value: "spoon",
    icon: Utensils,
  },
  {
    label: "Fork",
    value: "fork",
    icon: Utensils,
  },
  {
    label: "Tissue",
    value: "tissue",
    icon: BadgeHelp,
  },
  {
    label: "Waiter",
    value: "waiter",
    icon: UserRound,
  },
  {
    label: "Other",
    value: "other",
    icon: MessageSquareMore,
  },
];

export default function SessionActions({
  restaurantPhone,
  requestingBill,
  billRequested,
  onRequestBill,
  requestingKey,
  requestedTypes,
  onRequest,
}: Props) {
  return (
    <section className="rounded-[28px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.012))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">

      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-gold)]">
        Dining Session
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Need Assistance?
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

        {actions.map((action) => {

          const Icon = action.icon;

          const requested = Boolean(
  requestedTypes[action.value]
);

          const loading =
            requestingKey === action.value;

          return (
            <button
              key={action.value}
              type="button"
              disabled={loading || requested}
              onClick={() =>
                onRequest(action.value)
              }
              className="flex h-24 flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02] transition hover:border-[var(--color-border-gold)] disabled:opacity-50"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-gold)]/10">
                <Icon className="h-5 w-5 text-[var(--color-gold)]" />
              </div>

              <div className="flex items-center gap-1 text-sm font-bold">
  {loading ? (
    "Sending..."
  ) : requested ? (
    <>
      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
      Requested
    </>
  ) : (
    action.label
  )}
</div>
            </button>
          );

        })}

      </div>

      <div
  className="
    fixed
    bottom-0
    left-0
    right-0
    z-50
    border-t
    border-white/[0.08]
    bg-[var(--color-bg)]/95
    backdrop-blur-xl
    px-4
    py-3
    md:static
    md:bg-transparent
    md:border-0
    md:backdrop-blur-none
    md:px-0
    md:py-0
  "
>
  <div className="mx-auto max-w-5xl grid grid-cols-2 gap-3 sm:pt-5">

    {restaurantPhone ? (
      <a
        href={`tel:${restaurantPhone}`}
        className="
          flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-white/[0.08]
          bg-white/[0.03]
          text-sm
          font-semibold
          transition
          hover:border-[var(--color-border-gold)]
        "
      >
        <Phone className="h-4 w-4" />
        <span>Call</span>
      </a>
    ) : (
      <div
        className="
          flex
          h-11
          items-center
          justify-center
          rounded-xl
          border
          border-white/[0.08]
          bg-white/[0.03]
          text-sm
          text-[var(--color-text-muted)]
        "
      >
        Call
      </div>
    )}

    <button
  type="button"
  disabled={requestingBill || billRequested}
  onClick={billRequested ? undefined : onRequestBill}
  className={`
    flex
    h-11
    items-center
    justify-center
    gap-2
    rounded-xl
    text-sm
    font-semibold
    transition

    ${
      billRequested
        ? "bg-emerald-600 text-white"
        : "bg-[var(--color-gold)] text-[var(--color-bg)] hover:brightness-110"
    }

    disabled:cursor-default
    disabled:opacity-80
  `}
>
  {billRequested ? (
    <>
      <CheckCircle2 className="h-4 w-4" />
      Bill Requested
    </>
  ) : requestingBill ? (
    <>
      <CreditCard className="h-4 w-4 animate-pulse" />
      Requesting...
    </>
  ) : (
    <>
      <CreditCard className="h-4 w-4" />
      Request Bill
    </>
  )}
</button>


  </div>
  {billRequested && (
  <p className="mt-2 text-center text-xs text-emerald-400">
    ✓ Restaurant has been notified.
  </p>
)}
</div>

    </section>
  );
}