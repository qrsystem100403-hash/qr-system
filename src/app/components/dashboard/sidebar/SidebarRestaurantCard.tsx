import { User, Circle } from "lucide-react";
import DashboardCard from "../ui/DashboardCard";
import DashboardBadge from "../ui/DashboardBadge";

type Props = {
  fullName: string;
  role: string;
};

export default function SidebarRestaurantCard({
  fullName,
  role,
}: Props) {

  const ROLE_BADGE: Record<
  string,
  "warning" | "info" | "success" | "danger" | "neutral"
> = {
  owner: "warning",
  manager: "info",
  cashier: "success",
  kitchen: "danger",
  waiter: "neutral",
};
  return (
    <DashboardCard
      hover
      className="
        overflow-hidden
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-5
        transition-all
        duration-300
        hover:-translate-y-0.5
      "
    >
      <div className="flex items-start gap-4">
        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-[var(--color-primary-soft)]
            text-[var(--color-primary)]
          "
        >
          <User className="size-7" />
        </div>

        <div className="min-w-0 flex-1">

          <h2
  className="
    text-[16px]
    font-semibold
    leading-5
    text-[var(--color-heading)]
    break-words
    line-clamp-2
  "
>
  {fullName}
</h2>

          <div className="mt-3 flex items-center gap-2">

            <DashboardBadge
  variant={ROLE_BADGE[role] ?? "neutral"}
  className="px-2.5 py-0.5 text-[10px] uppercase tracking-wide"
>
  {role.charAt(0).toUpperCase() + role.slice(1)}
</DashboardBadge>

            <div
              className="
                flex
                items-center
                gap-1
                rounded-full
                bg-emerald-500/10
                px-2
                py-0.5
                text-[10px]
                font-medium
                text-emerald-600
              "
            >
              <Circle className="size-2 fill-current stroke-none" />
              Online
            </div>

          </div>

        </div>
      </div>
    </DashboardCard>
  );
}