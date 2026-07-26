"use client";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ColorField({
  label,
  value,
  onChange,
}: Props) {
  return (
    <div className="flex items-center gap-4 rounded-xl border p-4">
      <div
        className="h-12 w-12 rounded-lg border shadow-sm"
        style={{ backgroundColor: value }}
      />

      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium">
          {label}
        </label>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 font-mono"
        />
      </div>

      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-12 cursor-pointer rounded-lg border"
      />
    </div>
  );
}