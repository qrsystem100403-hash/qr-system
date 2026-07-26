"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
} from "lucide-react";

import DashboardBottomSheet from "./mobile/DashboardBottomSheet";
import { getMobileNavigation } from "@/lib/dashboard/sidebar";



type Props = {
  role: string;
  features: {
    kitchen_display_enabled: boolean;
    cashier_dashboard_enabled: boolean;
    waiter_dashboard_enabled: boolean;
    online_orders_enabled: boolean;
    attendance_enabled: boolean;
    inventory_enabled: boolean;
  };
};

export default function MobileBottomNav({
  role,
  features,
}: Props) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] =
  useState(false);
  const [showNav, setShowNav] = useState(true);

const lastScrollY = useRef(0);

  const navigation = getMobileNavigation(
  role,
  features,
);

const items = navigation.bottom;

useEffect(() => {
  const handleScroll = () => {
    const current = window.scrollY;

    // Always show near the top
    if (current < 40) {
      setShowNav(true);
      lastScrollY.current = current;
      return;
    }

    // Hide while scrolling down
    if (current > lastScrollY.current + 10) {
      setShowNav(false);
    }

    // Show while scrolling up
    if (current < lastScrollY.current - 10) {
      setShowNav(true);
    }

    lastScrollY.current = current;
  };

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  return () =>
    window.removeEventListener(
      "scroll",
      handleScroll,
    );
}, []);

  return (
    <nav
      className={`
fixed
bottom-0
left-0
right-0
z-50
border-t
border-[var(--color-border)]
bg-[var(--color-surface)]
transition-transform
duration-300
ease-in-out
lg:hidden
${showNav ? "translate-y-0" : "translate-y-full"}
`}
    >
      <div
        className="
          grid
          h-[72px]
          grid-cols-5
          px-2
          pb-[env(safe-area-inset-bottom)]
        "
      >
        {items.map((item) => {
          const Icon = item.icon;

          const active =
  item.href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-1
                transition-all
                active:scale-95
              "
            >
              <div
                className={`
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-2xl
                  transition-all
                  duration-200

                  ${
                    active
                      ? `
                        bg-[var(--color-primary)]
                        text-white
                        shadow-sm
                      `
                      : `
                        text-[var(--color-text-muted)]
                      `
                  }
                `}
              >
                <Icon className="size-5" />
              </div>

              <span
                className={`
                  text-[11px]
                  font-semibold
                  transition-colors

                  ${
                    active
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)]"
                  }
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        <button
  type="button"
  onClick={() => setMoreOpen(true)}
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-1
            transition-all
            active:scale-95
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-2xl
              bg-[var(--color-surface-soft)]
              text-[var(--color-text-muted)]

            "
          >
            <MoreHorizontal className="size-5" />
          </div>

          <span
            className="
              text-[11px]
              font-semibold
              text-[var(--color-text-muted)]
            "
          >
            More
          </span>
        </button>
        
      </div>
      <DashboardBottomSheet
  open={moreOpen}
  onOpenChange={setMoreOpen}
  title="More"
>

  {navigation.more.map((item) => {
  const Icon = item.icon;

  const active =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

  const moreActive = navigation.more.some((item) =>
  pathname.startsWith(item.href)
);

  return (

    <Link
  key={item.href}
  href={item.href}
  onClick={() => setMoreOpen(false)}
  className={`
    flex
    items-center
    gap-4
    rounded-2xl
    p-4
    transition-all

    ${
      active
        ? `
          bg-[var(--color-primary-soft)]
          text-[var(--color-primary)]
        `
        : `
          hover:bg-[var(--color-surface-hover)]
        `
    }
  `}
>
      <div
  className={`
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-2xl
    transition-all

    ${
      moreActive
        ? `
          bg-[var(--color-primary)]
          text-white
          shadow-[var(--shadow-sm)]
        `
        : `
          bg-[var(--color-surface-soft)]
          text-[var(--color-text-muted)]
        `
    }
  `}
>
        <Icon className="size-5" />
      </div>

      <span
        className="
          text-sm
          font-semibold
          text-[var(--color-heading)]
        "
      >
        {item.label}
      </span>
    </Link>
  );
})}

</DashboardBottomSheet>
    </nav>
    
  );
}