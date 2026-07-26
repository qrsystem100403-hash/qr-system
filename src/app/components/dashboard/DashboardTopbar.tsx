"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { PanelLeft } from "lucide-react";

import DashboardThemeToggle from "@/app/dashboard/DashboardThemeToggle";
import NotificationBell from "./NotificationBell";
import { useDashboardLayout } from "@/app/components/dashboard/DashboardLayoutProvider";

type Props = {
  restaurantName: string;
  restaurantLogo?: string | null;
};

export default function DashboardTopbar({
  restaurantName,
  restaurantLogo,
}: Props) {
  const {
    sidebarMode,
    toggleSidebar,
  } = useDashboardLayout();

  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > 10);

    onScroll();

    window.addEventListener(
      "scroll",
      onScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, []);

  return (
    <header
  className={`
    fixed
    top-0
    left-0
    z-50
    w-full
    transition-all
    duration-300

    ${
      sidebarMode === "expanded"
        ? "lg:left-[280px] lg:w-[calc(100%-280px)]"
        : "lg:left-0 lg:w-full"
    }
  `}
>
      <div>
        <div
          className={`
            flex
            h-14
            items-center
            justify-between
            rounded-none
            border
            transition-all
            duration-300
            md:h-16

            border-[var(--color-border)]
                  bg-[var(--sidebar-bg)]
          `}
        >
          {/* LEFT */}
          <div className="flex items-center gap-3 px-3 md:px-10">

            <button
  onClick={toggleSidebar}
  className="
    hidden
    md:flex
    h-10
    w-10
    items-center
    justify-center
    rounded-xl
    border
    border-[var(--color-border)]
    bg-[var(--color-surface)]
    transition-all
    hover:bg-[var(--color-primary-soft)]
    hover:border-[var(--color-primary-border)]
  "
>
  <PanelLeft
    className={`size-5 transition-transform duration-300 ${
      sidebarMode === "expanded" ? "" : "rotate-180"
    }`}
  />
</button>

            {/* Restaurant */}
            <button
              className="
                flex
                md:hidden
                items-center
                gap-2
                rounded-xl
                border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                px-2
                py-2
                transition-all
                hover:border-[var(--color-primary-border)]
                hover:shadow-[var(--shadow-sm)]
              "
            >
              <div
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-[var(--color-primary-soft)]
                "
              >
                {restaurantLogo ? (
                  <Image
                    src={restaurantLogo}
                    alt={restaurantName}
                    width={30}
                    height={30}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span
                    className="
                      text-sm
                      font-bold
                      text-[var(--color-primary)]
                    "
                  >
                    {restaurantName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div >
                <p
                  className="
                    max-w-[150px]
                    truncate
                    text-sm
                    font-semibold
                    text-[var(--color-heading)]
                  "
                >
                  {restaurantName}
                </p>

              </div>
            </button>

          </div>

                    {/* RIGHT */}
          <div className="flex items-center gap-2 pr-3 md:gap-3 md:pr-10">

            {/* Theme */}
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                
                
                bg-[var(--color-surface)]
              "
            >
              <DashboardThemeToggle />
            </div>

            {/* Notification */}
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                
                bg-[var(--color-surface)]
              "
            >
              <NotificationBell />
            </div>

            {/* Restaurant */}
            <button
              className="
              hidden
              md:flex
                items-center
                gap-3
                rounded-xl
                border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                px-2
                py-2
                transition-all
                hover:border-[var(--color-primary-border)]
                hover:shadow-[var(--shadow-sm)]
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-[var(--color-primary-soft)]
                "
              >
                {restaurantLogo ? (
                  <Image
                    src={restaurantLogo}
                    alt={restaurantName}
                    width={34}
                    height={34}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span
                    className="
                      text-sm
                      font-bold
                      text-[var(--color-primary)]
                    "
                  >
                    {restaurantName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div >
                <p
                  className="
                    max-w-[150px]
                    truncate
                    text-sm
                    font-semibold
                    text-[var(--color-heading)]
                  "
                >
                  {restaurantName}
                </p>

              </div>
            </button>

          </div>
          </div>
      </div>

      

      
    </header>
  );
}