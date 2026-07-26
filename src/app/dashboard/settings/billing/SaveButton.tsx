"use client";

import { useState } from "react";
import {
  Loader2,
  Save,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  form: {
    gst_enabled: boolean;
    gst_mode: string;
    gst_percent: number;
    service_charge_enabled: boolean;
    service_charge_type: string;
    service_charge_value: number;
    round_off_enabled: boolean;
    receipt_branding:
      | "logo"
      | "logo_name"
      | "name"
      | "compact";
  };

  dirty: boolean;

  onSaved: () => void;
};

export default function SaveButton({
  form,
  dirty,
  onSaved,
}: Props) {
  const [status, setStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  async function handleSave() {
    try {
      setStatus("saving");

      const response = await fetch(
        "/api/dashboard/settings/billing",
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

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ??
            "Failed to save settings.",
        );
      }

      toast.success(
        "Billing settings saved successfully.",
      );

      setStatus("saved");
      onSaved();

      setTimeout(() => {
        setStatus("idle");
      }, 2500);
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to save billing settings.",
      );

      setStatus("idle");
    }
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={
  status === "saving" || !dirty
}
      className="
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-2xl
        bg-[var(--color-primary)]
        px-6
        py-4
        font-semibold
        text-white
        transition-all
        duration-300
        hover:brightness-110
        hover:shadow-lg
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {status === "saving" && (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Saving...
        </>
      )}

      {status === "saved" && (
        <>
          <CheckCircle2 className="h-5 w-5" />
          Saved
        </>
      )}

      {status === "idle" && (
        <>
  <Save className="h-5 w-5" />
  {dirty
    ? "Save Changes"
    : "No Changes"}
</>
      )}
    </button>
  );
}