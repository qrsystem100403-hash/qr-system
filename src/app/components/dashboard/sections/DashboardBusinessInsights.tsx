import {
  Clock3,
  IndianRupee,
  ShoppingBag,
  XCircle,
} from "lucide-react";

import DashboardCard from "../ui/DashboardCard";
import RadialProgress from "../charts/RadiaProgress";

type Props = {
  averageOrderValue: number;
  completionRate: number;
  cancelledToday: number;
  peakHour: string;

  bestSellingItem: {
    name: string;
    image: string | null;
    sold: number;
  } | null;
};

export default function DashboardBusinessInsights({
  averageOrderValue,
  completionRate,
  cancelledToday,
  peakHour,
  bestSellingItem,
}: Props){
  return (
    <DashboardCard className="h-full">

      <div className="mb-3">

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
          Analytics
        </p>

        <h2 className="mt-0.5 text-lg font-bold text-[var(--color-heading)]">
          Business Insights
        </h2>

        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          Today's operational summary
        </p>

      </div>

      <div className="space-y-4">

  <div
    className="
      rounded-3xl
      border
      border-[var(--color-border)]
      bg-[var(--color-surface-soft)]
      p-3
    "
  >
    <div className="flex items-center justify-center">
      <RadialProgress
  value={completionRate}
  size={96}
  strokeWidth={8}
/>
    </div>

    <div className="mt-3 grid grid-cols-2 gap-3">

      <div
        className="
          rounded-2xl
          bg-[var(--color-surface)]
          p-3
        "
      >
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
          Avg Order
        </p>

        <p className="mt-0.5 text-lg font-bold text-[var(--color-heading)]">
          ₹{averageOrderValue}
        </p>
      </div>

      <div
        className="
          rounded-2xl
          bg-[var(--color-surface)]
          p-3
        "
      >
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
          Cancelled
        </p>

        <p className="mt-0.5 text-lg font-bold text-[var(--color-danger)]">
          {cancelledToday}
        </p>
      </div>

    </div>

  </div>

        

        

        <InsightRow
          icon={Clock3}
          label="Peak Hour"
          value={peakHour}
        />

        

        {/* Best Seller */}

<div
  className="
    mt-5
    overflow-hidden
    rounded-3xl
    border
    border-[var(--color-border)]
    bg-[var(--color-surface-soft)]
  "
>

  <div className="relative h-32">

    {bestSellingItem?.image ? (

      <img
        src={bestSellingItem.image}
        alt={bestSellingItem.name}
        className="h-full w-full object-cover"
      />

    ) : (

      <div
        className="
          flex
          h-full
          items-center
          justify-center
          bg-gradient-to-br
          from-[var(--color-primary-soft)]
          to-[var(--color-surface)]
        "
      >

        <ShoppingBag
          className="
            size-14
            text-[var(--color-primary)]
          "
        />

      </div>

    )}

    <div
      className="
        absolute
        inset-x-0
        bottom-0
        bg-gradient-to-t
        from-black/75
        via-black/30
        to-transparent
        p-3
      "
    >

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
        Today's Best Seller
      </p>

      <h3 className="mt-0.5 text-lg font-bold text-white">
        {bestSellingItem?.name ?? "No Sales Yet"}
      </h3>

      <p className="mt-0.5 text-xs text-white/80">
        {bestSellingItem
          ? `${bestSellingItem.sold} orders sold`
          : "Waiting for today's first order"}
      </p>

    </div>

  </div>

</div>

      </div>

    </DashboardCard>
  );
}

function InsightRow({
  icon: Icon,
  label,
  value,
  danger = false,
}: {
  icon: any;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between

        rounded-2xl

        border

        border-[var(--color-border)]

        bg-[var(--color-surface-soft)]

        px-3
        py-2.5
      "
    >

      <div className="flex items-center gap-3">

        <div
          className={`
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl

            ${
              danger
                ? "bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
                : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
            }
          `}
        >
          <Icon className="size-4" />
        </div>

        <span className="text-xs font-medium text-[var(--color-heading)]">
          {label}
        </span>

      </div>

      <span className="text-base font-bold text-[var(--color-heading)]">
        {value}
      </span>

    </div>
  );
}