"use client";

import { LocateFixed } from "lucide-react";

type Props = {
  onLocate(): void;
};

export default function LocationControls({
  onLocate,
}: Props) {
  return (
    <button
      type="button"
      onClick={onLocate}
      className="
      absolute
      bottom-5
      right-5
      z-[1000]
      flex
      h-12
      w-12
      items-center
      justify-center
      rounded-full
      bg-white
      shadow-xl
      transition
      hover:scale-105
    "
    >
      <LocateFixed className="h-5 w-5" />
    </button>
  );
}