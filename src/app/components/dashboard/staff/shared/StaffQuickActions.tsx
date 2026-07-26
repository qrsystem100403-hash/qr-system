"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

export type StaffQuickAction = {
  title: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  color?: string;
};

type Props = {
  title?: string;
  actions: StaffQuickAction[];
};

export default function StaffQuickActions({
  title = "Quick Access",
  actions,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
      <div className="border-b border-[var(--color-border)] p-6">
        <h2 className="text-2xl font-black">
          {title}
        </h2>

        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Open the tools you use most often.
        </p>
      </div>

      <div>
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className={`flex items-center justify-between gap-4 p-5 transition hover:bg-[var(--color-primary-soft)] ${
                index !== actions.length - 1
                  ? "border-b border-[var(--color-border)]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-soft)]">
                  <Icon className="h-5 w-5 text-[var(--color-primary)]" />
                </div>

                <div>
                  <p className="font-bold">
                    {action.title}
                  </p>

                  {action.description && (
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {action.description}
                    </p>
                  )}
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-[var(--color-text-muted)]" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}