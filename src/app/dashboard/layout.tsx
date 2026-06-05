import Link from "next/link"
import {
  Bell,
  LayoutDashboard,
  MenuSquare,
  QrCode,
  ReceiptText,
  Search,
  Settings,
  Store,
} from "lucide-react"
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import LogoutButton from "./LogoutButton"
import DashboardThemeProvider from "./DashboardThemeProvider"
import DashboardThemeToggle from "./DashboardThemeToggle"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { restaurant, role } = await requireRestaurantUser()

  const homeHref = role === "owner" ? "/dashboard" : "/dashboard/orders"

  const navItems = [
    ...(role === "owner"
      ? [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]
      : []),
    { label: "Orders", href: "/dashboard/orders", icon: ReceiptText },
    ...(role === "owner"
      ? [
          { label: "Menu", href: "/dashboard/menu", icon: MenuSquare },
          { label: "Tables", href: "/dashboard/tables", icon: QrCode },
          { label: "Settings", href: "/dashboard/settings", icon: Settings },
        ]
      : []),
  ]

  return (
    <DashboardThemeProvider>
      <main className="min-h-screen bg-[#F4F1EA] text-[#1F2933] dark:bg-[#101215] dark:text-[#E7E9EC]">
        <div className="flex min-h-screen">
          <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-[#E4DED3] bg-[#FCFAF6] px-4 py-5 dark:border-[#2A2F35] dark:bg-[#171A1F] lg:flex lg:flex-col">
            <Link href={homeHref} className="flex items-center gap-3 px-2">
              <div className="grid size-11 place-items-center rounded-2xl bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#20242A] dark:text-[#7BC99A]">
                <Store className="size-5" />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-black uppercase tracking-tight text-[#1F2933] dark:text-[#E7E9EC]">
                  {restaurant.name}
                </h2>
                <p className="text-xs font-medium capitalize text-[#667085] dark:text-[#AAB2BD]">
                  {role} Panel
                </p>
              </div>
            </Link>

            <nav className="mt-8 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#667085] transition hover:bg-[#E7F3EC] hover:text-[#2F7D57] dark:text-[#AAB2BD] dark:hover:bg-[#20242A] dark:hover:text-[#7BC99A]"
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto rounded-2xl border border-[#E4DED3] bg-[#F8F5EF] p-3 dark:border-[#2A2F35] dark:bg-[#20242A]">
              <p className="mb-3 text-xs font-semibold text-[#667085] dark:text-[#AAB2BD]">
                Logged in as{" "}
                <span className="capitalize text-[#1F2933] dark:text-[#E7E9EC]">
                  {role}
                </span>
              </p>
              <LogoutButton />
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <header className="sticky top-0 z-40 border-b border-[#E4DED3] bg-[#FCFAF6]/90 px-4 py-3 backdrop-blur-xl dark:border-[#2A2F35] dark:bg-[#171A1F]/90 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#E4DED3] bg-[#F8F5EF] px-3 dark:border-[#2A2F35] dark:bg-[#20242A] lg:flex lg:max-w-md">
                  <Search className="size-4 text-[#98A2B3] dark:text-[#AAB2BD]" />
                  <input
                    placeholder="Search orders, tables, menu..."
                    className="h-10 w-full bg-transparent text-sm text-[#1F2933] outline-none placeholder:text-[#98A2B3] dark:text-[#E7E9EC] dark:placeholder:text-[#AAB2BD]"
                  />
                </div>

                <Link
                  href={homeHref}
                  className="flex min-w-0 items-center gap-3 lg:hidden"
                >
                  <div className="grid size-10 place-items-center rounded-xl bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#20242A] dark:text-[#7BC99A]">
                    <Store className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#1F2933] dark:text-[#E7E9EC]">
                      {restaurant.name}
                    </p>
                    <p className="text-xs capitalize text-[#667085] dark:text-[#AAB2BD]">
                      {role} Panel
                    </p>
                  </div>
                </Link>

                <div className="ml-auto flex items-center gap-3">
                  <DashboardThemeToggle />

                  <button
                    type="button"
                    className="relative grid size-10 place-items-center rounded-xl border border-[#E4DED3] bg-[#FCFAF6] text-[#667085] transition hover:bg-[#F8F5EF] hover:text-[#2F7D57] dark:border-[#2A2F35] dark:bg-[#171A1F] dark:text-[#AAB2BD] dark:hover:bg-[#20242A] dark:hover:text-[#7BC99A]"
                    aria-label="Notifications"
                  >
                    <Bell className="size-4" />
                    <span className="absolute right-2 top-2 size-2 rounded-full bg-[#B42318]" />
                  </button>

                  <LogoutButton />
                </div>
              </div>

              <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
                {navItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#E4DED3] bg-[#FCFAF6] px-3 text-xs font-bold text-[#667085] transition hover:bg-[#E7F3EC] hover:text-[#2F7D57] dark:border-[#2A2F35] dark:bg-[#171A1F] dark:text-[#AAB2BD] dark:hover:bg-[#20242A] dark:hover:text-[#7BC99A]"
                    >
                      <Icon className="size-3.5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </header>

            <div className="px-4 py-5 sm:px-6 lg:px-8">{children}</div>
          </section>
        </div>
      </main>
    </DashboardThemeProvider>
  )
}