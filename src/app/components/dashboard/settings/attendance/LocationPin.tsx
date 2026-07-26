"use client";

import { MapPin } from "lucide-react";

export default function LocationPin() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-full"
    >
      <div className="rounded-full bg-white p-1 shadow-xl">
        <MapPin
          className="h-8 w-8 text-red-500 drop-shadow-lg"
          fill="currentColor"
        />
      </div>
    </div>
  );
}