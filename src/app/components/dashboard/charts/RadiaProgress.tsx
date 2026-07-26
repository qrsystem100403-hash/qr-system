"use client";

type Props = {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
};

export default function RadialProgress({
  value,
  size = 160,
  strokeWidth = 12,
  label = "Completion Rate",
}: Props) {
  const percentage = Math.min(
    Math.max(value, 0),
    100,
  );

  const radius =
    (size - strokeWidth) / 2;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (percentage / 100) *
      circumference;

  return (
    <div className="relative flex items-center justify-center">

      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        {/* Track */}

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />

        {/* Progress */}

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition:
              "stroke-dashoffset 0.9s ease",
          }}
        />

      </svg>

      <div
  className="
    absolute
    inset-0
    flex
    flex-col
    items-center
    justify-center
    text-center
    px-4
  "
>

        <h2 className="text-base font-bold tracking-tight text-[var(--color-heading)]">
          {percentage}%
        </h2>

        <p className="mt-1 text-xs leading-4 text-[var(--color-text-muted)]">
          {label}
        </p>

      </div>

    </div>
  );
}