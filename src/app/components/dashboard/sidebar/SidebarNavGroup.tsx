"use client";

import { LucideIcon } from "lucide-react";

import SidebarNavItem from "./SidebarNavItem";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type Props = {
  title: string;
  items: NavItem[];
  pathname: string;
};

export default function SidebarNavGroup({ title, items, pathname }: Props) {
  return (
    <section>
      {/* Section Title */}

      <div className="mb-4 flex items-center gap-3 px-2">
        <span className="h-px flex-1 bg-[var(--color-divider)]" />

        <span
          className="
            text-[11px]
            tracking-[0.24em]
            font-bold
            uppercase
            text-[var(--color-text-soft)]
          "
        >
          {title}
        </span>

        <span className="h-px flex-1 bg-[var(--color-divider)]" />
      </div>

      {/* Navigation */}

      <div className="space-y-1.5">
        {items.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return <SidebarNavItem key={item.href} {...item} active={active} />;
        })}
      </div>
    </section>
  );
}
