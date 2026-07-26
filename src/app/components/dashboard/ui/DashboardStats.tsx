import { LucideIcon } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { cn } from "@/lib/utils";

export type DashboardStat = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass?: string;
  description?: string;
};

type Props = {
  items: DashboardStat[];
  className?: string;
};

export default function DashboardStats({
  items,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "mb-8 grid gap-5",
        "grid-cols-1",
        "sm:grid-cols-2",
        "xl:grid-cols-4",
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <DashboardCard
            key={item.label}
            hover
            className="p-6"
          >
            <div className="flex items-start justify-between">

              <div className="min-w-0">

                <p
                  className="
                    text-sm
                    font-medium
                    text-[var(--color-text-muted)]
                  "
                >
                  {item.label}
                </p>

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    tracking-tight
                    text-[var(--color-heading)]
                  "
                >
                  {item.value}
                </h2>

                {item.description && (
                  <p
                    className="
                      mt-2
                      text-xs
                      text-[var(--color-text-soft)]
                    "
                  >
                    {item.description}
                  </p>
                )}

              </div>

              <div
                className={cn(
                  `
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--color-primary-soft)]
                  `,
                  item.colorClass
                )}
              >
                <Icon className="size-6 text-[var(--color-primary)]" />
              </div>

            </div>
          </DashboardCard>
        );
      })}
    </section>
  );
}