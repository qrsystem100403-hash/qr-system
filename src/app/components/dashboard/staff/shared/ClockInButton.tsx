"use client";

import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ClockInButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleClockIn() {
    if (!navigator.geolocation) {
      alert("Your device doesn't support GPS.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            "/api/dashboard/attendance/clock-in",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              }),
            },
          );

         const result = await response.json();

if (!response.ok || !result.success) {
  toast.error(
    result.message ??
    result.error ??
    "Clock in failed."
  );
  return;
}

toast.success("Clocked in successfully.");
router.refresh();

          router.refresh();
        } catch {
          alert("Something went wrong.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission is required.");
            break;

          case error.POSITION_UNAVAILABLE:
            alert("Unable to determine your location.");
            break;

          case error.TIMEOUT:
            alert("GPS request timed out.");
            break;

          default:
            alert("Unable to get your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }

  return (
    <button
      onClick={handleClockIn}
      disabled={loading}
      className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 font-bold text-[var(--color-bg)] transition hover:brightness-110 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <MapPin className="h-5 w-5" />
      )}

      {loading ? "Clocking In..." : "Clock In"}
    </button>
  );
}