import { MenuCard } from "./MenuCard";
import { SectionHeading } from "./SectionHeading";
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

type MenuPreviewProps = {
  items: MenuItem[];
  error?: string | null;
};

export function MenuPreview({ items, error }: MenuPreviewProps) {
  const visibleItems = items.slice(0, 6);

  return (
    <section id="menu" className="relative py-24">
      <div className="premium-container">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Freshly Prepared"
            title="Signature Menu"
            description="Browse live dishes directly from the restaurant database. Owner updates appear here automatically."
          />

          <div className="hidden h-px flex-1 bg-gradient-to-r from-[var(--color-border-gold)] to-transparent lg:block" />
        </div>

        {error && (
          <StateBlock
            type="error"
            title="Menu failed to load"
            description={error}
          />
        )}

        {!error && visibleItems.length === 0 && (
          <StateBlock
            type="empty"
            title="No menu items found"
            description="Add menu items from the owner dashboard and they will appear here."
          />
        )}

        {!error && visibleItems.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}