"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarCounts from "@/app/dashboard/orders/_components/SidebarCounts";

type Props = {
  navItems: {
    label: string;
    href: string;
    icon: React.ElementType;
  }[];
  restaurantId: string;
};

export default function SidebarNav({
  navItems,
  restaurantId,
}: Props) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;

        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" &&
            pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              relative
              flex
              h-12
              items-center
              gap-3
              rounded-2xl
              px-4
              text-sm
              font-semibold
              transition-all
              duration-200
              ${
                active
                  ? `
                    bg-[#E7F3EC]
                    text-[#2F7D57]
                    shadow-sm
                    dark:bg-[#20242A]
                    dark:text-[#7BC99A]
                  `
                  : `
                    text-[#667085]
                    hover:bg-[#E7F3EC]
                    hover:text-[#2F7D57]
                    dark:text-[#AAB2BD]
                    dark:hover:bg-[#20242A]
                    dark:hover:text-[#7BC99A]
                  `
              }
            `}
          >
            {active && (
              <div
                className="
                absolute
                left-0
                top-2
                h-8
                w-1
                rounded-r-full
                bg-[#2F7D57]
                dark:bg-[#7BC99A]
              "
              />
            )}

            <Icon className="size-4 shrink-0" />

            <span>{item.label}</span>

            <SidebarCounts
              restaurantId={restaurantId}
              item={item.label}
            />
          </Link>
        );
      })}
    </nav>
  );
}