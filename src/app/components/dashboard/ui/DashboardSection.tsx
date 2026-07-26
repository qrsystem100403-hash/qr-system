import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function DashboardSection({
  title,
  description,
  actions,
  children,
  className,
}: Props) {
  return (
    <section
      className={cn(
        `
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        shadow-[var(--shadow-sm)]
        `,
        className
      )}
    >
      {(title || actions) && (
        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-[var(--color-border)]
            px-6
            py-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            {title && (
              <h2
                className="
                  text-lg
                  font-semibold
                  text-[var(--color-heading)]
                "
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                className="
                  mt-1
                  text-sm
                  text-[var(--color-text-muted)]
                "
              >
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}