import { IndianRupee, Plus, Sparkles } from "lucide-react";

type MenuCardProps = {
  item: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
    category?: string | null;
    description?: string | null;
    is_available?: boolean | null;
  };
};

export function MenuCard({ item }: MenuCardProps) {
  const imageSrc = item.image || "/images/restaurant-hero.png";
  const isAvailable = item.is_available ?? true;

  return (
    <article className="group overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/80 p-3 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-border-gold)]">
      <div className="relative h-56 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
        <img
          src={imageSrc}
          alt={item.name}
          className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {item.category && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/80 backdrop-blur-md">
            <Sparkles
              className="size-3 text-[var(--color-gold)]"
              strokeWidth={1.8}
            />
            {item.category}
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 grid place-items-center bg-black/65 backdrop-blur-sm">
            <span className="rounded-full border border-red-400/40 bg-red-500/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-red-200">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-3xl font-semibold leading-none text-[var(--color-text)]">
            {item.name}
          </h3>

          <div className="flex shrink-0 items-center font-heading text-3xl font-semibold text-[var(--color-gold)]">
            <IndianRupee className="size-5" strokeWidth={2} />
            {item.price}
          </div>
        </div>

        {item.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
            {item.description}
          </p>
        )}

        <button
          type="button"
          disabled={!isAvailable}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-gold)] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--color-bg)] transition duration-300 hover:bg-[var(--color-gold-soft)] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
        >
          <Plus className="size-4" strokeWidth={2.2} />
          Add
        </button>
      </div>
    </article>
  );
}