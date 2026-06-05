"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Utensils,
  X,
} from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase/browser"
import { useQRCartStore } from "@/store/qrCartStore"

type Props = {
  table: string
  restaurantId: string
}

type Category = {
  id: string
  name: string
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

type LiveMenuItem = {
  id: string
  restaurant_id?: string
  name: string
  price: number
  image: string | null
  is_available: boolean
  is_archived: boolean
  category_id: string | null
  menu_item_variants?: MenuVariant[] | null
}

function getCurrentMinutesIndia() {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date())

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
  if (available_from && !available_until) return `Available after ${formatTime(available_from)}`
  if (!available_from && available_until) return `Available until ${formatTime(available_until)}`

  return `Available ${formatTime(available_from)} - ${formatTime(available_until)}`
}

function VegIcon() {
  return (
    <span className="grid size-4 shrink-0 place-items-center rounded-[4px] border border-green-500 bg-green-500/5">
      <span className="size-2 rounded-full bg-green-500" />
    </span>
  )
}

export default function QRCartClient({ table, restaurantId }: Props) {
  const router = useRouter()
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [loading, setLoading] = useState(false)
  const [customerNote, setCustomerNote] = useState("")
  const [liveItems, setLiveItems] = useState<Record<string, LiveMenuItem>>({})
  const [categories, setCategories] = useState<Record<string, Category>>({})
  const [errorMessage, setErrorMessage] = useState("")
  const [repeatTarget, setRepeatTarget] = useState<string | null>(null)
  const [customizingItem, setCustomizingItem] = useState<LiveMenuItem | null>(
    null
  )
  const [sheetSelection, setSheetSelection] = useState<{
    variantId: string | null
    addonIds: string[]
  }>({
    variantId: null,
    addonIds: [],
  })

  const cart = useQRCartStore((state) => state.cart)
  const hasHydrated = useQRCartStore((state) => state.hasHydrated)
  const clearRestaurantCart = useQRCartStore((state) => state.clearRestaurantCart)
  const increaseQuantity = useQRCartStore((state) => state.increaseQuantity)
  const decreaseQuantity = useQRCartStore((state) => state.decreaseQuantity)
  const removeFromCart = useQRCartStore((state) => state.removeFromCart)
  const updateCartItem = useQRCartStore((state) => state.updateCartItem)

  const restaurantCart = useMemo(
    () => cart.filter((item) => item.restaurantId === restaurantId),
    [cart, restaurantId]
  )

  const itemIdsKey = useMemo(
    () =>
      Array.from(new Set(restaurantCart.map((item) => item.id)))
        .sort()
        .join(","),
    [restaurantCart]
  )

  const total = useMemo(
    () => restaurantCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [restaurantCart]
  )

  const totalItems = useMemo(
    () => restaurantCart.reduce((sum, item) => sum + item.quantity, 0),
    [restaurantCart]
  )

  const fetchLiveData = useCallback(async () => {
  if (!itemIdsKey) {
    setLiveItems({})
    setCategories({})
    return
  }

  try {
    const itemIds = itemIdsKey.split(",")

    const response = await fetch("/api/qr/cart/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ itemIds }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      console.error("CART LIVE API ERROR:", data.error)
      return
    }

    const itemMap: Record<string, LiveMenuItem> = {}
    const categoryMap: Record<string, Category> = {}

    data.data.categories?.forEach((cat: Category) => {
      categoryMap[cat.id] = cat
    })

    data.data.items?.forEach((item: LiveMenuItem) => {
      itemMap[item.id] = item
    })

    const currentCart = useQRCartStore.getState().cart

    data.data.items?.forEach((item: LiveMenuItem) => {
      currentCart
        .filter((cartItem) => cartItem.restaurantId === restaurantId)
        .filter((cartItem) => cartItem.id === item.id)
        .forEach((cartItem) => {
          if (
            cartItem.name !== item.name ||
            cartItem.basePrice !== item.price ||
            cartItem.image !== item.image
          ) {
            updateCartItem(cartItem.cartKey, {
              name: item.name,
              basePrice: item.price,
              image: item.image,
            })
          }
        })
    })

    setLiveItems(itemMap)
    setCategories(categoryMap)
  } catch (error) {
    console.error("CART LIVE FETCH ERROR:", error)
  }
}, [itemIdsKey, restaurantId, updateCartItem])

  const scheduleLiveRefresh = useCallback(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current)
    refreshTimer.current = setTimeout(fetchLiveData, 400)
  }, [fetchLiveData])

  useEffect(() => {
    if (!hasHydrated) return

    const timer = setTimeout(fetchLiveData, 0)
    return () => clearTimeout(timer)
  }, [hasHydrated, fetchLiveData])

  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`qr-cart-menu-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_items",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        scheduleLiveRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_categories",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        scheduleLiveRefresh
      )
      .subscribe()

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current)
      supabaseBrowser.removeChannel(channel)
    }
  }, [restaurantId, scheduleLiveRefresh])

  function getItemCategories(item: LiveMenuItem | undefined) {
    if (!item?.category_id) {
      return { subCategory: null, mainCategory: null }
    }

    const subCategory = categories[item.category_id] ?? null
    const mainCategory = subCategory?.parent_id
      ? categories[subCategory.parent_id] ?? null
      : null

    return { subCategory, mainCategory }
  }

  function getActiveVariants(item: LiveMenuItem | null | undefined) {
    return (item?.menu_item_variants ?? [])
      .filter((variant) => variant.is_available)
      .sort((a, b) => a.sort_order - b.sort_order)
  }

  function getActiveAddons(variant: MenuVariant | null) {
    return (variant?.menu_item_addons ?? [])
      .filter((addon) => addon.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
  }

  function hasCustomizationOptions(item: LiveMenuItem | undefined) {
    const variants = getActiveVariants(item)

    return (
      variants.length > 0 ||
      variants.some((variant) =>
        (variant.menu_item_addons ?? []).some((addon) => addon.is_active)
      )
    )
  }

  function openCustomizeSheet(item: LiveMenuItem) {
    const variants = getActiveVariants(item)
    const firstVariant = variants[0] ?? null

    setCustomizingItem(item)
    setSheetSelection({
      variantId: firstVariant?.id ?? null,
      addonIds: [],
    })
  }

  function closeCustomizeSheet() {
    setCustomizingItem(null)
    setSheetSelection({
      variantId: null,
      addonIds: [],
    })
  }

  function addCustomizedItemToCart() {
    if (!customizingItem) return

    const variants = getActiveVariants(customizingItem)
    const selectedVariant =
      variants.find((variant) => variant.id === sheetSelection.variantId) ??
      variants[0] ??
      null

    const addons = getActiveAddons(selectedVariant)
    const selectedAddonIds = sheetSelection.addonIds.filter((addonId) =>
      addons.some((addon) => addon.id === addonId)
    )

    const selectedAddons = addons.filter((addon) =>
      selectedAddonIds.includes(addon.id)
    )

    const itemPrice = selectedVariant?.price ?? customizingItem.price
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0)
    const finalPrice = itemPrice + addonTotal

    const cartKey = [
      customizingItem.id,
      selectedVariant?.id ?? "base",
      ...selectedAddonIds.sort(),
    ].join("__")

    useQRCartStore.getState().addToCart({
      cartKey,
      id: customizingItem.id,
      restaurantId,
      name: customizingItem.name,
      basePrice: customizingItem.price,
      price: finalPrice,
      image: customizingItem.image,
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

    closeCustomizeSheet()
  }

  const unavailableCartItems = restaurantCart.filter((item) => {
    const liveItem = liveItems[item.id]
    if (!liveItem) return true

    const { subCategory, mainCategory } = getItemCategories(liveItem)

    return (
      !liveItem.is_available ||
      liveItem.is_archived ||
      !isCategoryAvailable(subCategory) ||
      !isCategoryAvailable(mainCategory)
    )
  })

  const hasUnavailableItems = unavailableCartItems.length > 0

  const placeOrder = async () => {
    if (!restaurantCart.length || loading || hasUnavailableItems) return

    setErrorMessage("")
    setLoading(true)

    try {
      const sanitizedCart = restaurantCart.map((item) => ({
        cartKey: item.cartKey,
        id: item.id,
        quantity: item.quantity,
        variant: item.variant ? { id: item.variant.id } : null,
        addons: item.addons.map((addon) => ({ id: addon.id })),
      }))

      const response = await fetch("/api/qr/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table,
          cart: sanitizedCart,
          customerNote: customerNote.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success || !data.orderId || !data.trackingToken) {
        setErrorMessage(data.error || "Order failed. Please try again.")
        return
      }

      clearRestaurantCart(restaurantId)
      setCustomerNote("")

      const params = new URLSearchParams({
        orderId: data.orderId,
        trackingToken: data.trackingToken,
      })

      router.push(`/qr/table/${encodeURIComponent(table)}/success?${params.toString()}`)
    } catch (error) {
      console.error(error)
      setErrorMessage("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!hasHydrated) {
    return (
      <div className="mx-auto mt-6 max-w-5xl px-4">
        <div className="h-28 animate-pulse rounded-[28px] border border-white/[0.08] bg-white/[0.03]" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-3 pb-36 pt-4 sm:px-4">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={`/qr/table/${encodeURIComponent(table)}`}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text-muted)] transition hover:border-[var(--color-border-gold)] hover:text-[var(--color-gold)]"
        >
          <ArrowLeft className="size-4" />
          Menu
        </Link>

        <div className="rounded-full border border-[var(--color-border-gold)]/70 bg-[var(--color-gold)]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-gold)] sm:text-xs">
          Table {table}
        </div>
      </div>

      {!restaurantCart.length ? (
        <div className="rounded-[32px] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-7 text-center shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
          <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
            <ShoppingBag className="size-8" />
          </div>

          <h1 className="mt-5 font-heading text-4xl font-normal leading-none">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--color-text-muted)]">
            Add dishes from the menu before placing your order.
          </p>

          <Link
            href={`/qr/table/${encodeURIComponent(table)}`}
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-6 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-bg)]"
          >
            Browse Menu
            <ChevronRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section>
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-gold)]">
                Review Order
              </p>

              <h1 className="mt-1 font-heading text-3xl font-normal leading-none tracking-[-0.04em] sm:text-4xl">
                Your Cart
              </h1>

              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {totalItems} {totalItems === 1 ? "item" : "items"} selected
              </p>
            </div>

            {hasUnavailableItems && (
              <div className="mb-4 rounded-3xl border border-red-500/25 bg-red-500/10 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-300" />
                  <div>
                    <p className="font-black text-red-200">
                      {unavailableCartItems.length} item
                      {unavailableCartItems.length > 1 ? "s are" : " is"} unavailable
                    </p>
                    <p className="mt-1 text-sm leading-5 text-red-200/75">
                      Remove unavailable item
                      {unavailableCartItems.length > 1 ? "s" : ""} to place your order.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 rounded-3xl border border-red-500/25 bg-red-500/10 p-4 text-sm font-bold text-red-200">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2.5">
              {restaurantCart.map((item, index) => {
                const liveItem = liveItems[item.id]
                const { subCategory, mainCategory } = getItemCategories(liveItem)

                const subAvailable = isCategoryAvailable(subCategory)
                const mainAvailable = isCategoryAvailable(mainCategory)

                const availabilityText = !mainAvailable
                  ? getAvailabilityText(mainCategory)
                  : !subAvailable
                    ? getAvailabilityText(subCategory)
                    : null

                const isUnavailable =
                  !liveItem ||
                  !liveItem.is_available ||
                  liveItem.is_archived ||
                  !subAvailable ||
                  !mainAvailable

                const currentName = liveItem?.name || item.name
                const currentImage = liveItem?.image ?? item.image
                const hasCustomization = !!item.variant || item.addons.length > 0

                return (
                  <article
                    key={item.cartKey}
                    className={`rounded-[22px] border border-white/[0.055] bg-white/[0.018] px-3 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition hover:border-[var(--color-border-gold)]/35 hover:bg-white/[0.026] sm:px-3.5 sm:py-3 ${
                      isUnavailable ? "border-red-500/25 bg-red-500/[0.04]" : ""
                    }`}
                  >
                    <div className="grid grid-cols-[56px_1fr] gap-3 sm:grid-cols-[64px_1fr] sm:gap-3.5">
                      <div className="relative size-14 overflow-hidden rounded-[16px] bg-black/35 sm:size-16">
                        <img
                          src={currentImage ?? "/placeholder-food.png"}
                          alt={currentName}
                          className={`h-full w-full object-cover ${
                            isUnavailable ? "grayscale opacity-50" : ""
                          }`}
                        />
                        {isUnavailable && <div className="absolute inset-0 bg-black/40" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <VegIcon />
                              <p className="truncate text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-gold)]">
                                {subCategory?.name ?? "Item"}
                              </p>
                            </div>

                            <h2 className="mt-0.5 line-clamp-1 text-[13px] font-black leading-tight tracking-[-0.02em] text-[var(--color-text)] sm:text-[15px]">
                              {currentName}
                            </h2>
                          </div>

                          <p className="shrink-0 text-sm font-black text-[var(--color-gold)]">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>

                        {hasCustomization && (
                          <div className="mt-2 rounded-xl border border-white/[0.06] bg-black/15 px-2 py-1.5">
                            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                              Customisation
                            </p>

                            {item.variant && (
                              <div className="flex justify-between gap-3 text-xs">
                                <span className="text-[var(--color-text-muted)]">
                                  Option
                                </span>
                                <span className="text-right font-bold text-[var(--color-text)]">
                                  {item.variant.name} · ₹{item.variant.price}
                                </span>
                              </div>
                            )}

                            {!!item.addons.length && (
                              <div className="mt-2 space-y-1">
                                {item.addons.map((addon) => (
                                  <div
                                    key={addon.id}
                                    className="flex justify-between gap-3 text-xs"
                                  >
                                    <span className="text-[var(--color-text-muted)]">
                                      + {addon.name}
                                    </span>
                                    <span className="font-bold text-[var(--color-gold)]">
                                      ₹{addon.price}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {isUnavailable && (
                          <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200">
                            {!liveItem
                              ? "This item was removed from the menu"
                              : !liveItem.is_available || liveItem.is_archived
                                ? "Out of stock"
                                : availabilityText ?? "Not available now"}
                          </div>
                        )}

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1 rounded-full border border-[var(--color-border-gold)]/55 bg-[var(--color-gold)]/8 p-0.5">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.cartKey)}
                              className="grid size-8 place-items-center rounded-xl bg-black/30 text-[var(--color-gold)]"
                            >
                              <Minus className="size-3.5" />
                            </button>

                            <span className="min-w-7 text-center text-sm font-black">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              disabled={isUnavailable}
                              onClick={() => {
                                if (!hasCustomizationOptions(liveItem)) {
                                  increaseQuantity(item.cartKey)
                                  return
                                }

                                setRepeatTarget(item.cartKey)
                              }}
                              className="grid size-8 place-items-center rounded-xl bg-[var(--color-gold)] text-[var(--color-bg)] disabled:opacity-40"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartKey)}
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-red-500/18 bg-red-500/8 px-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-red-300 transition hover:bg-red-500/15"
                          >
                            <Trash2 className="size-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-[30px] border border-[var(--color-border-gold)]/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.26)] sm:p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                  <Utensils className="size-5" />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-gold)]">
                    Order Summary
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Table {table}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Note for restaurant
                </label>

                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  maxLength={300}
                  placeholder="Less spicy, no onion..."
                  className="min-h-24 w-full resize-none rounded-2xl border border-white/[0.08] bg-black/25 p-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-border-gold)]"
                />

                <p className="mt-1 text-right text-[10px] font-semibold text-[var(--color-text-muted)]">
                  {customerNote.length}/300
                </p>
              </div>

              <div className="mt-5 space-y-3 border-t border-[var(--color-border)] pt-4">
                <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>

                <div className="flex justify-between border-t border-[var(--color-border)] pt-3 text-2xl font-black">
                  <span>Total</span>
                  <span className="text-[var(--color-gold)]">₹{total}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={placeOrder}
                disabled={loading || hasUnavailableItems}
                className="mt-5 hidden h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-bg)] shadow-[0_16px_36px_rgba(211,181,74,0.18)] disabled:cursor-not-allowed disabled:opacity-45 lg:inline-flex"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                {hasUnavailableItems
                  ? "Remove Unavailable Items"
                  : loading
                    ? "Placing Order..."
                    : "Place Order"}
              </button>
            </div>
          </aside>

          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border-gold)]/35 bg-[var(--color-bg)]/94 p-3 backdrop-blur-xl lg:hidden">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-[var(--color-text-muted)]">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
                <p className="text-xl font-black text-[var(--color-gold)]">
                  ₹{total}
                </p>
              </div>

              <button
                type="button"
                onClick={placeOrder}
                disabled={loading || hasUnavailableItems}
                className="inline-flex h-12 min-w-[170px] items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                {hasUnavailableItems
                  ? "Fix Cart"
                  : loading
                    ? "Placing..."
                    : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {repeatTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setRepeatTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-[30px] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
              <Sparkles className="size-6" />
            </div>

            <h2 className="mt-4 text-center font-heading text-3xl font-normal">
              Add more?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-[var(--color-text-muted)]">
              Repeat same customisation or create a new one.
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => {
                  increaseQuantity(repeatTarget)
                  setRepeatTarget(null)
                }}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-gold)]"
              >
                Repeat Last
              </button>

              <button
                type="button"
                onClick={() => {
                  const cartItem = restaurantCart.find(
                    (x) => x.cartKey === repeatTarget
                  )

                  if (!cartItem) return

                  const liveItem = liveItems[cartItem.id]
                  if (!liveItem) return

                  setRepeatTarget(null)
                  openCustomizeSheet(liveItem)
                }}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-gold)] text-xs font-black uppercase tracking-[0.14em] text-[var(--color-bg)]"
              >
                Customize Again
              </button>

              <button
                type="button"
                onClick={() => setRepeatTarget(null)}
                className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-muted)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {customizingItem && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 px-3 backdrop-blur-sm">
          <div className="mb-3 max-h-[88vh] w-full max-w-xl overflow-hidden rounded-[30px] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_24px_90px_rgba(0,0,0,0.6)]">
            {(() => {
              const variants = getActiveVariants(customizingItem)
              const selectedVariant =
                variants.find(
                  (variant) => variant.id === sheetSelection.variantId
                ) ??
                variants[0] ??
                null

              const addons = getActiveAddons(selectedVariant)
              const selectedAddonIds = sheetSelection.addonIds.filter((addonId) =>
                addons.some((addon) => addon.id === addonId)
              )

              const selectedAddons = addons.filter((addon) =>
                selectedAddonIds.includes(addon.id)
              )

              const itemPrice = selectedVariant?.price ?? customizingItem.price
              const addonTotal = selectedAddons.reduce(
                (sum, addon) => sum + addon.price,
                0
              )
              const finalPrice = itemPrice + addonTotal

              return (
                <>
                  <div className="border-b border-[var(--color-border)] p-4">
                    <div className="flex items-start gap-3">
                      <div className="size-16 shrink-0 overflow-hidden rounded-2xl bg-black/30">
                        <img
                          src={
                            customizingItem.image ?? "/images/restaurant-hero.png"
                          }
                          alt={customizingItem.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-gold)]">
                          Customize
                        </p>

                        <h3 className="mt-1 line-clamp-2 font-heading text-3xl font-normal leading-none">
                          {customizingItem.name}
                        </h3>

                        <p className="mt-1 text-sm font-bold text-[var(--color-text-muted)]">
                          Base price ₹{customizingItem.price}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={closeCustomizeSheet}
                        className="grid size-10 shrink-0 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]"
                      >
                        <X className="size-5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[56vh] overflow-y-auto p-4">
                    {variants.length > 0 && (
                      <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.16em]">
                              Choose Option
                            </h4>
                            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                              Select one to continue
                            </p>
                          </div>

                          <span className="rounded-full bg-[var(--color-gold)]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-gold)]">
                            Required
                          </span>
                        </div>

                        <div className="space-y-2">
                          {variants.map((variant) => {
                            const active = selectedVariant?.id === variant.id

                            return (
                              <button
                                key={variant.id}
                                type="button"
                                onClick={() =>
                                  setSheetSelection({
                                    variantId: variant.id,
                                    addonIds: [],
                                  })
                                }
                                className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left ${
                                  active
                                    ? "border-[var(--color-border-gold)] bg-[var(--color-gold)]/10"
                                    : "border-[var(--color-border)] bg-[var(--color-surface-soft)]/60"
                                }`}
                              >
                                <div>
                                  <p className="font-black">{variant.name}</p>
                                  <p className="mt-0.5 text-sm font-bold text-[var(--color-gold)]">
                                    ₹{variant.price}
                                  </p>
                                </div>

                                <span
                                  className={`grid size-6 place-items-center rounded-full border ${
                                    active
                                      ? "border-[var(--color-border-gold)] bg-[var(--color-gold)] text-[var(--color-bg)]"
                                      : "border-[var(--color-border)]"
                                  }`}
                                >
                                  {active && <Check className="size-4" />}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {addons.length > 0 && (
                      <div className={variants.length > 0 ? "mt-6" : ""}>
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-[var(--color-gold)]" />
                            <h4 className="text-sm font-black uppercase tracking-[0.16em]">
                              Add-ons
                            </h4>
                          </div>

                          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                            Optional extras for this item
                          </p>
                        </div>

                        <div className="space-y-2">
                          {addons.map((addon) => {
                            const active = selectedAddonIds.includes(addon.id)

                            return (
                              <button
                                key={addon.id}
                                type="button"
                                onClick={() =>
                                  setSheetSelection((prev) => {
                                    const exists = prev.addonIds.includes(addon.id)

                                    return {
                                      ...prev,
                                      addonIds: exists
                                        ? prev.addonIds.filter((id) => id !== addon.id)
                                        : [...prev.addonIds, addon.id],
                                    }
                                  })
                                }
                                className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left ${
                                  active
                                    ? "border-green-500/30 bg-green-500/10"
                                    : "border-[var(--color-border)] bg-[var(--color-surface-soft)]/60"
                                }`}
                              >
                                <div>
                                  <p className="font-black">{addon.name}</p>
                                  <p className="mt-0.5 text-sm font-bold text-[var(--color-gold)]">
                                    + ₹{addon.price}
                                  </p>
                                </div>

                                <span
                                  className={`grid size-6 place-items-center rounded-full border ${
                                    active
                                      ? "border-green-500/40 bg-green-500 text-black"
                                      : "border-[var(--color-border)]"
                                  }`}
                                >
                                  {active && <Check className="size-4" />}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 p-4 backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={addCustomizedItemToCart}
                      className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-black uppercase tracking-[0.16em] text-[var(--color-bg)]"
                    >
                      Add Item • ₹{finalPrice}
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

    </div>
  )
}
