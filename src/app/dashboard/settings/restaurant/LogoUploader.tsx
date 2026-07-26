"use client";

import { useRef, useState } from "react";
import {
  ImagePlus,
  Loader2,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  value: string | null;
  restaurantName: string;
  onChange: (url: string | null) => void;
};

export default function LogoUploader({
  value,
  restaurantName,
  onChange,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file,
      );

      const response =
        await fetch(
          "/api/dashboard/settings/upload",
          {
            method: "POST",
            body: formData,
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
            "Upload failed.",
        );
      }

      onChange(data.url);

      toast.success(
        "Logo uploaded successfully.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to upload logo.",
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value =
          "";
      }
    }
  }

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h3 className="text-lg font-bold">
        Restaurant Logo
      </h3>

      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Upload your restaurant logo. It
        will appear across your
        dashboard, receipts and menu.
      </p>

      <div className="mt-6 flex flex-col items-center">
        {value ? (
          <img
            src={value}
            alt={restaurantName}
            className="h-28 w-28 rounded-full border object-cover"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)]">
            <UtensilsCrossed className="h-10 w-10 text-[var(--color-text-muted)]" />
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() =>
              inputRef.current?.click()
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 font-medium text-white transition hover:brightness-110"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                Upload Logo
              </>
            )}
          </button>

          {value && (
            <button
              type="button"
              onClick={() =>
                onChange(null)
              }
              className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 font-medium text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          onChange={
            handleUpload
          }
        />
      </div>
    </div>
  );
}