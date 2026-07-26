import Link from "next/link";
import {
  Search,
  ReceiptText,
  CheckCircle2,
  XCircle,
  Banknote,
  History,
} from "lucide-react";
import { buildHistoryHref } from "../history-utils";

export type HistoryTab =
  | "all"
  | "served"
  | "cancelled";

type Props = {
  activeStatus: HistoryTab;
  searchQuery: string;
  completedOrders: number;
  cancelledOrders: number;
  revenue: number;
};

const filters = [
  {
    value: "all",
    label: "All Orders",
    icon: ReceiptText,
  },
  {
    value: "served",
    label: "Completed",
    icon: CheckCircle2,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
  },
] as const;

export default function HistoryRail({
  activeStatus,
  searchQuery,
  completedOrders,
  cancelledOrders,
  revenue,
}: Props) {
  return (
    <aside className="flex h-full flex-col overflow-hidden">
      <div
  className="
    flex-1
    overflow-y-auto
    rounded-[var(--radius-xl)]
    border
    border-[var(--color-border)]
    bg-[var(--color-surface)]
    p-5
    shadow-[var(--shadow-sm)]
  "
>
        {/* Header */}

        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-[var(--radius-lg)]
              bg-[var(--color-primary-soft)]
              text-[var(--color-primary)]
            "
          >
            <History className="size-6" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
              Archive
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[var(--color-heading)]">
              Overview
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Completed & cancelled orders
            </p>
          </div>
        </div>

        {/* Stats */}

<div className="mt-6 space-y-3">

  <div className="grid grid-cols-2 gap-3">
    <StatCard
      title="Completed"
      value={completedOrders}
      icon={<CheckCircle2 className="size-5 text-emerald-600" />}
    />

    <StatCard
      title="Cancelled"
      value={cancelledOrders}
      icon={<XCircle className="size-5 text-red-500" />}
    />
  </div>

  <RevenueCard
    value={revenue}
  />

</div>

        {/* Search */}

        <form className="mt-6">
          <div
            className="
              flex
              h-12
              items-center
              gap-3
              rounded-[var(--radius-lg)]
              border
              border-[var(--color-border)]
              bg-[var(--color-surface-soft)]
              px-4
            "
          >
            <Search className="size-4 text-[var(--color-text-soft)]" />

            <input
              name="q"
              defaultValue={searchQuery}
              placeholder="Search history..."
              className="
                h-full
                flex-1
                bg-transparent
                text-sm
                outline-none
                placeholder:text-[var(--color-text-soft)]
              "
            />
          </div>
        </form>

        <div className="my-6 h-px bg-[var(--color-border)]" />

        {/* Filters */}

        <nav className="space-y-2">
          {filters.map((item) => {
            const active =
              activeStatus === item.value;

            const count =
              item.value === "all"
                ? completedOrders + cancelledOrders
                : item.value === "served"
                  ? completedOrders
                  : cancelledOrders;

            const Icon = item.icon;

            return (
              <Link
                key={item.value}
                href={buildHistoryHref({
                  status: item.value,
                  q: searchQuery,
                })}
                className={`
                  flex
                  items-center
                  justify-between
                  rounded-[var(--radius-lg)]
                  px-4
                  py-3
                  transition-all

                  ${
                    active
                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "hover:bg-[var(--color-surface-soft)]"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-4" />

                  <span className="font-medium">
                    {item.label}
                  </span>
                </div>

                <span
                  className="
                    rounded-full
                    bg-[var(--color-surface-soft)]
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                  "
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface-soft)]
        px-2
        py-2.5
        text-center
      "
    >
      <div
        className="
          mb-1.5
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
        "
      >
        {icon}
      </div>

      <h3
        className="
          text-2xl
          font-bold
          leading-none
          text-[var(--color-heading)]
        "
      >
        {value}
      </h3>

      <p
        className="
          mt-1
          text-[11px]
          font-medium
          leading-none
          text-[var(--color-text-muted)]
        "
      >
        {title}
      </p>
    </div>
  );
}

function RevenueCard({
  value,
}: {
  value: number;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-[var(--radius-lg)]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface-soft)]
        px-4
        py-3
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            bg-[var(--color-primary-soft)]
            text-[var(--color-primary)]
          "
        >
          <Banknote className="size-5" />
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
            Revenue
          </p>

          <p className="text-lg font-bold text-[var(--color-heading)]">
            ₹{value.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}