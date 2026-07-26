"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  Loader2,
  LocateFixed,
  Lock,
  LockOpen,
  MapPin,
  Pencil,
} from "lucide-react";


import type { AttendanceSettingsInput } from "@/modules/settings/schemas/attendance-settings.schema";
import LocationMap from "./LocationMap";

import { useReverseGeocoding } from "@/app/components/dashboard/settings/attendance/hooks/useReverseGeocoding";

type Props = {
  settings: AttendanceSettingsInput;
  setSettings: Dispatch<
    SetStateAction<AttendanceSettingsInput>
  >;
};

export default function RestaurantLocationCard({
  settings,
  setSettings,
}: Props) {
  const [loadingLocation, setLoadingLocation] =
    useState(false);

  const [editingCoordinates, setEditingCoordinates] =
    useState(false);

    const [selectedAddress, setSelectedAddress] =
  useState("");

    const {
  address,
  loading: loadingAddress,
} = useReverseGeocoding(
  settings.attendance_latitude,
  settings.attendance_longitude,
);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
  setSettings((previous) => ({
    ...previous,
    attendance_latitude: position.coords.latitude,
    attendance_longitude: position.coords.longitude,
    attendance_location_accuracy: Math.round(
      position.coords.accuracy,
    ),
  }));

  setLoadingLocation(false);
},
      (error) => {
        setLoadingLocation(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied.");
            break;

          case error.POSITION_UNAVAILABLE:
            alert("Unable to determine your location.");
            break;

          case error.TIMEOUT:
            alert("Location request timed out.");
            break;

          default:
            alert("Unable to fetch location.");
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
    <section className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
      <div className="border-b border-[var(--color-border)] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)]">
            <MapPin className="h-7 w-7 text-[var(--color-primary)]" />
          </div>

          <div>
            <h2 className="text-2xl font-black">
              Restaurant Location
            </h2>

            <p className="text-sm text-[var(--color-text-muted)]">
              Staff attendance is validated using
              this location.
            </p>
          </div>
        </div>
      </div>



      <div className="space-y-6 p-6">
        {/* Use Current Location */}

        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={loadingLocation}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 font-bold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loadingLocation ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Getting Current Location...
            </>
          ) : (
            <>
              <LocateFixed className="h-5 w-5" />
              Use Current Location
            </>
          )}
        </button>

        

        <div className="grid gap-5 sm:flex justify-between">

          {/* Latitude */}

        <div>
          <label className="mb-2 block text-sm font-bold text-center">
            Latitude
          </label>

          <input
            type="number"
            step="any"
            readOnly={!editingCoordinates}
            value={
              settings.attendance_latitude ?? ""
            }
            onChange={(e) =>
              setSettings((previous) => ({
                ...previous,
                attendance_latitude:
                  e.target.value === ""
                    ? null
                    : Number(e.target.value),
              }))
            }
            className={`h-12 w-fit text-center rounded-xl border px-2 outline-none transition ${
              editingCoordinates
                ? "border-[var(--color-primary)] bg-transparent"
                : "cursor-not-allowed border-[var(--color-border)] bg-gray-100 dark:bg-neutral-900"
            }`}
          />
        </div>

        {/* Longitude */}

        <div>
          <label className="mb-2 block text-sm font-bold text-center">
            Longitude
          </label>

          <input
            type="number"
            step="any"
            readOnly={!editingCoordinates}
            value={
              settings.attendance_longitude ?? ""
            }
            onChange={(e) =>
              setSettings((previous) => ({
                ...previous,
                attendance_longitude:
                  e.target.value === ""
                    ? null
                    : Number(e.target.value),
              }))
            }
            className={`h-12 w-fit text-center rounded-xl border px-2 outline-none transition ${
              editingCoordinates
                ? "border-[var(--color-primary)] bg-transparent"
                : "cursor-not-allowed border-[var(--color-border)] bg-gray-100 dark:bg-neutral-900"
            }`}
          />
        </div>

        </div>

        


        {/* Interactive Map */}
<LocationMap
  latitude={settings.attendance_latitude}
  longitude={settings.attendance_longitude}
  radius={settings.attendance_radius}
  onLocate={useCurrentLocation}
  onLocationChange={(latitude, longitude) =>
  setSettings((previous) => ({
    ...previous,
    attendance_latitude: latitude,
    attendance_longitude: longitude,
  }))
}
/>

{selectedAddress && (
  <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-primary-soft)] p-4">
    <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
      Selected Address
    </p>

    <p className="mt-2 text-sm leading-6">
      {selectedAddress}
    </p>
  </div>
)}

        {/* Success */}

        {settings.attendance_latitude !== null &&
  settings.attendance_longitude !== null && (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-emerald-600" />

        <span className="font-bold text-emerald-700 dark:text-emerald-300">
          Selected Restaurant Location
        </span>
      </div>

      <p className="mt-3 text-sm leading-6">
        {loadingAddress
          ? "Finding address..."
          : address}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-5 border-t border-emerald-200 pt-4 dark:border-emerald-800">
        <div>
          <p className="text-xs uppercase text-[var(--color-text-muted)]">
            GPS Accuracy
          </p>

          <p className="font-black">
            {settings.attendance_location_accuracy ??
              "--"}{" "}
            m
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-[var(--color-text-muted)]">
            Attendance Radius
          </p>

          <p className="font-black">
            {settings.attendance_radius} m
          </p>
        </div>
      </div>
    </div>
)}
      </div>
    </section>
  );
}