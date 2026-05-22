import { AlertCircle, PackageOpen } from "lucide-react";

type StateBlockProps = {
  type: "empty" | "error";
  title: string;
  description: string;
};

export function StateBlock({ type, title, description }: StateBlockProps) {
  const Icon = type === "error" ? AlertCircle : PackageOpen;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-8 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10">
        <Icon className="size-5 text-[var(--color-gold)]" strokeWidth={1.8} />
      </div>

      <h3 className="mt-5 font-heading text-3xl font-semibold text-[var(--color-text)]">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
        {description}
      </p>
    </div>
  );
}