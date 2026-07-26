"use client";

import { useState } from "react";
import {
  Loader2,
  Save,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  dirty: boolean;

  onSaved: () => void;

  form: {
    logo: string | null;

    name: string;

    tagline: string;

    phone: string;

    address: string;

    gst_number: string;

    fssai_number: string;
  };
};

export default function SaveButton({
  form,
  dirty,
  onSaved,
}: Props) {
  const [saving, setSaving] =
    useState(false);

  async function handleSave() {
    if (!dirty) return;

    try {
      setSaving(true);

      const response =
        await fetch(
          "/api/dashboard/settings/restaurant",
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
            "Unable to save restaurant profile.",
        );
      }

      toast.success(
        "Restaurant profile updated successfully.",
      );

      onSaved();
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to save restaurant profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      disabled={
        saving || !dirty
      }
      onClick={handleSave}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-4 font-bold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Saving...
        </>
      ) : dirty ? (
        <>
          <Save className="h-5 w-5" />
          Save Changes
        </>
      ) : (
        <>
          <CheckCircle2 className="h-5 w-5" />
          Saved
        </>
      )}
    </button>
  );
}