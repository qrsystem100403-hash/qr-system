import { Clock, MapPin, Star, Trophy } from "lucide-react";
import { PremiumButton } from "./PremiumButton";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative h-[100svh] min-h-[680px] overflow-hidden pt-16 md:pt-20"
    >
      <div className="absolute inset-0">
        <img
          src="/images/restaurant-hero.png"
          alt="Premium vegetarian restaurant food"
          className="h-full w-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-black/58" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/85" />
      </div>

      <div className="absolute left-10 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-5 xl:flex">
        <span className="h-24 w-px bg-[var(--color-border-gold)]" />
        <span className="vertical-rl text-[10px] font-bold uppercase tracking-[0.45em] text-[var(--color-gold)]">
          Scroll Down
        </span>
        <span className="h-24 w-px bg-[var(--color-border-gold)]" />
      </div>

      <div className="premium-container relative z-10 flex h-full items-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_390px]">
          <div className="mx-auto w-full max-w-[690px] text-center lg:mx-0 lg:ml-[22%] lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-4 lg:justify-start">
              <span className="hidden h-px w-12 bg-[var(--color-border-gold)] sm:block" />
              <span className="grid size-5 place-items-center rounded-[6px] border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10">
                <span className="size-2 rounded-sm bg-[var(--color-success)]" />
              </span>
              <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[var(--color-gold)] sm:text-xs">
                Pure Vegetarian · Est. 2018
              </p>
            </div>

            <h1 className="font-heading text-[3.15rem] font-normal leading-[0.93] tracking-[-0.045em] text-[var(--color-text)] sm:text-[4.7rem] md:text-[5.8rem] xl:text-[6.45rem]">
              Where Every
              <br />
              <span className="gold-gradient-text italic">Bite Tells</span>
              <br />
              A Story
            </h1>

            <p className="mx-auto mt-5 max-w-[570px] text-xs leading-6 text-[var(--color-text-muted)] sm:text-sm md:text-base md:leading-8 lg:mx-0">
              A haven of flavours — sizzling fast food, rich North Indian
              curries, authentic Chinese, indulgent cakes & artisan beverages.
              All pure vegetarian.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <PremiumButton
                href="#menu"
                className="w-full rounded-none px-7 py-4 sm:w-auto"
              >
                Order Food Online
              </PremiumButton>

              <PremiumButton
                href="#menu"
                variant="outline"
                className="w-full rounded-none px-7 py-4 sm:w-auto"
              >
                Explore Our Menu
              </PremiumButton>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-4 md:gap-5">
              <BottomStat icon={<Star />} title="4.9/5.0" text="1,200+ Reviews" />
              <BottomStat icon={<MapPin />} title="City Center" text="Outdoor Seating" />
              <BottomStat icon={<Clock />} title="9 AM - 11 PM" text="Open Every Day" />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ml-auto w-full max-w-[330px] rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)]/82 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
                  <span className="size-2 rounded-full bg-[var(--color-success)]" />
                  Live Menu
                </p>

                <span className="grid size-5 place-items-center rounded border border-green-500/40">
                  <span className="size-2 rounded-sm bg-green-500" />
                </span>
              </div>

              <img
                src="/images/restaurant-hero.png"
                alt="Today special"
                className="h-24 w-full rounded-[14px] object-cover"
              />

              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]">
                Today&apos;s Special
              </p>

              <h3 className="mt-2 font-heading text-2xl font-normal text-[var(--color-text)]">
                Paneer Butter Masala
              </h3>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                with Garlic Naan & Raita
              </p>

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="font-heading text-3xl font-normal text-[var(--color-gold)]">
                  ₹280
                </p>

                <button className="rounded-2xl bg-[var(--color-gold)] px-7 py-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--color-bg)]">
                  Order
                </button>
              </div>
            </div>

            <div className="ml-auto mt-4 flex w-full max-w-[330px] items-center gap-4 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)]/82 p-4 backdrop-blur-xl">
              <div className="grid size-10 place-items-center rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                <Trophy className="size-4" />
              </div>

              <div>
                <p className="font-semibold text-[var(--color-text)]">
                  #1 Veg Restaurant
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  in City · Zomato 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BottomStat({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-1.5 border-r border-[var(--color-border)] px-1 py-2 last:border-r-0 sm:flex-row sm:gap-3 sm:px-3 sm:py-0 md:justify-start">
      <div className="grid size-7 shrink-0 place-items-center rounded-full border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)] sm:size-9 [&_svg]:size-3 sm:[&_svg]:size-4">
        {icon}
      </div>

      <div className="min-w-0 text-center sm:text-left">
        <p className="text-[9px] font-semibold leading-tight text-[var(--color-text)] sm:text-sm">
          {title}
        </p>
        <p className="mt-0.5 text-[8px] leading-tight text-[var(--color-text-muted)] sm:text-[11px]">
          {text}
        </p>
      </div>
    </div>
  );
}