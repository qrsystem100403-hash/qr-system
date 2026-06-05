import Image from "next/image";
import { CalendarCheck, Leaf, Users, Lamp, Award } from "lucide-react";

const highlights = [
  { icon: Leaf, title: "100% Vegetarian", text: "No meat, no compromise" },
  { icon: Users, title: "Family & Youth", text: "Welcoming all generations" },
  { icon: Lamp, title: "Cozy Ambience", text: "Warm lighting & comfort" },
  { icon: Award, title: "10+ Years", text: "Of culinary experience" },
];

export function AboutStory() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[var(--color-bg)] px-4 py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px w-10 bg-[var(--color-border-gold)]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[var(--color-gold)]">
            Our Story
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Images first on mobile */}
          <div className="relative order-1 mx-auto w-full max-w-[520px] lg:mx-0">
            <div className="absolute -left-2 -top-7 z-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/85 px-4 py-3 backdrop-blur">
              <p className="font-heading text-2xl leading-none text-[var(--color-gold)]">
                1.2k+
              </p>
              <p className="mt-1 text-[9px] font-bold text-[var(--color-text-muted)]">
                Happy Guests / Month
              </p>
            </div>

            <div className="relative overflow-hidden rounded-none">
              <Image
                src="/images/outdoor.jpg"
                alt="Friends Cafe interior"
                width={620}
                height={520}
                priority
                className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[470px] rounded-2xl"
              />
            </div>

            <div className="relative -mt-20 ml-auto w-[62%] overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[var(--shadow-soft)] sm:-mt-24 rounded-2xl">
              <Image
                src="/images/sitting.webp"
                alt="Friends Cafe outdoor seating"
                width={420}
                height={260}
                className="h-[120px] w-full object-cover sm:h-[170px]"
              />
            </div>
          </div>

          <div className="order-2">
            <h2 className="font-heading text-4xl leading-tight text-[var(--color-text)] sm:text-5xl lg:text-[58px]">
              More Than a Meal —{" "}
              <span className="italic text-[var(--color-gold)]">
                It&apos;s a Feeling
              </span>
            </h2>

            <div className="mt-6 space-y-4 text-sm font-medium leading-7 text-[var(--color-text-muted)] sm:text-[15px]">
              <p>
                Friends Cafe Chopati was born from a simple belief: food tastes better
                when it&apos;s made with care and shared in good company. Since
                2018, we&apos;ve been crafting a space where flavours meet
                memories — where every visit feels like coming home.
              </p>

              <p>
                Our menu spans the width of India and beyond — rich North Indian
                gravies, wok-tossed Chinese specialties, crispy fast food,
                artisan cakes, and curated beverages — all 100% vegetarian,
                always fresh, always soul-satisfying.
              </p>
            </div>

            <div className="mt-7 border-l border-[var(--color-border-gold)] pl-5">
              <p className="font-heading text-lg italic leading-7 text-[var(--color-text)]">
                “We don&apos;t just serve food. We serve experiences that keep
                you coming back.”
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                — The Friends Cafe Chopati Team
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#about"
                className="inline-flex items-center justify-center bg-[var(--color-gold)] px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-black"
              >
                Our Full Story
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 border border-[var(--color-border-gold)] px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-gold)]"
              >
                <CalendarCheck className="size-4" />
                Book a Table
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 px-5 py-6 text-center backdrop-blur"
              >
                <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full border border-[var(--color-border-gold)] text-[var(--color-gold)]">
                  <Icon className="size-5" />
                </div>

                <h3 className="font-heading text-lg text-[var(--color-text)]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}