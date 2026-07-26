import type { CustomerTheme } from "../types/theme";

type Props = {
  theme: CustomerTheme;
  onChange: (
    updates: Partial<CustomerTheme>,
  ) => void;
};

export default function FeaturesSection({
  theme,
}: Props) {
  return (
    <div className="rounded-xl border bg-background p-6">
      <h2 className="text-lg font-semibold">
        Features
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Feature toggles will be added here.
      </p>
    </div>
  );
}