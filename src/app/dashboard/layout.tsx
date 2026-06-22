import Link from "next/link";
import {
  Bell,
  LayoutDashboard,
  MenuSquare,
  QrCode,
  ReceiptText,
  Settings,
  Store,
} from "lucide-react";

import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

import LogoutButton from "./LogoutButton";
import DashboardThemeProvider from "./DashboardThemeProvider";
import DashboardThemeToggle from "./DashboardThemeToggle";

import NotificationCenter from "../components/dashboard/NotificationCenter";
import NotificationBell from "../components/dashboard/NotificationBell";
import MobileBottomNav from "../components/dashboard/MobileBottomNav";

import SidebarCounts from "./orders/_components/SidebarCounts";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { restaurant, role } =
    await requireRestaurantUser();

  const homeHref =
    role === "owner"
      ? "/dashboard"
      : "/dashboard/orders";

  const navItems = [
    ...(role === "owner"
      ? [
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
          },
        ]
      : []),

    {
      label: "Orders",
      href: "/dashboard/orders",
      icon: ReceiptText,
    },

    ...(role === "owner"
      ? [
          {
            label: "Menu",
            href: "/dashboard/menu",
            icon: MenuSquare,
          },
          {
            label: "Tables",
            href: "/dashboard/tables",
            icon: QrCode,
          },
          {
            label: "Operations",
            href: "/dashboard/operations",
            icon: Bell,
          },
          {
            label: "History",
            href: "/dashboard/orders/history",
            icon: ReceiptText,
          },
          {
            label: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
          },
        ]
      : []),
  ];

  return (
    <DashboardThemeProvider>
      <main className="min-h-screen bg-[#F4F1EA] text-[#1F2933] dark:bg-[#101215] dark:text-[#E7E9EC]">
        <div className="flex min-h-screen">
          {/* SIDEBAR */}
          <aside className="sticky top-0 hidden h-screen w-[290px] shrink-0 border-r border-[#E4DED3] bg-[#FCFAF6] p-5 dark:border-[#2A2F35] dark:bg-[#171A1F] lg:flex lg:flex-col">
            {/* BRAND */}
            <Link
              href={homeHref}
              className="
                flex
                items-center
                gap-4
                rounded-3xl
                border
                border-[#E4DED3]
                bg-white
                p-4
                shadow-sm
                dark:border-[#2A2F35]
                dark:bg-[#20242A]
              "
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]">
                <Store className="size-5" />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-black uppercase tracking-wide">
                  {restaurant.name}
                </h2>

                <p className="mt-1 text-xs text-[#667085] dark:text-[#AAB2BD]">
                  {role} Panel
                </p>
              </div>
            </Link>

            {/* NAV */}
            <div className="mt-8">
              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
                Navigation
              </p>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="
                        group
                        flex
                        h-12
                        items-center
                        gap-3
                        rounded-2xl
                        px-4
                        text-sm
                        font-semibold
                        text-[#667085]
                        transition-all
                        duration-200

                        hover:bg-[#E7F3EC]
                        hover:text-[#2F7D57]

                        dark:text-[#AAB2BD]
                        dark:hover:bg-[#183026]
                        dark:hover:text-[#7BC99A]
                      "
                    >
                      <Icon className="size-4 shrink-0" />

                      <span>
                        {item.label}
                      </span>

                      <SidebarCounts
                        restaurantId={
                          restaurant.id
                        }
                        item={item.label}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* USER CARD */}
            <div className="mt-auto">
              <div className="rounded-3xl border border-[#E4DED3] bg-white p-4 dark:border-[#2A2F35] dark:bg-[#20242A]">
                <p className="text-xs font-medium text-[#667085] dark:text-[#AAB2BD]">
                  Logged in as
                </p>

                <p className="mt-1 text-sm font-bold capitalize">
                  {role}
                </p>

                <div className="mt-4">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="min-w-0 flex-1">
            <header
              className="
                sticky
                top-0
                z-40
                border-b
                border-[#E4DED3]
                bg-[#FCFAF6]/90
                px-4
                py-4
                backdrop-blur-xl

                dark:border-[#2A2F35]
                dark:bg-[#171A1F]/90

                sm:px-6
                lg:px-8
              "
            >
              <div className="flex items-center justify-between">
                {/* MOBILE BRAND */}
                <Link
                  href={homeHref}
                  className="flex items-center gap-3 lg:hidden"
                >
                  <div className="grid size-10 place-items-center rounded-xl bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]">
                    <Store className="size-5" />
                  </div>

                  <div>
                    <p className="max-w-[180px] truncate text-sm font-bold">
                      {restaurant.name}
                    </p>

                    <p className="text-xs text-[#667085] dark:text-[#AAB2BD]">
                      {role} Panel
                    </p>
                  </div>
                </Link>

                {/* ACTIONS */}
                <div className="ml-auto flex items-center gap-2">
                  <DashboardThemeToggle />
                  <NotificationBell />
                </div>
              </div>
            </header>

            <div className="px-4 py-5 pb-24 sm:px-6 lg:px-8">
              {children}
            </div>
          </section>
        </div>

        <MobileBottomNav />

        <NotificationCenter
          restaurantId={restaurant.id}
        />
      </main>
    </DashboardThemeProvider>
  );
}