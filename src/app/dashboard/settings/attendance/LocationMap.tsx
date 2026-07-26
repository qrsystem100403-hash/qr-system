"use client";

import dynamic from "next/dynamic";

const Map = dynamic(
  () =>
    import(
      "@/app/components/dashboard/settings/attendance/LocationMapClient"
    ),
  {
    ssr: false,
  },
);

type Props = {
  latitude: number | null;
  longitude: number | null;
  radius: number;

  onLocationChange(
    latitude: number,
    longitude: number,
  ): void;

  onLocate(): void;
};

export default function LocationMap({
  latitude,
  longitude,
  radius,
  onLocationChange,
  onLocate,
}: Props) {
  if (
    latitude === null ||
    longitude === null
  ) {
    return (
      <div className="flex h-[430px] items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] text-center text-sm text-[var(--color-text-muted)]">
        Select your restaurant location to preview the map.
      </div>
    );
  }

  return (
    <Map
      latitude={latitude}
      longitude={longitude}
      radius={radius}
      onLocationChange={onLocationChange}
      onLocate={onLocate}
    />
  );
}