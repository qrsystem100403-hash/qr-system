import {
  Activity,
  Clock3,
  Table2,
  UtensilsCrossed,
} from "lucide-react";

import DashboardCard from "../ui/DashboardCard";

type Props = {
  restaurantName: string;
  activeOrders: number;
  pendingOrders: number;
  activeTables: number;
};

export default function DashboardHero({
  restaurantName,
  activeOrders,
  pendingOrders,
  activeTables,
}: Props) {
  return (
    <DashboardCard className="overflow-hidden p-0">
      <div className="grid xl:grid-cols-[1.2fr_.8fr]">

        {/* LEFT */}

        <div className="p-8">

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[var(--color-primary-soft)]
              "
            >
              <Activity
                className="
                  size-8
                  text-[var(--color-primary)]
                "
              />
            </div>

            <div>

              <p className="text-sm text-[var(--color-text-muted)]">
                Restaurant Pulse
              </p>

              <h1
                className="
                  mt-1
                  text-3xl
                  font-bold
                "
              >
                {restaurantName}
              </h1>

              <div
                className="
                  mt-3
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[var(--color-success-soft)]
                  px-3
                  py-1
                  text-sm
                  font-medium
                  text-[var(--color-success)]
                "
              >
                <span className="size-2 rounded-full bg-current" />
                All systems operational
              </div>

            </div>

          </div>

          <p
            className="
              mt-6
              max-w-2xl
              text-sm
              leading-7
              text-[var(--color-text-muted)]
            "
          >
            Monitor orders, kitchen activity,
            QR tables and restaurant performance
            from one place.
          </p>

        </div>

        {/* RIGHT */}

        <div
          className="
            grid
            grid-cols-2
            border-l
            border-[var(--color-border)]
          "
        >

          <StatusCard
            icon={UtensilsCrossed}
            value={activeOrders}
            label="Active Orders"
          />

          <StatusCard
            icon={Clock3}
            value={pendingOrders}
            label="Waiting"
          />

          <StatusCard
            icon={Table2}
            value={activeTables}
            label="Tables"
          />

          <StatusCard
            icon={Activity}
            value="Live"
            label="Restaurant"
          />

        </div>

      </div>
    </DashboardCard>
  );
}

function StatusCard({
  icon: Icon,
  value,
  label,
}: {
  icon: any;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        gap-2
        border-b
        border-r
        border-[var(--color-border)]
        p-6
      "
    >
      <Icon
        className="
          size-6
          text-[var(--color-primary)]
        "
      />

      <div
        className="
          text-3xl
          font-bold
        "
      >
        {value}
      </div>

      <p
        className="
          text-sm
          text-[var(--color-text-muted)]
        "
      >
        {label}
      </p>
    </div>
  );
}