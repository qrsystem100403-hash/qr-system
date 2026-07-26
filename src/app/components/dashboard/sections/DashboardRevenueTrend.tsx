"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DashboardCard from "../ui/DashboardCard";

type Props = {
  data: {
    hour: string;
    revenue: number;
  }[];

  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  averageOrderValue: number;
};

export default function DashboardRevenueTrend({
  data,
  totalRevenue,
  revenueChange,
  totalOrders,
  averageOrderValue,
}: Props) {

  const peakRevenue = Math.max(
  ...data.map((item) => item.revenue),
  0,
);



  if (!data.length) {
  return (
    <DashboardCard className="h-full">
      <div className="flex h-[340px] flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-[var(--color-heading)]">
          No revenue today
        </h3>

        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Revenue will appear here after the first completed order.
        </p>
      </div>
    </DashboardCard>
  );
}
  return (
    <DashboardCard className="h-full p-5">

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

  {/* Left */}

  <div>

    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">

  <span className="h-2 w-2 rounded-full bg-current animate-pulse" />

  Live Revenue

</div>

    <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--color-heading)]">
      Today's Revenue Trend
    </h2>

    <p className="mt-1 max-w-lg text-xs leading-5 text-[var(--color-text-muted)]">
      Monitor today's revenue performance, average order value and compare
      sales with yesterday.
    </p>

  </div>

  {/* KPI */}

  <div
    className="
      rounded-3xl
      border
      border-[var(--color-border)]
      bg-gradient-to-br
from-[var(--color-surface)]
to-[var(--color-surface-soft)]
      p-5
      lg:w-[235px]
    "
  >

   

    <div className="mt-1 h-2 flex items-center justify-between">

      <div
        className={`
          inline-flex
          items-center
          rounded-full
          px-2
          py-1
          text-xs
          font-semibold

          ${
            revenueChange >= 0
              ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
              : "bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
          }
        `}
      >
        {revenueChange >= 0 ? "▲" : "▼"}

        <span className="ml-1">
          {Math.abs(revenueChange).toFixed(1)}%
        </span>

      </div>

      <span className="text-xs text-[var(--color-text-muted)]">
        vs Yesterday
      </span>

    </div>


          

  </div>

</div>
<div className="mb-5 flex items-center gap-6">

  <div className="flex items-center gap-2">

    <div className="h-3 w-3 rounded-full bg-[var(--color-primary)]" />

    <span className="text-sm text-[var(--color-text-muted)]">
      Revenue
    </span>

  </div>

  <div className="flex items-center gap-2">

    <div className="h-3 w-3 rounded-full bg-[var(--color-success)]" />

    <span className="text-sm text-[var(--color-text-muted)]">
      Peak Hour
    </span>

  </div>

</div>

      <div className="h-[240px] xl:h-[330px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >

            <defs>

              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="var(--color-border)"
            />

            <XAxis
              dataKey="hour"
              tick={{
                fill: "var(--color-text-soft)",
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(value) => {
  if (value >= 100000)
    return `₹${(value / 100000).toFixed(1)}L`;

  if (value >= 1000)
    return `₹${(value / 1000).toFixed(0)}K`;

  return `₹${value}`;
}}
              tick={{
                fill: "var(--color-text-soft)",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
            />

                        <Tooltip
              cursor={{
                stroke: "var(--color-primary)",
                strokeDasharray: "4 4",
              }}
              content={({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const revenue = Number(payload[0].value);
  const isPeak = revenue === peakRevenue;

  return (
    <div
      className="
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-3
        py-2
        shadow-xl
      "
    >
      <p className="text-xs text-[var(--color-text-soft)]">
        {label}
      </p>

      <p className="mt-2 text-xs uppercase tracking-[0.15em] text-[var(--color-text-soft)]">
  Revenue
</p>

<p className="text-base font-bold text-[var(--color-heading)]">
        ₹{revenue.toLocaleString("en-IN")}
      </p>

      {isPeak && (
        <div
          className="
            mt-2
            inline-flex
            rounded-full
            bg-[var(--color-success-soft)]
            px-2
            py-1
            text-[10px]
            font-bold
            uppercase
            text-[var(--color-success)]
          "
        >
          Peak Hour
        </div>
      )}
    </div>
  );
}}
            />

            <Area
  type="monotone"
  dataKey="revenue"
  stroke="var(--color-primary)"
  strokeWidth={3}
  fill="url(#revenueGradient)"
  animationDuration={900}
  activeDot={{
    r: 6,
    fill: "var(--color-primary)",
    stroke: "var(--color-surface)",
    strokeWidth: 3,
  }}
  dot={({ cx, cy, payload }) => {
    const isPeak =
      payload.revenue === peakRevenue &&
      peakRevenue > 0;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={isPeak ? 7 : 3}
        fill={
          isPeak
            ? "var(--color-success)"
            : "var(--color-primary)"
        }
        stroke="var(--color-surface)"
        strokeWidth={isPeak ? 3 : 2}
      />
    );
  }}
/>

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </DashboardCard>
  );
}