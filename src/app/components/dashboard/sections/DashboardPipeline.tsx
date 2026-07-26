import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flame,
} from "lucide-react";


import DashboardCard from "../ui/DashboardCard";

type Stage = {
  key: string;
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
};

type Props = {
  stages: Stage[];
  activeOrders: number;
  bottleneck: string;
};

export default function DashboardPipeline({
  stages,
  activeOrders,
  bottleneck,
}: Props) {
  return (
    <DashboardCard className="h-full">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Live Workflow
            </span>

          </div>

          <h2 className="mt-2 text-xl font-bold text-[var(--color-heading)]">
            Kitchen Pipeline
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Monitor order movement across the kitchen.
          </p>

        </div>

        <div className="text-right">

          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
            Active Orders
          </p>

          <p className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
            {activeOrders}
          </p>

        </div>

      </div>

      {/* Workflow */}

      <div className="mt-8">

        <div className="flex items-center justify-between">

          {stages.map((stage, index) => (
            <div
              key={stage.key}
              className="flex flex-1 items-center "
            >

              <WorkflowNode stage={stage} />

              {index !== stages.length - 1 && (

                <div className="flex-1 px-3">

                  <ArrowRight
                    className="
                      h-5
                      w-full
                      text-[var(--color-border)]
                    "
                  />

                </div>

              )}

            </div>
          ))}

        </div>

      </div>

      {/* Footer */}

      <div
  className="
    mt-8
    rounded-2xl
    border
    border-[var(--color-border)]
    bg-[var(--color-surface-soft)]
    p-5
  "
>
  <div className="flex items-center justify-between">

    <div className="flex items-center gap-3">

      <div
        className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-2xl

          ${
            activeOrders === 0
              ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
              : stages[0].count > 0
              ? "bg-amber-100 text-amber-600"
              : "bg-blue-100 text-blue-600"
          }
        `}
      >

        {activeOrders === 0 ? (
          <CheckCircle2 className="size-5" />
        ) : (
          <Clock3 className="size-5" />
        )}

      </div>

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
          Current Status
        </p>

        <h3 className="mt-1 text-lg font-bold text-[var(--color-heading)]">

          {activeOrders === 0
            ? "Kitchen Running Smoothly"
            : stages[0].count > 0
            ? `${stages[0].count} Orders Waiting`
            : "Kitchen Preparing Orders"}

        </h3>

        <p className="mt-1 text-sm text-[var(--color-text-muted)]">

          {activeOrders === 0
            ? "No pending kitchen tasks."
            : stages[0].count > 0
            ? "New orders are waiting to be accepted."
            : "Orders are currently being prepared."}

        </p>

      </div>

    </div>

    <div className="text-right">

      <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
        Updated
      </p>

      <p className="mt-1 text-lg font-semibold text-[var(--color-heading)]">
        Just now
      </p>

    </div>

  </div>
</div>

    </DashboardCard>
  );
}

function WorkflowNode({
  stage,
}: {
  stage: Stage;
}) {
  const Icon = stage.icon;

  return (
    <div className="flex flex-col items-center">

      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
        "
        style={{
          background: `${stage.color}15`,
          color: stage.color,
        }}
      >
        <Icon className="size-7" />
      </div>

      <p className="mt-3 text-sm font-semibold text-[var(--color-heading)]">
        {stage.label}
      </p>

      <p
        className="mt-1 text-3xl font-bold"
        style={{
          color: stage.color,
        }}
      >
        {stage.count}
      </p>

    </div>
  );
}