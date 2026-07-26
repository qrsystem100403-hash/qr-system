import {
  CheckCircle2,
  Clock3,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import DashboardCard from "../ui/DashboardCard";

export type Activity = {
  id: string;
  type: "pending" | "preparing" | "served" | "cancelled";
  title: string;
  subtitle: string;
  time: string;
};

type Props = {
  activities: Activity[];
};

export default function DashboardRecentActivity({
  activities,
}: Props) {
  return (
    <DashboardCard className="h-full flex flex-col">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-lg font-bold text-[var(--color-heading)]">
            Recent Activity
          </h2>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Last 5 updates
          </p>

        </div>

        <div className="flex items-center gap-2 rounded-full bg-[var(--color-primary-soft)] px-3 py-1">

          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
            Live
          </span>

        </div>

      </div>

      {/* Activities */}

      <div className="mt-5 flex-1">

        {activities.slice(0, 5).map((activity, index) => (
          <ActivityRow
            key={activity.id}
            activity={activity}
            last={index === 3}
          />
        ))}

      </div>

    </DashboardCard>
  );
}

function ActivityRow({
  activity,
  last,
}: {
  activity: Activity;
  last: boolean;
}) {
  const config = {
    pending: {
      icon: Clock3,
      bg: "bg-amber-100",
      text: "text-amber-600",
    },
    preparing: {
      icon: UtensilsCrossed,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    served: {
      icon: CheckCircle2,
      bg: "bg-emerald-100",
      text: "text-emerald-600",
    },
    cancelled: {
      icon: XCircle,
      bg: "bg-red-100",
      text: "text-red-600",
    },
  }[activity.type];

  const Icon = config.icon;

  return (
    <div
      className={`
        flex
        items-start
        gap-3
        py-3
        ${!last ? "border-b border-[var(--color-border)]" : ""}
      `}
    >

      <div
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${config.bg}
          ${config.text}
        `}
      >
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-center justify-between gap-3">

          <p className="truncate text-sm font-semibold text-[var(--color-heading)]">
            {activity.title}
          </p>

          <span className="shrink-0 text-[11px] font-medium text-[var(--color-text-soft)]">
            {activity.time}
          </span>

        </div>

        <p className="mt-1 truncate text-xs text-[var(--color-text-muted)]">
          {activity.subtitle}
        </p>

      </div>

    </div>
  );
}