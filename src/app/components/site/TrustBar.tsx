const trustItems = [
  "Fast Food Favourites",
  "Artisan Cakes",
  "Premium Beverages",
  "Outdoor Seating",
  "Cozy Ambience",
  "Fresh Ingredients Daily",
  "Pure Vegetarian",
  "Quick QR Ordering",
];

export function TrustBar() {
  return (
    <section className="overflow-hidden bg-[var(--color-gold)] py-3 text-[var(--color-bg)]">
      <div className="flex w-max animate-trust-scroll items-center gap-10 whitespace-nowrap">
        {[...trustItems, ...trustItems].map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-10 text-xs font-normal uppercase tracking-[0.32em]"
          >
            <span className="text-sm">✦</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}