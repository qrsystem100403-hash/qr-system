"use client";

import { useEffect } from "react";
import {
  Circle,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import LocationPin from "@/app/components/dashboard/settings/attendance/LocationPin";
import LocationControls from "@/app/components/dashboard/settings/attendance/LocationControls";

type Props = {
  latitude: number;
  longitude: number;
  radius?: number;
  onLocationChange(
    latitude: number,
    longitude: number,
  ): void;
  onLocate(): void;
};

function MapUpdater({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([latitude, longitude], map.getZoom(), {
      animate: true,
      duration: 1,
    });
  }, [latitude, longitude, map]);

  return null;
}

function MapEvents({
  onLocationChange,
}: {
  onLocationChange(
    latitude: number,
    longitude: number,
  ): void;
}) {
  const map = useMap();

  useEffect(() => {
    function updateCenter() {
      const center = map.getCenter();

      onLocationChange(
        center.lat,
        center.lng,
      );
    }

    map.on("moveend", updateCenter);

    return () => {
      map.off("moveend", updateCenter);
    };
  }, [map, onLocationChange]);

  return null;
}

export default function LocationMapClient({
  latitude,
  longitude,
  radius = 100,
  onLocationChange,
  onLocate,
}: Props) {
  return (
    <div className="relative">
      <MapContainer
  center={[latitude, longitude]}
  zoom={18}
  zoomControl={false}
  scrollWheelZoom
  doubleClickZoom
  dragging
  touchZoom
  className="h-[430px] w-full rounded-2xl"
>
  <ChangeView
  latitude={latitude}
  longitude={longitude}
/>
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        <MapEvents
          onLocationChange={
            onLocationChange
          }
        />

        <Circle
  center={[latitude, longitude]}
  radius={radius}
  pathOptions={{
    color: "#2563eb",
    fillColor: "#3b82f6",
    fillOpacity: 0.15,
    weight: 2,
  }}
/>
      </MapContainer>

      <LocationPin />

      <LocationControls
        onLocate={onLocate}
      />
      
    </div>
  );
}

function ChangeView({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(
      [latitude, longitude],
      map.getZoom(),
      {
        animate: true,
        duration: 1.2,
      },
    );
  }, [latitude, longitude, map]);

  return null;
}