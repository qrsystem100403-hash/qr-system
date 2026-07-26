"use client";

import {
  FONT_FAMILIES,
} from "../runtime/constants/themeOptions";
import type {
  CustomerTheme,
} from "../types/theme";

type Props = {
  theme: CustomerTheme;
  onChange: (
    updates: Partial<CustomerTheme>,
  ) => void;
};

export default function TypographySection({
  theme,
  onChange,
}: Props) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Typography
        </h2>

        <p className="text-sm text-muted-foreground">
          Choose the font used throughout
          your customer menu.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Font Family
          </label>

          <select
            value={theme.fontFamily}
            onChange={(e) =>
              onChange({
                fontFamily: e.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            {FONT_FAMILIES.map((font) => (
              <option
                key={font}
                value={font}
              >
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border p-5">
          <p
            style={{
              fontFamily:
                theme.fontFamily,
            }}
            className="space-y-3"
          >
            <span className="block text-2xl font-bold">
              Pizza Palace
            </span>

            <span className="block">
              The quick brown fox jumps
              over the lazy dog.
            </span>

            <span className="block font-semibold">
              ₹299 • Margherita Pizza
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}