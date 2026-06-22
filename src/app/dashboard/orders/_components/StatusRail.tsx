import Link from "next/link"
import {
  Search,
  ReceiptText,
  Clock3,
  ChefHat,
  CheckCircle2,
  LayoutList,
} from "lucide-react"
import type { StatusTabValue } from "./order-types"
import { buildOrdersHref } from "./order-utils"

type Props = {
  activeStatus: StatusTabValue
  searchQuery: string
  counts: Record<StatusTabValue, number>
  activeOrders: number
  newOrders: number
  revenue: number
  workflowMode: string
}

const advancedItems = [
  {
    label: "New Orders",
    value: "pending",
    icon: Clock3,
  },
  {
    label: "Preparing",
    value: "preparing",
    icon: ChefHat,
  },
  {
    label: "Ready",
    value: "ready",
    icon: CheckCircle2,
  },
  {
    label: "All Orders",
    value: "all",
    icon: LayoutList,
  },
] as const

const simpleItems = [
  {
    label: "New Orders",
    value: "pending",
    icon: Clock3,
  },
  {
    label: "Preparing",
    value: "preparing",
    icon: ChefHat,
  },
  {
    label: "All Orders",
    value: "all",
    icon: LayoutList,
  },
] as const

const badgeStyles = {
  pending:
    "bg-[#FDECEC] text-[#B42318] border border-[#F3C6C2]",
  preparing:
    "bg-[#FFF4E5] text-[#C2410C] border border-[#FED7AA]",
  ready:
    "bg-[#E7F3EC] text-[#2F7D57] border border-[#BFE4CE]",
  all:
    "bg-[#F7F8FA] text-[#475467] border border-[#E4DED3]",
}

export default function StatusRail({
  activeStatus,
  searchQuery,
  counts,
  activeOrders,
  newOrders,
  revenue,
  workflowMode,
}: Props) {
  const items =
    workflowMode === "advanced"
      ? advancedItems
      : simpleItems

  return (
    <aside className="flex flex-col gap-4">
      <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 dark:border-[#2A2F35] dark:bg-[#171A1F]">
        <div className="rounded-3xl bg-[#F7FAF8] p-5 dark:bg-[#183026]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085] dark:text-[#AAB2BD]">
            Active Orders
          </p>

          <h2 className="mt-2 text-5xl font-black tracking-tight text-[#111827] dark:text-[#E7E9EC]">
            {activeOrders}
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#BFE4CE] bg-[#E7F3EC] p-4 dark:border-[#24583D] dark:bg-[#183026]">
            <p className="text-xs font-medium text-[#667085] dark:text-[#AAB2BD]">
              New Orders
            </p>

            <p className="mt-1 text-2xl font-black text-[#2F7D57] dark:text-[#7BC99A]">
              {newOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E4DED3] bg-[#FCFAF6] p-4 dark:border-[#2A2F35] dark:bg-[#20242A]">
            <p className="text-xs font-medium text-[#667085] dark:text-[#AAB2BD]">
              Revenue
            </p>

            <p className="mt-1 text-2xl font-black text-[#111827] dark:text-[#E7E9EC]">
              ₹{revenue}
            </p>
          </div>
        </div>

        <form className="mt-5">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#E4DED3] bg-[#FCFAF6] px-4 dark:border-[#2A2F35] dark:bg-[#20242A]">
            <Search className="size-4 text-[#98A2B3]" />

            <input
              name="q"
              defaultValue={searchQuery}
              placeholder="Search orders..."
              className="h-full flex-1 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#98A2B3] dark:text-[#E7E9EC]"
            />
          </div>
        </form>

        <div className="my-5 h-px bg-[#E4DED3] dark:bg-[#2A2F35]" />

        <div className="space-y-2">
          {items.map((item) => {
            const active =
              activeStatus === item.value

            const Icon = item.icon

            return (
              <Link
                key={item.value}
                href={buildOrdersHref({
                  status: item.value,
                  q: searchQuery,
                })}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all ${
                  active
                    ? "bg-[#E7F3EC] text-[#2F7D57] shadow-sm dark:bg-[#183026] dark:text-[#7BC99A]"
                    : "text-[#667085] hover:bg-[#F7F8FA] dark:text-[#AAB2BD] dark:hover:bg-[#20242A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-4" />

                  <span className="text-sm font-semibold">
                    {item.label}
                  </span>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    badgeStyles[
                      item.value as keyof typeof badgeStyles
                    ]
                  }`}
                >
                  {counts[item.value]}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}