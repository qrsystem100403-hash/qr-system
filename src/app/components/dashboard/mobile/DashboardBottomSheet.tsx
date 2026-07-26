"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import {
  ReactNode,
  useRef,
  useState,
  TouchEvent,
} from "react";


type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
};

export default function DashboardBottomSheet({
  open,
  onOpenChange,
  title,
  children,
}: Props) {

  const container =
  typeof document !== "undefined"
    ? document.getElementById("dashboard-root")
    : undefined;

const startY = useRef(0);

const contentRef =
  useRef<HTMLDivElement>(null);

const [dragY, setDragY] =
  useState(0);

const [dragging, setDragging] =
  useState(false);

  const handleTouchStart = (
  e: TouchEvent<HTMLDivElement>
) => {
  if (
    contentRef.current &&
    contentRef.current.scrollTop > 0
  ) {
    return;
  }

  startY.current =
    e.touches[0].clientY;

  setDragging(true);
};

const handleTouchMove = (
  e: React.TouchEvent<HTMLDivElement>
) => {
  if (!dragging) return;

  const delta =
    e.touches[0].clientY -
    startY.current;

  if (delta > 0) {
    setDragY(delta);
  }
};

const handleTouchEnd = () => {
  if (!dragging) return;

  setDragging(false);

  if (dragY > 120) {
    onOpenChange(false);
  }

  setDragY(0);
};

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal container={container}>
        <Dialog.Backdrop
          className="
            fixed
            inset-0
            z-[999]
            bg-black/40
            
          "
        />

       <Dialog.Popup
  style={{
    transform: `translateY(${dragY}px)`,
    transition: dragging
      ? "none"
      : "transform .22s ease",
  }}
  className="
    fixed
    bottom-0
    left-0
    right-0
    z-[1000]

    rounded-t-[25px]

    border-t
    border-[var(--color-border)]

    bg-[var(--color-surface)]

    shadow-[0_-8px_40px_rgba(15,23,42,.18)]

    max-h-[92dvh]

    overflow-hidden

    animate-in
    slide-in-from-bottom
  "
>
          <div className="flex justify-center py-3"
          onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  >

  <div
    className="
      h-1.5
      w-12
      rounded-full
      bg-[var(--color-border)]
    "
  />

</div>

          {title && (
  <div
    className="
      mb-5
      flex
      items-center
      justify-between
      px-5
    "
  >
    <h2
      className="
        text-lg
        font-bold
        text-[var(--color-heading)]
      "
    >
      {title}
    </h2>

    <button
      onClick={() => onOpenChange(false)}
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        hover:bg-[var(--color-surface-hover)]
      "
    >
      <X className="size-5" />
    </button>
  </div>
)}

          <div
  ref={contentRef}
  className="
    max-h-[calc(92dvh-28px)]
    overflow-y-auto
    overscroll-contain
  "
>
  {children}
</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}