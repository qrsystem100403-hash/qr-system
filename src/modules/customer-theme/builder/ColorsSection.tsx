"use client";

import type { CustomerTheme } from "../types/theme";
import ColorField from "./ColorField";

type Props = {
  theme: CustomerTheme;
  onChange: (updates: Partial<CustomerTheme>) => void;
};

export default function ColorsSection({
  theme,
  onChange,
}: Props) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Colors
        </h2>

        <p className="text-sm text-muted-foreground">
          Customize your customer menu palette.
        </p>
      </div>

      <div className="space-y-4">
        <ColorField
          label="Primary"
          value={theme.primaryColor}
          onChange={(primaryColor) =>
            onChange({ primaryColor })
          }
        />

        <ColorField
          label="Secondary"
          value={theme.secondaryColor}
          onChange={(secondaryColor) =>
            onChange({ secondaryColor })
          }
        />

        <ColorField
          label="Accent"
          value={theme.accentColor}
          onChange={(accentColor) =>
            onChange({ accentColor })
          }
        />

        <ColorField
          label="Background"
          value={theme.backgroundColor}
          onChange={(backgroundColor) =>
            onChange({ backgroundColor })
          }
        />

        <ColorField
          label="Surface"
          value={theme.surfaceColor}
          onChange={(surfaceColor) =>
            onChange({ surfaceColor })
          }
        />

        <ColorField
          label="Text"
          value={theme.textColor}
          onChange={(textColor) =>
            onChange({ textColor })
          }
        />

        <ColorField
          label="Muted Text"
          value={theme.mutedTextColor}
          onChange={(mutedTextColor) =>
            onChange({ mutedTextColor })
          }
        />
      </div>
    </section>
  );
}