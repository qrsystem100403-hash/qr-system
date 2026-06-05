"use client"

import { useMemo, useState } from "react"
import {
  Coffee,
  IceCreamBowl,
  Pizza,
  Soup,
  Utensils,
  ChevronRight,
  ScanLine,
} from "lucide-react"
import { SectionHeading } from "./SectionHeading"
import { StateBlock } from "./StateBlock"

type Category = {
  id: string
  name: string
  parent_id?: string | null
  sort_order?: number | null
  is_active?: boolean | null
}

type RawMenuItem = {
  id: string
  name: string | null
  price: number | null
  image?: string | null
  category?: string | null
  description?: string | null
  is_available?: boolean | null
  category_id?: string | null
  tag?: string | null
  sort_order?: number | null
  menu_categories?:
    | {
        id: string
        name: string | null
        parent_id?: string | null
        sort_order?: number | null
        is_active?: boolean | null
      }
    | {
        id: string
        name: string | null
        parent_id?: string | null
        sort_order?: number | null
        is_active?: boolean | null
      }[]
    | null
}

type MenuPreviewProps = {
  items?: RawMenuItem[]
  categories?: Category[]
  error?: string | null
}

function getCategoryFromItem(item: RawMenuItem) {
  const category = Array.isArray(item.menu_categories)
    ? item.menu_categories[0]
    : item.menu_categories

  return category ?? null
}

function getIcon(name: string) {
  const lower = name.toLowerCase()

  if (lower.includes("pizza")) return Pizza
  if (lower.includes("dessert") || lower.includes("ice")) return IceCreamBowl
  if (lower.includes("coffee") || lower.includes("beverage")) return Coffee
  if (lower.includes("soup")) return Soup

  return Utensils
}

export function MenuPreview({
  items = [],
  categories = [],
  error,
}: MenuPreviewProps) {
  const mainCategories = useMemo(() => {
    const directMainCategories = categories.filter(
      (category) => !category.parent_id && category.is_active !== false
    )

    const categoryIdsUsedByItems = new Set(
      items
        .map((item) => item.category_id)
        .filter((id): id is string => Boolean(id))
    )

    return directMainCategories
      .filter((category) => categoryIdsUsedByItems.has(category.id))
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  }, [categories, items])

  const fallbackCategories = useMemo(() => {
    const names = Array.from(
      new Set(
        items
          .map((item) => item.category || getCategoryFromItem(item)?.name)
          .filter((name): name is string => Boolean(name))
      )
    )

    return names.map((name, index) => ({
      id: name,
      name,
      sort_order: index,
      is_active: true,
      parent_id: null,
    }))
  }, [items])

  const finalCategories =
    mainCategories.length > 0 ? mainCategories : fallbackCategories

  const [activeCategoryId, setActiveCategoryId] = useState(
    finalCategories[0]?.id ?? "all"
  )

  const activeCategory =
    finalCategories.find((category) => category.id === activeCategoryId) ??
    finalCategories[0]

  const visibleItems = useMemo(() => {
    if (!activeCategory) return []

    return items
      .filter((item) => {
        if (item.is_available === false) return false

        const itemCategory = getCategoryFromItem(item)

        return (
          item.category_id === activeCategory.id ||
          item.category === activeCategory.name ||
          itemCategory?.id === activeCategory.id ||
          itemCategory?.name === activeCategory.name
        )
      })
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .slice(0, 10)
  }, [items, activeCategory])

  return (
    <section id="menu" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="premium-container">
        <SectionHeading
          eyebrow="Explore"
          title="Our Menu"
          description="Every dish, a story. Every bite, a memory."
          align="center"
        />

        {error && (
          <div className="mt-10">
            <StateBlock
              type="error"
              title="Menu failed to load"
              description={error}
            />
          </div>
        )}

        {!error && finalCategories.length === 0 && (
          <div className="mt-10">
            <StateBlock
              type="empty"
              title="No menu categories found"
              description="Add active menu categories and items from the owner dashboard."
            />
          </div>
        )}

        {!error && finalCategories.length > 0 && (
          <>
            <div className="mx-auto mt-9 flex max-w-5xl gap-2 overflow-x-auto px-1 pb-3 sm:flex-wrap sm:justify-center sm:overflow-visible">
              {finalCategories.map((category) => {
                const isActive = category.id === activeCategory?.id
                const Icon = getIcon(category.name)

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategoryId(category.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                      isActive
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-black shadow-[0_0_35px_rgba(245,214,107,0.35)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] hover:border-[var(--color-border-gold)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <Icon className="size-4" />
                    {category.name}
                  </button>
                )
              })}
            </div>

            <div className="mx-auto mt-8 max-w-4xl rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)] sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-5">
                <div>
                  <h3 className="font-heading text-4xl font-normal leading-none sm:text-5xl">
                    {activeCategory?.name}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    {visibleItems.length} items showing
                  </p>
                </div>

                <div className="hidden items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold)] sm:flex">
                  Preview Only
                  <ChevronRight className="size-4" />
                </div>
              </div>

              {visibleItems.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    No items available in this category right now.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {visibleItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 py-4"
                    >
                      <div className="flex min-w-0 gap-3">
                        <div className="mt-1 grid size-5 shrink-0 place-items-center rounded border border-emerald-400 text-emerald-400">
                          <span className="size-2 rounded-full bg-emerald-400" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-[var(--color-text)] sm:text-base">
                              {item.name}
                            </h4>

                            {item.tag && (
                              <span className="rounded-md border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-gold)]">
                                {item.tag}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-text-muted)] sm:text-sm">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="shrink-0 font-heading text-xl text-[var(--color-gold)]">
                        ₹{item.price ?? 0}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 p-4 text-center">
                <div className="mx-auto mb-2 grid size-10 place-items-center rounded-full bg-[var(--color-gold)] text-black">
                  <ScanLine className="size-5" />
                </div>

                <p className="text-sm font-bold text-[var(--color-text)]">
                  View full menu by scanning your table QR code
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  This website menu is preview-only. Ordering opens from the QR
                  menu at your table.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}