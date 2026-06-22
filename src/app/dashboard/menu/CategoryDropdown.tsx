"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type Category = {
  id: string;
  name: string;
  parent?: {
    name: string;
  } | null;
};

type Props = {
  categories: Category[];
  activeCategory: string;
};

export default function CategoryDropdown({
  categories,
  activeCategory,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const selected =
    activeCategory === "all"
      ? "All Categories"
      : categories.find(
          (category) =>
            category.id ===
            activeCategory
        );

  return (
  <div className="relative lg:w-72">
    <input
      type="hidden"
      name="category"
      value={activeCategory}
    />

    <button
      type="button"
      onClick={() =>
        setOpen(!open)
      }
      className="
        flex
        h-12
        w-full
        items-center
        justify-between
        rounded-2xl
        border
        border-[#E4DED3]
        bg-white
        px-4
        text-sm
        font-medium
        text-[#111827]
        shadow-sm
        transition
        hover:border-[#D0D5DD]
        dark:border-[#2A2F35]
        dark:bg-[#171A1F]
        dark:text-[#E7E9EC]
        dark:hover:border-[#3A4048]
      "
    >
      <span className="truncate">
        {typeof selected === "string"
          ? selected
          : selected?.parent?.name
          ? `${selected.parent.name} • ${selected.name}`
          : selected?.name}
      </span>

      <ChevronDown
        className={`size-4 transition-transform duration-200 ${
          open
            ? "rotate-180"
            : ""
        }`}
      />
    </button>

    {open && (
      <div
        className="
          absolute
          top-14
          z-50
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-[#E4DED3]
          bg-white
          shadow-xl
          dark:border-[#2A2F35]
          dark:bg-[#171A1F]
        "
      >
        <div
          className="
            sticky
            top-0
            z-10
            border-b
            border-[#E4DED3]
            bg-white
            px-4
            py-3
            text-[11px]
            font-semibold
            uppercase
            tracking-wider
            text-[#667085]
            dark:border-[#2A2F35]
            dark:bg-[#171A1F]
            dark:text-[#AAB2BD]
          "
        >
          Categories
        </div>

        <div
          className="
            max-h-[320px]
            overflow-y-auto
            scroll-smooth
          "
        >
          <a
            href="/dashboard/menu"
            className="
              flex
              items-center
              justify-between
              px-4
              py-3
              text-sm
              text-[#111827]
              transition
              hover:bg-[#F7F8FA]
              dark:text-[#E7E9EC]
              dark:hover:bg-[#20242A]
            "
          >
            <span>
              All Categories
            </span>

            {activeCategory ===
              "all" && (
              <Check className="size-4 text-[#2F7D57] dark:text-[#7BC99A]" />
            )}
          </a>

          {categories.map(
            (category) => (
              <a
                key={category.id}
                href={`?category=${category.id}`}
                className="
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3
                  text-sm
                  text-[#111827]
                  transition
                  hover:bg-[#F7F8FA]
                  dark:text-[#E7E9EC]
                  dark:hover:bg-[#20242A]
                "
              >
                <span className="truncate pr-3">
                  {category.parent
                    ?.name
                    ? `${category.parent.name} • ${category.name}`
                    : category.name}
                </span>

                {activeCategory ===
                  category.id && (
                  <Check className="size-4 shrink-0 text-[#2F7D57] dark:text-[#7BC99A]" />
                )}
              </a>
            )
          )}
        </div>
      </div>
    )}
  </div>
);
}