"use client";

import { useEffect, useState } from "react";

type Result = {
  address: string;
  loading: boolean;
};

export function useReverseGeocoding(
  latitude: number | null,
  longitude: number | null,
) {
  const [address, setAddress] = useState(
    "Location not selected",
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      latitude === null ||
      longitude === null
    ) {
      setAddress("Location not selected");
      return;
    }

    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/maps/reverse?lat=${latitude}&lon=${longitude}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            "Unable to determine address.",
          );
        }

        const json = await response.json();

        setAddress(
          json.display_name ??
            "Unknown location",
        );
      } catch {
        if (!controller.signal.aborted) {
          setAddress(
            "Unable to determine address",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    const timeout = setTimeout(load, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [latitude, longitude]);

  return {
    address,
    loading,
  } satisfies Result;
}