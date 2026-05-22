"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Utensils,
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

type LiveMenuItem = {
  id: string
  name: string
  price: number
  image: string | null
  is_available: boolean
  is_archived: boolean
  category_id: string | null
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

export default function QRCartClient({ table, restaurantId }: Props) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [customerNote, setCustomerNote] = useState("")
  const [liveItems, setLiveItems] = useState<Record<string, LiveMenuItem>>({})
  const [categories, setCategories] = useState<Record<string, Category>>({})
  const [errorMessage, setErrorMessage] = useState("")

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

  async function fetchLiveData() {
    if (!itemIdsKey) {
      setLiveItems({})
      return
    }

    const itemIds = itemIdsKey.split(",")

    const [
      { data: itemData, error: itemError },
      { data: categoryData, error: categoryError },
    ] = await Promise.all([
      supabaseBrowser
        .from("menu_items")
        .select("id, name, price, image, is_available, is_archived, category_id")
        .eq("restaurant_id", restaurantId)
        .in("id", itemIds),

      supabaseBrowser
        .from("menu_categories")
        .select("id, name, available_from, available_until, parent_id")
        .eq("restaurant_id", restaurantId),
    ])

    if (itemError) {
      console.error("CART LIVE ITEMS ERROR:", itemError)
      return
    }

    if (categoryError) {
      console.error("CART CATEGORY ERROR:", categoryError)
      return
    }

    const itemMap: Record<string, LiveMenuItem> = {}
    const categoryMap: Record<string, Category> = {}

    categoryData?.forEach((cat) => {
      categoryMap[cat.id] = cat as Category
    })

    itemData?.forEach((item) => {
      const liveItem = item as LiveMenuItem
      itemMap[liveItem.id] = liveItem

      restaurantCart
        .filter((cartItem) => cartItem.id === liveItem.id)
        .forEach((cartItem) => {
          updateCartItem(cartItem.cartKey, {
            name: liveItem.name,
            basePrice: liveItem.price,
            image: liveItem.image,
          })
        })
    })

    setLiveItems(itemMap)
    setCategories(categoryMap)
  }

  useEffect(() => {
    if (!hasHydrated) return
    fetchLiveData()
  }, [hasHydrated, itemIdsKey, restaurantId])

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
        fetchLiveData
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_categories",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        fetchLiveData
      )
      .subscribe()

    return () => {
      supabaseBrowser.removeChannel(channel)
    }
  }, [restaurantId, itemIdsKey])

  function getItemCategories(item: LiveMenuItem | undefined) {
    if (!item?.category_id) {
      return {
        subCategory: null,
        mainCategory: null,
      }
    }

    const subCategory = categories[item.category_id] ?? null
    const mainCategory = subCategory?.parent_id
      ? categories[subCategory.parent_id] ?? null
      : null

    return {
      subCategory,
      mainCategory,
    }
  }

  const unavailableCartItems = restaurantCart.filter((item) => {
    const liveItem = liveItems[item.id]
    if (!liveItem) return false

    const { subCategory, mainCategory } = getItemCategories(liveItem)

    return (
      !liveItem.is_available ||
      liveItem.is_archived ||
      !isCategoryAvailable(subCategory) ||
      !isCategoryAvailable(mainCategory)
    )
  })

  const hasUnavailableItems = unavailableCartItems.length > 0

  const total = restaurantCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const totalItems = restaurantCart.reduce((sum, item) => sum + item.quantity, 0)

  const placeOrder = async () => {
    if (!restaurantCart.length || loading || hasUnavailableItems) return

    setErrorMessage("")
    setLoading(true)

    try {
      const response = await fetch("/api/qr/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table,
          cart: restaurantCart,
          customerNote: customerNote.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Order failed. Please try again.")
        return
      }

      clearRestaurantCart(restaurantId)
      setCustomerNote("")
      router.push(`/qr/table/${table}/success?orderId=${data.orderId}`)
    } catch (error) {
      console.error(error)
      setErrorMessage("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!hasHydrated) {
    return (
      <div className="mx-auto mt-6 max-w-5xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70 p-5 text-sm text-[var(--color-text-muted)]">
        Loading cart...
      </div>
    )
  }

  return (
    <div className="mx-auto mt-5 max-w-5xl pb-28">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href={`/qr/table/${table}`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]"
        >
          <ArrowLeft className="size-4" />
          Menu
        </Link>

        <div className="rounded-full border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 px-3 py-2 text-xs font-bold text-[var(--color-gold)]">
          Table {table}
        </div>
      </div>

      {!restaurantCart.length ? (
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/75 p-6 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
            <ShoppingBag className="size-7" />
          </div>

          <h1 className="mt-4 font-heading text-4xl font-normal leading-none">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--color-text-muted)]">
            Add dishes from the menu before placing your order.
          </p>

          <Link
            href={`/qr/table/${table}`}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--color-bg)]"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                Review Order
              </p>

              <h1 className="mt-1 font-heading text-4xl font-normal leading-none">
                Your Cart
              </h1>

              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {totalItems} {totalItems === 1 ? "item" : "items"} selected
              </p>
            </div>

            {hasUnavailableItems && (
              <div className="mb-4 rounded-2xl border border-red-500/25 bg-red-500/10 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-300" />

                  <div>
                    <p className="font-bold text-red-200">
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
              <div className="mb-4 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
                {errorMessage}
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
              {restaurantCart.map((item) => {
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
                  Boolean(liveItem) &&
                  (!liveItem?.is_available ||
                    liveItem?.is_archived ||
                    !subAvailable ||
                    !mainAvailable)

                const currentName = liveItem?.name || item.name
                const currentImage = liveItem?.image ?? item.image

                return (
                  <article
                    key={item.cartKey}
                    className={`overflow-hidden rounded-2xl border bg-[var(--color-surface-soft)]/75 ${
                      isUnavailable
                        ? "border-red-500/25"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    <div className="flex gap-3 p-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-black/30">
                        <img
                          src={currentImage ?? "/placeholder-food.png"}
                          alt={currentName}
                          className={`h-full w-full object-cover ${
                            isUnavailable ? "grayscale opacity-50" : ""
                          }`}
                        />

                        {isUnavailable && <div className="absolute inset-0 bg-black/40" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                              {subCategory?.name ?? "Uncategorized"}
                            </p>

                            <h2 className="mt-0.5 line-clamp-2 font-heading text-xl font-normal leading-[1.05]">
                              {currentName}
                            </h2>
                          </div>

                          <p className="shrink-0 text-sm font-extrabold text-[var(--color-gold)]">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>

                        {item.variant && (
                          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                            {item.variant.name} · ₹{item.variant.price}
                          </p>
                        )}

                        {!!item.addons.length && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.addons.map((addon) => (
                              <span
                                key={addon.id}
                                className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]"
                              >
                                + {addon.name} ₹{addon.price}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border-gold)] bg-[var(--color-gold)]/10 p-1">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.cartKey)}
                              className="grid size-8 place-items-center rounded-lg bg-black/30 text-[var(--color-gold)]"
                            >
                              <Minus className="size-3.5" />
                            </button>

                            <span className="min-w-5 text-center text-sm font-extrabold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.cartKey)}
                              disabled={isUnavailable}
                              className="grid size-8 place-items-center rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] disabled:opacity-40"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartKey)}
                            className="inline-flex size-10 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10 text-red-300"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>

                        {isUnavailable && (
                          <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200">
                            {!liveItem?.is_available || liveItem?.is_archived
                              ? "Out of stock"
                              : availabilityText ?? "Not available now"}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/80 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
                  <Utensils className="size-5" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                    Order Summary
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Table {table}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  Note for restaurant
                </label>

                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  maxLength={300}
                  placeholder="Less spicy, no onion..."
                  className="min-h-24 w-full resize-none rounded-2xl border border-[var(--color-border)] bg-black/25 p-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-border-gold)]"
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

                <div className="flex justify-between text-2xl font-extrabold">
                  <span>Total</span>
                  <span className="text-[var(--color-gold)]">₹{total}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={placeOrder}
                disabled={loading || hasUnavailableItems}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-gold)] px-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--color-bg)] shadow-[0_16px_36px_rgba(211,181,74,0.18)] disabled:cursor-not-allowed disabled:opacity-45"
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
        </div>
      )}
    </div>
  )
}