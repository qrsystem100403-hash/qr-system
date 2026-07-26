import Link from "next/link";
import { ChevronRight, LucideIcon, Clock3 } from "lucide-react";

type Props = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

export default function SettingsItem({
  title,
  description,
  href,
  icon: Icon,
  comingSoon,
}: Props) {
  const content = (
  <div
    className="
      dashboard-card
      group
      relative
      flex
      h-full
      min-h-[210px]
      flex-col
      overflow-hidden
      rounded-[var(--radius-xl)]
      p-6
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-[var(--color-primary-border)]
      hover:shadow-lg
    "
  >
    <div
      className="
        absolute
        left-0
        top-0
        h-1
        w-full
        origin-left
        scale-x-0
        bg-[var(--color-primary)]
        transition-transform
        duration-300
        group-hover:scale-x-100
      "
    />

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
        background: "var(--color-primary-soft)",
        color: "var(--color-primary)",
      }}
    >
      <Icon className="h-7 w-7" />
    </div>

    <div className="mt-6 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <h3
          className="text-lg font-bold"
          style={{
            color: "var(--color-heading)",
          }}
        >
          {title}
        </h3>

        {comingSoon && (
          <span
            className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium"
            style={{
              background: "var(--color-surface-soft)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            <Clock3 className="h-3 w-3" />
            Coming Soon
          </span>
        )}
      </div>

      <p
        className="mt-3 text-sm leading-6"
        style={{
          color: "var(--color-text-muted)",
        }}
      >
        {description}
      </p>
    </div>

    {!comingSoon && (
      <div className="mt-6 flex items-center justify-between">
        <span
          className="text-sm font-semibold"
          style={{
            color: "var(--color-primary)",
          }}
        >
          Configure
        </span>

        <ChevronRight
          className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
          style={{
            color: "var(--color-primary)",
          }}
        />
      </div>
    )}
  </div>
);

  if (comingSoon) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}