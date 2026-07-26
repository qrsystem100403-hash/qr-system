import Link from "next/link";
import type { Category, MenuItem } from "./menu-types";
import Image from "next/image";
import EditMenuItemButton from "./EditMenuItemButton";

type Props = {
  item: MenuItem;
  category: Category | null;
  categories: Category[];
};

export default function MenuCard({
  item,
  category,
  categories,
}: Props) {
  return (
    <div
  className={`
    group
    flex
    flex-col
    overflow-hidden
    rounded-2xl
    border
    bg-[var(--color-surface)]
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-2xl
    cursor-pointer
    ${
      item.is_available
        ? "border-[var(--color-border)] hover:border-[var(--color-primary)]"
        : "border-[var(--color-border)] opacity-70"
    }
  `}
>
      {/* Image */}
      <div
  className="
    relative
    h-40
    overflow-hidden
    rounded-t-2xl
    bg-[var(--color-surface-soft)]
  "
>
  <Image
    src={item.image || "/images/restaurant-hero.png"}
    alt={item.name}
    fill
    sizes="(max-width: 640px) 100vw,
           (max-width: 1280px) 50vw,
           25vw"
    className="
      object-cover
      transition-transform
      duration-500
      group-hover:scale-110
    "
    unoptimized={!item.image}
  />

  <div
    className="
      absolute
      inset-0
      bg-gradient-to-t
      from-black/30
      via-transparent
      to-transparent
    "
  />

  <div className="absolute right-3 top-3">
    <span
      className={`
        rounded-full
        px-3
        py-1
        text-[11px]
        font-semibold
        text-white
        backdrop-blur-md
        ${
          item.is_available
            ? "bg-emerald-500/90"
            : "bg-zinc-900/80"
        }
      `}
    >
      {item.is_available ? "LIVE" : "HIDDEN"}
    </span>
  </div>
</div>

      {/* Content */}
      <div
        className="
          flex
          min-h-[220px]
          flex-col
          p-5
        "
      >
        {/* Top */}
        <div className="flex-1">
          <h3
            className="
              line-clamp-1
              text-lg
              font-bold
              text-[var(--color-heading)]
            "
          >
            {item.name}
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-[var(--color-text-muted)]
            "
          >
            {category?.parent?.name ?? "Menu"} •{" "}
            {category?.name ?? "Unassigned"}
          </p>

          <div className="mt-5">
            <p
              className="
                text-[11px]
                uppercase
                tracking-[0.18em]
                text-[var(--color-text-soft)]
              "
            >
              Price
            </p>

            <p
              className="
                mt-1
                text-2xl
                font-bold
                text-[var(--color-heading)]
              "
            >
              ₹
              {Number(item.price).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span
              className={`
                rounded-full
                px-2.5
                py-1
                text-[11px]
                font-semibold
                ${
                  item.is_available
                    ? `
                      bg-[var(--color-success-soft)]
                      text-[var(--color-success)]
                    `
                    : `
                      bg-zinc-200
                      text-zinc-700
                      dark:bg-zinc-800
                      dark:text-zinc-300
                    `
                }
              `}
            >
              {item.is_available
                ? "Available"
                : "Hidden"}
            </span>

            {item.tag && (
              <span
                className="
                  rounded-full
                  bg-[var(--color-primary-soft)]
                  px-2.5
                  py-1
                  text-[11px]
                  font-semibold
                  text-[var(--color-primary)]
                "
              >
                {item.tag}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          className="
            my-4
            h-px
            bg-[var(--color-border)]
          "
        />

        {/* Footer */}
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-xs
              text-[var(--color-text-muted)]
            "
          >
            Manage Item
          </span>

          <EditMenuItemButton
  item={item}
  categories={categories}
/>
        </div>
      </div>
    </div>
  );
}