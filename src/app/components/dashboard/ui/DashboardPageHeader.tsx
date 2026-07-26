import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export default function DashboardPageHeader({
  title,
  description,
  actions,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "mb-8 flex flex-col gap-5",
        "lg:flex-row lg:items-start lg:justify-between",
        className
      )}
    >
      <div className="min-w-0">

        <h1
          className="
            text-3xl
            font-bold
            tracking-[-0.03em]
            text-[var(--color-heading)]
          "
        >
          {title}
        </h1>

        {description && (
          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-[var(--color-text-muted)]
            "
          >
            {description}
          </p>
        )}

      </div>

      {actions && (
        <div
          className="
            flex
            shrink-0
            flex-wrap
            items-center
            gap-3
          "
        >
          {actions}
        </div>
      )}
    </section>
  );
} 