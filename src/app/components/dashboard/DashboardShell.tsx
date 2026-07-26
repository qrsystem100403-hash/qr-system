"use client";

import { useDashboardLayout } from "./DashboardLayoutProvider";
import { cn } from "@/lib/utils";

type Props = {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
};

export default function DashboardShell({
  sidebar,
  topbar,
  children,
}: Props) {
  const { sidebarMode } = useDashboardLayout();

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {sidebar}

      <section
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-all duration-300",
          sidebarMode === "expanded"
            ? "lg:ml-[280px]"
            : "lg:ml-0"
        )}
      >
        {/* Fixed Header */}
        {topbar}

        {/* Content */}
        <main
          className="
            flex-1
            pt-[72px]
            md:pt-[84px]
            pb-24
            lg:pb-8
          "
        >
          <div
            className="
              mx-auto
              flex
              h-full
              w-full
              max-w-[1800px]
              flex-col
              px-4
              md:px-6
              lg:px-8
              xl:px-10
            "
          >
            {children}
          </div>
        </main>
      </section>
    </div>
  );
}