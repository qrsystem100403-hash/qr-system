"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import DashboardButton from "@/app/components/dashboard/ui/DashboardButton";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (tableNumber: number) => Promise<void>;
};

export default function CreateTableDialog({
  open,
  onOpenChange,
  onCreate,
}: Props) {
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    const value = Number(tableNumber);

    if (!value || value <= 0) return;

    try {
      setLoading(true);

      await onCreate(value);

      setTableNumber("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          shadow-2xl
        "
      >

        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--color-border)]
            p-6
          "
        >
          <div>
            <h2 className="text-xl font-bold">
              Create Table
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Generate a new QR-enabled dining table.
            </p>
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="
              rounded-xl
              p-2
              transition-colors
              hover:bg-[var(--color-surface-hover)]
            "
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-5 p-6">

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
              "
            >
              Table Number
            </label>

            <input
              type="number"
              value={tableNumber}
              onChange={(e) =>
                setTableNumber(
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="Example: 12"
              autoFocus
              className="
                h-12
                w-full
                rounded-xl
                border
                border-[var(--color-border)]
                bg-transparent
                px-4
                outline-none
                focus:border-[var(--color-primary)]
              "
            />

          </div>

        </div>

        {/* Footer */}

        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            border-[var(--color-border)]
            p-6
          "
        >
          <DashboardButton
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </DashboardButton>

          <DashboardButton
            onClick={handleSubmit}
            disabled={!tableNumber || loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}

            Create Table
          </DashboardButton>
        </div>

      </div>
    </div>
  );
}