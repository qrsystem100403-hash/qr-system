import { MenuCard } from "./MenuCard";
import { StateBlock } from "./StateBlock";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  category?: string | null;
  description?: string | null;
  is_available?: boolean | null;
};

type Props = {
  items: MenuItem[];
  error?: string | null;
};

export function FeaturedDishes({ items, error }: Props) {
  const featuredItems = items
    .filter((item) => item.is_available !== false)
    .slice(0, 4);

  return (
    <section id="featured" className="relative py-20">
      <div className="premium-container">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[var(--color-gold)]">
            Our Signatures
          </p>

          <h2 className="font-heading text-5xl font-normal text-[var(--color-text)] md:text-6xl">
            Featured{" "}
            <span className="italic text-[var(--color-gold)]">Dishes</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
            Crafted with care, plated with precision — our most loved vegetarian dishes.
          </p>
        </div>

        {error && (
          <StateBlock
            type="error"
            title="Featured dishes failed to load"
            description={error}
          />
        )}

        {!error && featuredItems.length === 0 && (
          <StateBlock
            type="empty"
            title="No featured dishes found"
            description="Add menu items from the owner dashboard."
          />
        )}

        {!error && featuredItems.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featuredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}