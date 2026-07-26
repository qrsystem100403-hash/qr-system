"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";

type Props = {
  form: {
    kitchen_display_enabled: boolean;
    cashier_dashboard_enabled: boolean;
    waiter_dashboard_enabled: boolean;
    online_orders_enabled: boolean;
    attendance_enabled: boolean;
    inventory_enabled: boolean;
  };
};

export default function SaveButton({
  form,
}: Props) {
  const [saving, setSaving] =
    useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      const response = await fetch(
        "/api/dashboard/settings/features",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ??
            "Failed to save.",
        );
      }

      alert(
        "Restaurant features updated.",
      );
    } catch (error) {
      console.error(error);

      alert(
        "Unable to save features.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className="
        inline-flex
        items-center
        gap-2
        rounded-2xl
        bg-[var(--color-primary)]
        px-6
        py-3
        font-bold
        text-white
        transition
        hover:opacity-90
        disabled:opacity-60
      "
    >
      {saving ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-5 w-5" />
          Save Features
        </>
      )}
    </button>
  );
}