"use client";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
};

export default function DashboardSwitch({
  checked,
  onChange,
  label,
  description,
  disabled,
}: Props) {
  return (
    <div
      className="flex items-center justify-between gap-5 rounded-[var(--radius-lg)] border p-5"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="min-w-0 flex-1">
        <h3
          className="text-sm font-semibold"
          style={{
            color: "var(--color-heading)",
          }}
        >
          {label}
        </h3>

        {description && (
          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--color-text-muted)",
            }}
          >
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative
          h-7
          w-12
          shrink-0
          rounded-full
          transition-all
          duration-300
          ${disabled ? "cursor-not-allowed opacity-60" : ""}
        `}
        style={{
          background: checked
            ? "var(--color-primary)"
            : "var(--color-border)",
        }}
      >
        <span
          className={`
            absolute
            top-1
            h-5
            w-5
            rounded-full
            bg-white
            shadow-sm
            transition-all
            duration-300
            ${checked ? "left-6" : "left-1"}
          `}
        />
      </button>
    </div>
  );
}