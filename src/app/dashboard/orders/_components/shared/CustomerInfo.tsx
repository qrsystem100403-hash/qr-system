import { Phone, User2 } from "lucide-react";

type Props = {
  name: string | null;
  phone?: string | null;
};

export default function CustomerInfo({
  name,
  phone,
}: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">

      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-[var(--color-primary-soft)]
          text-[var(--color-primary)]
        "
      >
        <User2 className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-xs text-[var(--color-text-muted)]">
          Customer
        </p>

        <p className="truncate text-sm font-medium text-[var(--color-heading)]">
          {name || "Walk-in Customer"}
        </p>

        {phone && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <Phone className="h-3.5 w-3.5" />
            <span>{phone}</span>
          </div>
        )}

      </div>

    </div>
  );
}