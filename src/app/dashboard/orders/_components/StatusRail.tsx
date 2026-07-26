import Link from "next/link";
import {
  Search,
  Clock3,
  ChefHat,
  CheckCircle2,
  LayoutList,
} from "lucide-react";
import type { StatusTabValue } from "./order-types";
import { buildOrdersHref } from "./order-utils";

type Props = {
  activeStatus: StatusTabValue;
  searchQuery: string;
  counts: Record<StatusTabValue, number>;
  activeOrders: number;
  newOrders: number;
  revenue: number;
  requiresReadyStage: boolean;
};

const advancedItems = [
  {
    label: "New Orders",
    value: "pending",
    icon: Clock3,
  },
  {
    label: "Preparing",
    value: "preparing",
    icon: ChefHat,
  },
  {
    label: "Ready",
    value: "ready",
    icon: CheckCircle2,
  },
  {
    label: "All Orders",
    value: "all",
    icon: LayoutList,
  },
] as const;

const simpleItems = [
  {
    label: "New Orders",
    value: "pending",
    icon: Clock3,
  },
  {
    label: "Preparing",
    value: "preparing",
    icon: ChefHat,
  },
  {
    label: "All Orders",
    value: "all",
    icon: LayoutList,
  },
] as const;

const badgeStyles = {
  pending:
    "bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",

  preparing:
    "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",

  ready:
    "bg-[var(--color-success-soft)] text-[var(--color-success)] border border-[var(--color-success-border)]",

  all:
    "bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
};

export default function StatusRail({
  activeStatus,
  searchQuery,
  counts,
  activeOrders,
  newOrders,
  revenue,
  requiresReadyStage,
}: Props) {
  const items = requiresReadyStage
    ? advancedItems
    : simpleItems;

  return (
    <aside className="flex flex-col gap-4">
      <div
        className="
          rounded-3xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          p-5
          shadow-[var(--shadow-sm)]
        "
      >
        {/* Active Orders */}
        <div
          className="
            rounded-3xl
            border
            border-[var(--color-border)]
            bg-[var(--color-primary-soft)]
            p-5
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[var(--color-text-muted)]
            "
          >
            Active Orders
          </p>

          <h2
            className="
              mt-2
              text-5xl
              font-black
              tracking-tight
              text-[var(--color-heading)]
            "
          >
            {activeOrders}
          </h2>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div
            className="
              rounded-2xl
              border
              border-[var(--color-success-border)]
              bg-[var(--color-success-soft)]
              p-4
            "
          >
            <p
              className="
                text-xs
                font-medium
                text-[var(--color-text-muted)]
              "
            >
              New Orders
            </p>

            <p
              className="
                mt-1
                text-2xl
                font-black
                text-[var(--color-success)]
              "
            >
              {newOrders}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-[var(--color-surface-soft)]
              p-4
            "
          >
            <p
              className="
                text-xs
                font-medium
                text-[var(--color-text-muted)]
              "
            >
              Revenue
            </p>

            <p
              className="
                mt-1
                text-2xl
                font-black
                text-[var(--color-heading)]
              "
            >
              ₹{revenue}
            </p>
          </div>
        </div>

        {/* Search */}
        <form className="mt-5">
          <div
            className="
              flex
              h-12
              items-center
              gap-3
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-[var(--color-surface-soft)]
              px-4
              transition-colors
              focus-within:border-[var(--color-primary)]
            "
          >
            <Search
              className="
                size-4
                text-[var(--color-text-soft)]
              "
            />

            <input
              name="q"
              defaultValue={searchQuery}
              placeholder="Search orders..."
              className="
                h-full
                flex-1
                bg-transparent
                text-sm
                text-[var(--color-text)]
                placeholder:text-[var(--color-text-soft)]
                outline-none
              "
            />
          </div>
        </form>

        <div
          className="
            my-5
            h-px
            bg-[var(--color-border)]
          "
        />

        {/* Navigation */}
        <div className="space-y-2">
          {items.map((item) => {
            const active =
              activeStatus === item.value;

            const Icon = item.icon;

            return (
              <Link
                key={item.value}
                href={buildOrdersHref({
                  status: item.value,
                  q: searchQuery,
                })}
                className={`
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  px-4
                  py-3
                  transition-all
                  ${
                    active
                      ? `
                        bg-[var(--color-primary-soft)]
                        text-[var(--color-primary)]
                        shadow-[var(--shadow-sm)]
                      `
                      : `
                        text-[var(--color-text-muted)]
                        hover:bg-[var(--color-surface-hover)]
                      `
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-4" />

                  <span className="text-sm font-semibold">
                    {item.label}
                  </span>
                </div>

                <span
                  className={`
                    rounded-full
                    px-2.5
                    py-1
                    text-xs
                    font-bold
                    ${
                      badgeStyles[
                        item.value as keyof typeof badgeStyles
                      ]
                    }
                  `}
                >
                  {counts[item.value]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}