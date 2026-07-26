"use client";

type Props = {
  open: boolean;
  value: string;
  loading?: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function OtherRequestModal({
  open,
  value,
  loading = false,
  onChange,
  onClose,
  onSubmit,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#121212] p-6 shadow-2xl">

        <h2 className="text-xl font-black">
          Other Request
        </h2>

        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Tell the restaurant what you need.
        </p>

        <textarea
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          rows={5}
          maxLength={150}
          placeholder="Example: Need a baby chair..."
          className="mt-5 w-full resize-none rounded-2xl border border-white/[0.08] bg-black/20 p-4 outline-none transition focus:border-[var(--color-border-gold)]"
        />

        <div className="mt-6 flex gap-3">

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/[0.08] py-3 font-bold"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              loading ||
              value.trim().length === 0
            }
            onClick={onSubmit}
            className="flex-1 rounded-2xl bg-[var(--color-gold)] py-3 font-black text-black transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>

        </div>

      </div>
    </div>
  );
}