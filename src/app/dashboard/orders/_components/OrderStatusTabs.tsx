import Link from "next/link"
import type { StatusTabValue } from "./order-types"
import { buildOrdersHref } from "./order-utils"

const advancedTabs = [
  {
    label: "New Orders",
    value: "pending",
  },
  {
    label: "Preparing",
    value: "preparing",
  },
  {
    label: "Ready",
    value: "ready",
  },
  {
    label: "All",
    value: "all",
  },
] as const

const simpleTabs = [
  {
    label: "New Orders",
    value: "pending",
  },
  {
    label: "Preparing",
    value: "preparing",
  },
  {
    label: "All",
    value: "all",
  },
] as const

type Props = {
  activeStatus: StatusTabValue
  searchQuery: string
  counts: Record<StatusTabValue, number>
  workflowMode: string
}

export default function OrderStatusTabs({
  activeStatus,
  searchQuery,
  counts,
  workflowMode
}: Props) {
  const statusTabs =
  workflowMode === "advanced"
    ? advancedTabs
    : simpleTabs
  return (
  <div className="mt-5">
    <div className="grid grid-cols-3 gap-3">
      {statusTabs.map((tab) => {
        const active =
          activeStatus === tab.value

        return (
          <Link
            key={tab.value}
            href={buildOrdersHref({
              status: tab.value,
              q: searchQuery,
            })}
            className={`
              rounded-2xl
              border
              p-4
              transition-all
              duration-200
              hover:-translate-y-0.5
              ${
                active
                  ? "border-[#2F7D57] bg-[#E7F3EC] dark:border-[#7BC99A] dark:bg-[#183026]"
                  : "border-[#E4DED3] bg-white hover:border-[#CFC7B8] dark:border-[#2A2F35] dark:bg-[#171A1F]"
              }
            `}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085] dark:text-[#AAB2BD]">
              {tab.label}
            </p>

            <p className="mt-2 font-mono text-3xl font-semibold text-[#111827] dark:text-[#E7E9EC]">
              {counts[tab.value]}
            </p>
          </Link>
        )
      })}
    </div>
  </div>
)
}