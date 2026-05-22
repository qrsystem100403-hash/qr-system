"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

type Props = {
  activeCount: number;
  historyCount: number;
  cancelledCount: number;
};

export default function OrdersTabs({
  activeCount,
  historyCount,
  cancelledCount,
}: Props) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Active",
      href: "/dashboard/orders",
      count: activeCount,
      active: pathname === "/dashboard/orders",
      icon: Clock3,
      danger: false,
    },
    {
      label: "History",
      href: "/dashboard/orders/history",
      count: historyCount,
      active: pathname === "/dashboard/orders/history",
      icon: CheckCircle2,
      danger: false,
    },
    {
      label: "Cancelled",
      href: "/dashboard/orders/cancelled",
      count: cancelledCount,
      active: pathname === "/dashboard/orders/cancelled",
      icon: XCircle,
      danger: true,
    },
  ];

  return (
    <div className="mt-5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-xs font-extrabold uppercase tracking-[0.14em] transition ${
                tab.active
                  ? tab.danger
                    ? "border-red-500/40 bg-red-500/15 text-red-200"
                    : "border-[var(--color-border-gold)] bg-[var(--color-gold)] text-[var(--color-bg)]"
                  : "border-[var(--color-border)] bg-black/20 text-[var(--color-text-muted)] hover:border-[var(--color-border-gold)] hover:text-[var(--color-gold)]"
              }`}
            >
              <Icon className="size-4 shrink-0" />

              <span>{tab.label}</span>

              <span
                className={`grid min-w-6 place-items-center rounded-full px-2 py-0.5 text-[11px] font-black ${
                  tab.active
                    ? tab.danger
                      ? "bg-red-500/20 text-red-100"
                      : "bg-black/20 text-[var(--color-bg)]"
                    : "bg-white/5 text-[var(--color-text)]"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}