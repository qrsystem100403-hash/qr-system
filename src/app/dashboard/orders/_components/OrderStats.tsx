import type { LucideIcon } from "lucide-react"

type Stat = {
  label: string
  value: string | number
  icon: LucideIcon
}

type Props = {
  stats: Stat[]
}

export default function OrderStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E4DED3] bg-white p-4 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#667085] dark:text-[#AAB2BD]">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-black tracking-tight text-[#111827] dark:text-[#E7E9EC]">
                  {stat.value}
                </p>
              </div>

              <div className="grid size-11 place-items-center rounded-full bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]">
                <Icon className="size-5" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}