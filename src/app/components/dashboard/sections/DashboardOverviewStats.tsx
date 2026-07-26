import {
  IndianRupee,
  LayoutDashboard,
  ReceiptText,
  Table2,
  LucideIcon,
} from "lucide-react";
import DashboardCard from "../ui/DashboardCard";
import { cn } from "@/lib/utils";

type Props = {
  todayRevenue: number;
  activeOrders: number;
  totalOrders: number;
  activeTables: number;
};

type Stat = {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
};

export default function DashboardOverviewStats({
  todayRevenue,
  activeOrders,
  totalOrders,
  activeTables,
}: Props) {
  const stats: Stat[] = [
    {
      title: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString("en-IN")}`,
      subtitle: "Live earnings",
      icon: IndianRupee,
      color:
        "bg-[var(--color-success-soft)] text-[var(--color-success)]",
    },
    {
      title: "Active Orders",
      value: String(activeOrders),
      subtitle: "Currently processing",
      icon: LayoutDashboard,
      color:
        "bg-[var(--color-info-soft)] text-[var(--color-info)]",
    },
    {
      title: "Today's Orders",
      value: String(totalOrders),
      subtitle: "Orders received",
      icon: ReceiptText,
      color:
        "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    },
    {
      title: "Active Tables",
      value: String(activeTables),
      subtitle: "QR tables running",
      icon: Table2,
      color:
        "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
    },
  ];

  return (
    <section
      className="
        grid
        gap-5
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <DashboardCard
            key={item.title}
            hover
            className="group p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-muted)]">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-heading)]">
                  {item.value}
                </h2>

                <p className="mt-3 text-xs font-medium text-[var(--color-text-soft)]">
                  {item.subtitle}
                </p>
              </div>

              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
                  item.color
                )}
              >
                <Icon className="size-5" />
              </div>
            </div>
          </DashboardCard>
        );
      })}
    </section>
  );
}