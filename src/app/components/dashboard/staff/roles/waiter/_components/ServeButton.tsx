"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
} from "lucide-react";

type Props = {
  orderId: string;
};

export default function ServeButton({
  orderId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function serveOrder() {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/dashboard/waiter/orders/${orderId}/serve`,
        {
          method: "POST",
        },
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        alert(
          data.error ??
            "Failed to serve order.",
        );
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={serveOrder}
      disabled={loading}
      className="
        flex
        h-12
        w-full
        items-center
        justify-center
        gap-2
        rounded-2xl
        bg-emerald-600
        text-sm
        font-bold
        text-white
        transition
        hover:bg-emerald-500
        disabled:pointer-events-none
        disabled:opacity-50
      "
    >
      {loading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <CheckCircle2 className="size-5" />
      )}

      Mark as Served
    </button>
  );
}