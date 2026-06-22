"use client"

import { useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/browser"

type Props = {
  restaurantId: string
  item: string
}

export default function SidebarCounts({
  restaurantId,
  item,
}: Props) {
  const [count, setCount] = useState(0)

  const loadCount = async () => {
    try {
      if (item === "Orders") {
        const { count } = await supabaseBrowser
          .from("orders")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("restaurant_id", restaurantId)
          .in("order_status", [
            "pending",
            "preparing",
            "ready",
          ])

        setCount(count ?? 0)
        return
      }

      if (item === "Operations") {
        const { count } = await supabaseBrowser
          .from("requests")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("restaurant_id", restaurantId)
          .eq("status", "pending")

        setCount(count ?? 0)
        return
      }

      if (item === "Tables") {
        const { count } = await supabaseBrowser
          .from("restaurant_tables")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("restaurant_id", restaurantId)
          .eq("status", "occupied")

        setCount(count ?? 0)
        return
      }

      setCount(0)
    } catch (error) {
      console.error(
        "SIDEBAR COUNT ERROR",
        error
      )
    }
  }

  useEffect(() => {
    if (!restaurantId) return

    void loadCount()

    const channel = supabaseBrowser
      .channel(
        `sidebar-counts-${restaurantId}-${item}`
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
          if (item === "Orders") {
            void loadCount()
          }
        }
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
          if (item === "Operations") {
            void loadCount()
          }
        }
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "restaurant_tables",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
          if (item === "Tables") {
            void loadCount()
          }
        }
      )

      .subscribe((status) => {
        console.log(
          `SIDEBAR ${item} CHANNEL`,
          status
        )
      })

    return () => {
      supabaseBrowser.removeChannel(
        channel
      )
    }
  }, [restaurantId, item])

  if (
    count <= 0 ||
    (item !== "Orders" &&
      item !== "Operations" &&
      item !== "Tables")
  ) {
    return null
  }

  return (
    <span
      className="
        ml-auto
        inline-flex
        min-w-[24px]
        items-center
        justify-center
        rounded-full
        bg-[#E7F3EC]
        px-2
        py-1
        text-[11px]
        font-bold
        text-[#2F7D57]
        dark:bg-[#183026]
        dark:text-[#7BC99A]
      "
    >
      {count > 99
        ? "99+"
        : count}
    </span>
  )
}