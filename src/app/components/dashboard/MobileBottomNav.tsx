"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ReceiptText,
  QrCode,
  Bell,
  MenuSquare,
  MoreHorizontal,
} from "lucide-react"

const items = [
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ReceiptText,
  },
  {
    label: "Tables",
    href: "/dashboard/tables",
    icon: QrCode,
  },
  {
    label: "Ops",
    href: "/dashboard/operations",
    icon: Bell,
  },
  {
    label: "Menu",
    href: "/dashboard/menu",
    icon: MenuSquare,
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        border-[#E4DED3]
        bg-white/95
        backdrop-blur-xl
        dark:border-[#2A2F35]
        dark:bg-[#171A1F]/95
        lg:hidden
      "
    >
      <div className="grid h-16 grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon

          const active =
            pathname.startsWith(item.href)

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
              "
            >
              <div
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  transition

                  ${
                    active
                      ? "bg-[#E7F3EC] text-[#2F7D57]"
                      : "text-[#667085] dark:text-[#AAB2BD]"
                  }
                `}
              >
                <Icon className="size-5" />
              </div>

              <span
                className={`
                  text-[11px]
                  font-semibold

                  ${
                    active
                      ? "text-[#2F7D57]"
                      : "text-[#667085] dark:text-[#AAB2BD]"
                  }
                `}
              >
                {item.label}
              </span>
            </Link>
          )
        })}

        <button
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-1
            text-[#667085]
            dark:text-[#AAB2BD]
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-[#F7F8FA]
              dark:bg-[#20242A]
            "
          >
            <MoreHorizontal className="size-5" />
          </div>

          <span className="text-[11px] font-semibold">
            More
          </span>
        </button>
      </div>
    </nav>
  )
}