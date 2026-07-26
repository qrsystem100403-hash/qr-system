"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  FolderTree,
} from "lucide-react";

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
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const selected =
    activeCategory === "all"
      ? "All Categories"
      : categories.find(
          (category) => category.id === activeCategory,
        );

  const handleSelect = (categoryId: string) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }

    router.push(`?${params.toString()}`);

    setOpen(false);
  };

  return (
    <div className="relative w-full sm:w-72">

      <input
        type="hidden"
        name="category"
        value={activeCategory}
      />

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          group
          flex
          h-12
          w-full
          items-center
          justify-between
          rounded-xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          px-4
          transition-all
          duration-200
          hover:border-[var(--color-primary)]
          hover:shadow-md
        "
      >
        <div className="flex min-w-0 items-center gap-3">

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-[var(--color-primary-soft)]
              text-[var(--color-primary)]
            "
          >
            <FolderTree className="size-4" />
          </div>

          <div className="min-w-0 text-left">

            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
              Category
            </p>

            <p className="truncate text-sm font-semibold text-[var(--color-heading)]">
              {typeof selected === "string"
                ? selected
                : selected?.parent?.name
                ? `${selected.parent.name} • ${selected.name}`
                : selected?.name}
            </p>

          </div>

        </div>

        <ChevronDown
          className={`
            size-4
            text-[var(--color-text-muted)]
            transition-all
            duration-300
            ${
              open
                ? "rotate-180 text-[var(--color-primary)]"
                : ""
            }
          `}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <div
            className="
              absolute
              right-0
              top-14
              z-50
              w-full
              min-w-[340px]
              overflow-hidden
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              shadow-2xl
            "
          >

            <div
              className="
                border-b
                border-[var(--color-border)]
                bg-[var(--color-surface-soft)]
                px-5
                py-3
              "
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-soft)]">
                {categories.length} Categories
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">

              <button
                type="button"
                onClick={() =>
                  handleSelect("all")
                }
                className={`
                  mb-1
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  transition-all
                  duration-200
                  ${
                    activeCategory === "all"
                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "text-[var(--color-heading)] hover:bg-[var(--color-surface-soft)]"
                  }
                `}
              >
                <div>

                  <p className="font-semibold">
                    All Categories
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                    View complete menu
                  </p>

                </div>

                {activeCategory === "all" && (
                  <Check className="size-4" />
                )}
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    handleSelect(category.id)
                  }
                  className={`
                    mb-1
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    transition-all
                    duration-200
                    ${
                      activeCategory === category.id
                        ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                        : "text-[var(--color-heading)] hover:bg-[var(--color-surface-soft)]"
                    }
                  `}
                >

                  <div className="min-w-0">

                    <p className="truncate font-semibold">
                      {category.name}
                    </p>

                    {category.parent?.name && (
                      <p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
                        {category.parent.name}
                      </p>
                    )}

                  </div>

                  {activeCategory ===
                    category.id && (
                    <Check className="size-4 shrink-0" />
                  )}

                </button>
              ))}

            </div>

          </div>
        </>
      )}
    </div>
  );
}