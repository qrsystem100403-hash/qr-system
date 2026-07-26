"use client";

import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";

type WorkItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type Props = {
  title: string;
  items: WorkItem[];
};

export default function StaffWorkSection({
  title,
  items,
}: Props) {
  return (
    <section
      className="
      rounded-xl
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      "
    >
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="text-lg font-semibold text-[var(--color-heading)]">
          {title}
        </h2>
      </div>

      <div>
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex
                items-center
                gap-4
                px-5
                py-4
                transition
                hover:bg-[var(--color-surface-hover)]
                ${
                  index !== items.length - 1
                    ? "border-b border-[var(--color-border)]"
                    : ""
                }
              `}
            >
              <div
                className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                bg-[var(--color-surface-soft)]
                "
              >
                <Icon
                  size={20}
                  className="text-[var(--color-primary)]"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-[var(--color-heading)]">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {item.description}
                </p>
              </div>

              <ChevronRight
                size={18}
                className="text-[var(--color-text-soft)]"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}