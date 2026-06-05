import Link from "next/link"
import type { StatusTabValue } from "./order-types"
import { buildOrdersHref } from "./order-utils"

const statusTabs: { label: string; value: StatusTabValue }[] = [
  { label: "New Orders", value: "pending" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Completed", value: "served" },
  { label: "Cancelled", value: "cancelled" },
  { label: "All", value: "all" },
]

type Props = {
  activeStatus: StatusTabValue
  searchQuery: string
  counts: Record<StatusTabValue, number>
}

export default function OrderStatusTabs({
  activeStatus,
  searchQuery,
  counts,
}: Props) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-[#E4DED3] bg-white shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
      <div className="flex gap-2 overflow-x-auto p-2">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            href={buildOrdersHref({
              status: tab.value,
              q: searchQuery,
            })}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition ${
              activeStatus === tab.value
                ? "bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]"
                : "text-[#667085] hover:bg-[#FCFAF6] dark:text-[#AAB2BD] dark:hover:bg-[#20242A]"
            }`}
          >
            <span>{tab.label}</span>

            <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10">
              {counts[tab.value]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}