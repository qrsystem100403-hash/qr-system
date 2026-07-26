"use client";

import { Loader2, LogIn, LogOut, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";




type Props = {
  status:
    | "not_started"
    | "present"
    | "late"
    | "completed";

};

export default function AttendanceActionButton({
  status,
}: Props) {
  const [loading, setLoading] =
    useState(false);

    const router = useRouter();

  async function getLocation() {
    return new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          },
        );
      },
    );
  }

  async function submit(
    endpoint: string,
  ) {
    try {
      setLoading(true);

      const position =
        await getLocation();

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            latitude:
              position.coords.latitude,
            longitude:
              position.coords.longitude,
            accuracy:
              position.coords.accuracy,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Attendance failed.",
        );
      }

      toast.success(
        endpoint.includes("clock-in")
          ? "Clocked in successfully."
          : "Clocked out successfully.",
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to complete attendance.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (status === "completed") {
    return (
      <button
        disabled
        className="
        flex
        h-12
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-emerald-200
        bg-emerald-50
        font-medium
        text-emerald-700
        "
      >
        <Check size={18} />
        Attendance Completed
      </button>
    );
  }

  return (
    <button
      disabled={loading}
      onClick={() =>
        submit(
          status === "not_started"
            ? "/api/dashboard/attendance/clock-in"
            : "/api/dashboard/attendance/clock-out",
        )
      }
      className="
      flex
      h-12
      w-full
      items-center
      justify-center
      gap-2
      rounded-xl
      bg-[var(--color-primary)]
      font-medium
      text-white
      transition
      hover:opacity-90
      disabled:opacity-60
      "
    >
      {loading ? (
        <Loader2
          size={18}
          className="animate-spin"
        />
      ) : status ===
          "not_started" ? (
        <>
          <LogIn size={18} />
          Clock In
        </>
      ) : (
        <>
          <LogOut size={18} />
          Clock Out
        </>
      )}
    </button>
  );
}