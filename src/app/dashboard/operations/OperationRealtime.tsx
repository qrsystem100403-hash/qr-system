"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase/browser"

type Props = {
  restaurantId: string
}

export default function OperationsRealtime({
  restaurantId,
}: Props) {
  const router = useRouter()

  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`operations-${restaurantId}`)

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log(
            "REQUEST CHANGED",
            payload
          )

          router.refresh()
        }
      )

      .subscribe((status) => {
        console.log(
          "REQUEST CHANNEL",
          status
        )
      })

    return () => {
      supabaseBrowser.removeChannel(channel)
    }
  }, [restaurantId, router])

  return null
}