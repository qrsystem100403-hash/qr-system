"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  EllipsisVertical,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

import type { RestaurantTable } from "../table-types";

type Props = {
  table: RestaurantTable;
  onRename: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TableCardMenu({
  table,
  onRename,
  onToggle,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  function closeAndRun(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <div
      ref={wrapperRef}
      className="relative shrink-0"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          text-[var(--color-text-muted)]
          transition-all
          duration-200
          hover:bg-[var(--color-surface-hover)]
          hover:text-[var(--color-heading)]
        "
      >
        <EllipsisVertical className="size-5" />
      </button>

      <div
        className={`
          absolute
          right-0
          top-11
          z-50
          w-56
          origin-top-right
          overflow-hidden
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          shadow-[0_20px_60px_rgba(0,0,0,.18)]
          transition-all
          duration-200
          ${
            open
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          }
        `}
      >
        <button
          onClick={() =>
            closeAndRun(onRename)
          }
          className="
            flex
            h-12
            w-full
            items-center
            gap-3
            px-4
            text-sm
            font-medium
            text-[var(--color-text)]
            transition-colors
            hover:bg-[var(--color-surface-hover)]
          "
        >
          <Pencil className="size-4" />
          Rename Table
        </button>

        <button
          onClick={() =>
            closeAndRun(onToggle)
          }
          className="
            flex
            h-12
            w-full
            items-center
            gap-3
            px-4
            text-sm
            font-medium
            text-[var(--color-text)]
            transition-colors
            hover:bg-[var(--color-surface-hover)]
          "
        >
          {table.is_active ? (
            <>
              <Power className="size-4" />
              Disable Table
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" />
              Enable Table
            </>
          )}
        </button>

        <div className="mx-3 h-px bg-[var(--color-border)]" />

        <button
          onClick={() =>
            closeAndRun(onDelete)
          }
          className="
            flex
            h-12
            w-full
            items-center
            gap-3
            px-4
            text-sm
            font-medium
            text-[var(--color-danger)]
            transition-colors
            hover:bg-[var(--color-danger-soft)]
          "
        >
          <Trash2 className="size-4" />
          Delete Table
        </button>
      </div>
    </div>
  );
}