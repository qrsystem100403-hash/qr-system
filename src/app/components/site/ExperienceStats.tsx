import {
  BadgeCheck,
  Heart,
  ShieldCheck,
  Sparkles,
  Star,
  Utensils,
} from "lucide-react"

const trustItems = [
  {
    icon: BadgeCheck,
    title: "100% Pure Vegetarian",
    description:
      "Every ingredient, every dish — completely plant-based and meat-free.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Our chefs pour passion into every plate. No shortcuts, no compromise.",
  },
  {
    icon: ShieldCheck,
    title: "Fresh Daily",
    description:
      "Ingredients sourced fresh every morning. No preservatives, no frozen shortcuts.",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    description:
      "From ambience to plating, every detail is crafted for a luxury dining experience.",
  },
]

const stats = [
  {
    value: "1,000+",
    label: "Happy Guests Monthly",
  },
  {
    value: "10+",
    label: "Years of Excellence",
  },
  {
    value: "400+",
    label: "Menu Items",
  },
  {
    value: "4.9",
    label: "Average Rating",
    icon: Star,
  },
]

export function ExperienceStats() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="premium-container">
        <div className="grid gap-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="group text-center"
              >
                <div className="mx-auto grid size-12 place-items-center rounded-full border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)] transition group-hover:bg-[var(--color-gold)] group-hover:text-black">
                  <Icon className="size-5" />
                </div>

                <h3 className="mt-5 text-sm font-bold text-[var(--color-text)]">
                  {item.title}
                </h3>

                <p className="mx-auto mt-2 max-w-[230px] text-xs leading-5 text-[var(--color-text-muted)]">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid border-t border-[var(--color-border)] py-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="flex items-center justify-center gap-3 border-[var(--color-border)] py-6 text-center lg:border-r last:lg:border-r-0"
              >
                {Icon && (
                  <Icon className="size-8 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                )}

                <div>
                  <p className="font-heading text-4xl font-normal leading-none text-[var(--color-gold)]">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">
                    {stat.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
    </section>
  )
}