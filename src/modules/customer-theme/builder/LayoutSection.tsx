"use client";

import {
  MENU_LAYOUTS,
  CATEGORY_LAYOUTS,
  CARD_STYLES,
  BUTTON_STYLES,
  BORDER_RADII,
} from "../runtime/constants/themeOptions";
import type { CustomerTheme } from "../types/theme";

type Props = {
  theme: CustomerTheme;
  onChange: (updates: Partial<CustomerTheme>) => void;
};

export default function LayoutSection({
  theme,
  onChange,
}: Props) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Layout
        </h2>

        <p className="text-sm text-muted-foreground">
          Control how your customer menu is displayed.
        </p>
      </div>

      <div className="space-y-8">

        {/* Menu Layout */}

        <OptionGroup
          title="Menu Layout"
          value={theme.menuLayout}
          options={MENU_LAYOUTS}
          onChange={(menuLayout) =>
            onChange({ menuLayout })
          }
        />

        {/* Category Layout */}

        <OptionGroup
          title="Category Layout"
          value={theme.categoryLayout}
          options={CATEGORY_LAYOUTS}
          onChange={(categoryLayout) =>
            onChange({ categoryLayout })
          }
        />

        {/* Card Style */}

        <OptionGroup
          title="Card Style"
          value={theme.cardStyle}
          options={CARD_STYLES}
          onChange={(cardStyle) =>
            onChange({ cardStyle })
          }
        />

        {/* Button Style */}

        <OptionGroup
          title="Button Style"
          value={theme.buttonStyle}
          options={BUTTON_STYLES}
          onChange={(buttonStyle) =>
            onChange({ buttonStyle })
          }
        />

        {/* Radius */}

        <OptionGroup
          title="Border Radius"
          value={theme.borderRadius}
          options={BORDER_RADII}
          onChange={(borderRadius) =>
            onChange({ borderRadius })
          }
        />

        <OptionGroup
          title="Button Radius"
          value={theme.buttonRadius}
          options={BORDER_RADII}
          onChange={(buttonRadius) =>
            onChange({ buttonRadius })
          }
        />

        <OptionGroup
          title="Card Radius"
          value={theme.cardRadius}
          options={BORDER_RADII}
          onChange={(cardRadius) =>
            onChange({ cardRadius })
          }
        />

        <OptionGroup
          title="Input Radius"
          value={theme.inputRadius}
          options={BORDER_RADII}
          onChange={(inputRadius) =>
            onChange({ inputRadius })
          }
        />

      </div>
    </section>
  );
}

type OptionGroupProps<T extends string> = {
  title: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

function OptionGroup<T extends string>({
  title,
  value,
  options,
  onChange,
}: OptionGroupProps<T>) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium">
        {title}
      </label>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              value === option
                ? "border-primary bg-primary text-white"
                : "hover:bg-muted"
            }`}
          >
            {option.replaceAll("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}