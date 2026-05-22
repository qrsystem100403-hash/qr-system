"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  ChevronRight,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Timer,
} from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase/browser"
import { buildCartKey, useQRCartStore } from "@/store/qrCartStore"

type Category = {
  id: string
  name: string
  sort_order: number
  available_from: string | null
  available_until: string | null
  parent_id: string | null
}

type MenuAddon = {
  id: string
  name: string
  price: number
  sort_order: number
  is_active: boolean
}

type MenuVariant = {
  id: string
  name: string
  price: number
  sort_order: number
  is_available: boolean
  menu_item_addons?: MenuAddon[] | null
}

type MenuItem = {
  id: string
  restaurant_id: string
  name: string
  price: number
  category_id: string | null
  image: string | null
  is_available: boolean
  is_archived?: boolean
  menu_item_variants?: MenuVariant[] | null
}

type Props = {
  table: string
  restaurantId: string
  menu: MenuItem[]
}

type SelectionState = {
  variantId: string | null
  addonIds: string[]
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function smartMatch(search: string, ...values: string[]) {
  const query = normalizeText(search)
  if (!query) return true

  const queryWords = query.split(" ").filter(Boolean)
  const target = normalizeText(values.join(" "))

  return queryWords.every((word) => target.includes(word))
}

function getCurrentMinutesIndia() {
  const now = new Date()

  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now)

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0)

  return hour * 60 + minute
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function isCategoryAvailable(category: Category | null) {
  if (!category?.available_from && !category?.available_until) return true

  const current = getCurrentMinutesIndia()

  const from = category.available_from ? timeToMinutes(category.available_from) : 0

  const until = category.available_until
    ? timeToMinutes(category.available_until)
    : 24 * 60 - 1

  return current >= from && current <= until
}

function formatTime(time: string | null) {
  if (!time) return ""

  const [hourRaw, minute] = time.split(":")
  const hour = Number(hourRaw)

  const suffix = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12

  return `${displayHour}:${minute} ${suffix}`
}

function getAvailabilityText(category: Category | null) {
  if (!category) return null

  const { available_from, available_until } = category

  if (!available_from && !available_until) return null

  if (available_from && !available_until) {
    return `Available after ${formatTime(available_from)}`
  }

  if (!available_from && available_until) {
    return `Available until ${formatTime(available_until)}`
  }

  return `Available ${formatTime(available_from)} - ${formatTime(
    available_until
  )}`
}

function getActiveVariants(item: MenuItem) {
  return (item.menu_item_variants ?? [])
    .filter((variant) => variant.is_available)
    .sort((a, b) => a.sort_order - b.sort_order)
}

function getActiveAddons(variant: MenuVariant | null) {
  return (variant?.menu_item_addons ?? [])
    .filter((addon) => addon.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
}

export default function QRMenuClient({ table, restaurantId, menu }: Props) {
  const [liveMenu, setLiveMenu] = useState<MenuItem[]>(menu)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeMainCategoryId, setActiveMainCategoryId] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selections, setSelections] = useState<Record<string, SelectionState>>({})

  const addToCart = useQRCartStore((state) => state.addToCart)
  const cart = useQRCartStore((state) => state.cart)
  const increaseQuantity = useQRCartStore((state) => state.increaseQuantity)
  const decreaseQuantity = useQRCartStore((state) => state.decreaseQuantity)
  const hasHydrated = useQRCartStore((state) => state.hasHydrated)

  async function fetchMenuData() {
    const [
      { data: categoryData, error: categoryError },
      { data: itemData, error: itemError },
    ] = await Promise.all([
      supabaseBrowser
        .from("menu_categories")
        .select("id, name, sort_order, available_from, available_until, parent_id")
        .eq("restaurant_id", restaurantId)
        .eq("is_active", true),

      supabaseBrowser
        .from("menu_items")
        .select(`
          id,
          restaurant_id,
          name,
          price,
          category_id,
          image,
          is_available,
          is_archived,
          menu_item_variants (
            id,
            name,
            price,
            sort_order,
            is_available,
            menu_item_addons (
              id,
              name,
              price,
              sort_order,
              is_active
            )
          )
        `)
        .eq("restaurant_id", restaurantId)
        .eq("is_archived", false),
    ])

    if (categoryError) console.error("CATEGORY FETCH ERROR:", categoryError)
    if (itemError) console.error("MENU FETCH ERROR:", itemError)

    setCategories((categoryData ?? []) as Category[])
    setLiveMenu((itemData ?? []) as unknown as MenuItem[])
  }

  useEffect(() => {
    fetchMenuData()
  }, [restaurantId])

  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`qr-menu-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_items",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        fetchMenuData
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_categories",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        fetchMenuData
      )
      .subscribe()

    return () => {
      supabaseBrowser.removeChannel(channel)
    }
  }, [restaurantId])

  const mainCategories = useMemo(() => {
    return categories
      .filter((cat) => cat.parent_id === null)
      .sort((a, b) => a.sort_order - b.sort_order)
  }, [categories])

  const subCategories = useMemo(() => {
    return categories
      .filter((cat) => cat.parent_id !== null)
      .sort((a, b) => a.sort_order - b.sort_order)
  }, [categories])

  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>()
    categories.forEach((category) => map.set(category.id, category))
    return map
  }, [categories])

  const visibleMainCategories =
    activeMainCategoryId === "all"
      ? mainCategories
      : mainCategories.filter((cat) => cat.id === activeMainCategoryId)

  if (!hasHydrated) {
    return (
      <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70 p-4 text-sm text-[var(--color-text-muted)]">
        Loading menu...
      </div>
    )
  }

  const restaurantCart = cart.filter((item) => item.restaurantId === restaurantId)

  const totalItems = restaurantCart.reduce((sum, item) => sum + item.quantity, 0)

  const totalAmount = restaurantCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  let renderedItemCount = 0

  return (
    <>
      <div className="sticky top-[65px] z-20 -mx-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 pb-3 pt-3 backdrop-blur-xl">
        <div className="relative mx-auto max-w-5xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes..."
            className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]/80 pl-11 pr-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-border-gold)]"
          />
        </div>

        <div className="mx-auto mt-3 flex max-w-5xl gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveMainCategoryId("all")}
            className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.1em] ${
              activeMainCategoryId === "all"
                ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                : "border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]"
            }`}
          >
            All
          </button>

          {mainCategories.map((category) => {
            const available = isCategoryAvailable(category)

            return (
              <button
                type="button"
                key={category.id}
                onClick={() => setActiveMainCategoryId(category.id)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.1em] ${
                  activeMainCategoryId === category.id
                    ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                    : "border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]"
                }`}
              >
                {category.name}
                {!available && <span className="ml-1.5">⏰</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-7 pb-28 pt-4">
        {visibleMainCategories.map((mainCategory) => {
          const childCategories = subCategories.filter(
            (cat) => cat.parent_id === mainCategory.id
          )

          const mainAvailable = isCategoryAvailable(mainCategory)
          const mainAvailabilityText = getAvailabilityText(mainCategory)

          const hasVisibleItemsInMain = childCategories.some((subCategory) => {
            return liveMenu.some((item) => {
              if (item.category_id !== subCategory.id) return false

              return smartMatch(
                searchQuery,
                item.name,
                subCategory.name,
                mainCategory.name
              )
            })
          })

          if (!hasVisibleItemsInMain) return null

          return (
            <section key={mainCategory.id}>
              <div className="mb-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                  Category
                </p>

                <h2 className="mt-1 font-heading text-3xl font-normal leading-none">
                  {mainCategory.name}
                </h2>

                {!mainAvailable && mainAvailabilityText && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-200">
                    <Timer className="size-3.5" />
                    {mainAvailabilityText}
                  </p>
                )}
              </div>

              <div className="space-y-5">
                {childCategories.map((subCategory) => {
                  const main = categoryMap.get(subCategory.parent_id ?? "")

                  const items = liveMenu
                    .filter((item) => {
                      if (item.category_id !== subCategory.id) return false

                      return smartMatch(
                        searchQuery,
                        item.name,
                        subCategory.name,
                        main?.name ?? ""
                      )
                    })
                    .sort((a, b) => a.name.localeCompare(b.name))

                  if (items.length === 0) return null

                  renderedItemCount += items.length

                  const subAvailable = isCategoryAvailable(subCategory)
                  const subAvailabilityText = getAvailabilityText(subCategory)

                  return (
                    <div key={subCategory.id}>
                      <div className="mb-2.5">
                        <h3 className="font-heading text-2xl font-normal">
                          {subCategory.name}
                        </h3>

                        {!subAvailable && subAvailabilityText && (
                          <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-300">
                            <Timer className="size-3.5" />
                            {subAvailabilityText}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-2.5 md:grid-cols-2">
                        {items.map((item) => {
                          const variants = getActiveVariants(item)
                          const selectedState = selections[item.id]
                          const selectedVariant =
                            variants.find(
                              (variant) => variant.id === selectedState?.variantId
                            ) ??
                            variants[0] ??
                            null

                          const addons = getActiveAddons(selectedVariant)
                          const selectedAddonIds =
                            selectedState?.addonIds.filter((addonId) =>
                              addons.some((addon) => addon.id === addonId)
                            ) ?? []

                          const selectedAddons = addons.filter((addon) =>
                            selectedAddonIds.includes(addon.id)
                          )

                          const itemPrice = selectedVariant?.price ?? item.price
                          const addonTotal = selectedAddons.reduce(
                            (sum, addon) => sum + addon.price,
                            0
                          )

                          const finalPrice = itemPrice + addonTotal

                          const cartKey = buildCartKey({
                            itemId: item.id,
                            variantId: selectedVariant?.id ?? null,
                            addonIds: selectedAddonIds,
                          })

                          const cartItem = restaurantCart.find(
                            (x) => x.cartKey === cartKey
                          )

                          const isUnavailable =
                            !item.is_available || !mainAvailable || !subAvailable

                          return (
                            <article
                              key={item.id}
                              className={`overflow-hidden rounded-2xl border bg-[var(--color-surface-soft)]/70 ${
                                isUnavailable
                                  ? "border-red-500/10 opacity-70"
                                  : "border-[var(--color-border)]"
                              }`}
                            >
                              <div className="flex gap-2.5 p-2.5">
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-black/30">
                                  <img
                                    src={item.image ?? "/images/restaurant-hero.png"}
                                    alt={item.name}
                                    className={`h-full w-full object-cover ${
                                      isUnavailable ? "grayscale" : ""
                                    }`}
                                  />

                                  {isUnavailable && (
                                    <div className="absolute inset-0 bg-black/45" />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                                        {subCategory.name}
                                      </p>

                                      <h2 className="mt-0.5 line-clamp-2 font-heading text-xl font-normal leading-[1.05]">
                                        {item.name}
                                      </h2>

                                      <p className="mt-1 text-base font-extrabold text-[var(--color-gold)]">
                                        ₹{finalPrice}
                                      </p>
                                    </div>

                                    {isUnavailable && (
                                      <span className="shrink-0 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-red-200">
                                        {!item.is_available ? "Out" : "Closed"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {variants.length > 0 && (
                                <div className="border-t border-[var(--color-border)] px-2.5 py-2">
                                  <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {variants.map((variant) => (
                                      <button
                                        key={variant.id}
                                        type="button"
                                        disabled={isUnavailable}
                                        onClick={() =>
                                          setSelections((prev) => ({
                                            ...prev,
                                            [item.id]: {
                                              variantId: variant.id,
                                              addonIds: [],
                                            },
                                          }))
                                        }
                                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold disabled:cursor-not-allowed disabled:opacity-40 ${
                                          selectedVariant?.id === variant.id
                                            ? "border-[var(--color-border-gold)] bg-[var(--color-gold)] text-[var(--color-bg)]"
                                            : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                                        }`}
                                      >
                                        {variant.name} ₹{variant.price}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {addons.length > 0 && (
                                <div className="border-t border-[var(--color-border)] px-2.5 py-2">
                                  <p className="mb-1.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                                    <Sparkles className="size-3 text-[var(--color-gold)]" />
                                    Add-ons
                                  </p>

                                  <div className="flex flex-wrap gap-1.5">
                                    {addons.map((addon) => {
                                      const checked = selectedAddonIds.includes(addon.id)

                                      return (
                                        <button
                                          key={addon.id}
                                          type="button"
                                          disabled={isUnavailable}
                                          onClick={() =>
                                            setSelections((prev) => {
                                              const current = prev[item.id] ?? {
                                                variantId:
                                                  selectedVariant?.id ?? null,
                                                addonIds: [],
                                              }

                                              const exists =
                                                current.addonIds.includes(addon.id)

                                              return {
                                                ...prev,
                                                [item.id]: {
                                                  variantId:
                                                    selectedVariant?.id ?? null,
                                                  addonIds: exists
                                                    ? current.addonIds.filter(
                                                        (id) => id !== addon.id
                                                      )
                                                    : [...current.addonIds, addon.id],
                                                },
                                              }
                                            })
                                          }
                                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold disabled:cursor-not-allowed disabled:opacity-40 ${
                                            checked
                                              ? "border-green-500/30 bg-green-500/15 text-green-300"
                                              : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                                          }`}
                                        >
                                          + {addon.name} ₹{addon.price}
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}

                              <div className="border-t border-[var(--color-border)] px-2.5 py-2">
                                {cartItem && !isUnavailable ? (
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                                      Added
                                    </p>

                                    <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 p-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          decreaseQuantity(cartItem.cartKey)
                                        }
                                        className="grid size-8 place-items-center rounded-lg bg-black/30 text-[var(--color-gold)]"
                                      >
                                        <Minus className="size-3.5" />
                                      </button>

                                      <span className="min-w-5 text-center text-sm font-extrabold">
                                        {cartItem.quantity}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          increaseQuantity(cartItem.cartKey)
                                        }
                                        className="grid size-8 place-items-center rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)]"
                                      >
                                        <Plus className="size-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      addToCart({
                                        cartKey,
                                        id: item.id,
                                        restaurantId: item.restaurant_id,
                                        name: item.name,
                                        basePrice: item.price,
                                        price: finalPrice,
                                        image: item.image,
                                        quantity: 1,
                                        variant: selectedVariant
                                          ? {
                                              id: selectedVariant.id,
                                              name: selectedVariant.name,
                                              price: selectedVariant.price,
                                            }
                                          : null,
                                        addons: selectedAddons.map((addon) => ({
                                          id: addon.id,
                                          name: addon.name,
                                          price: addon.price,
                                        })),
                                      })
                                    }
                                    disabled={isUnavailable}
                                    className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-[var(--color-gold)] px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-35"
                                  >
                                    {isUnavailable ? "Unavailable" : "Add"}
                                  </button>
                                )}
                              </div>
                            </article>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

        {renderedItemCount === 0 && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70 p-6 text-center">
            <div className="mx-auto grid size-11 place-items-center rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
              <Search className="size-5" />
            </div>

            <h2 className="mt-4 font-heading text-3xl font-normal">
              No items found
            </h2>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Try searching another dish or choose a different category.
            </p>
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border-gold)] bg-[var(--color-bg)]/95 p-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]/90 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--color-gold)] text-[var(--color-bg)]">
                <ShoppingBag className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold">
                  {totalItems} {totalItems === 1 ? "item" : "items"} added
                </p>
                <p className="text-sm font-bold text-[var(--color-gold)]">
                  ₹{totalAmount}
                </p>
              </div>
            </div>

            <Link
              href={`/qr/table/${table}/cart`}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-gold)] px-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--color-bg)]"
            >
              View Cart
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}