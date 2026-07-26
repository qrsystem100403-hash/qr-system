"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  ChevronRight,
  Loader2,
  Mic,
  MicOff,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Timer,
  X,
} from "lucide-react"
import { supabaseBrowser } from "@/lib/supabase/browser"
import { buildCartKey, useQRCartStore } from "@/store/qrCartStore"
import { getStoredQROrderCount } from "@/modules/qr-ordering/lib/qrOrderStorage"

import { useRouter } from "next/navigation";


type SpeechRecognitionResultEvent = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
  }
}

type SpeechRecognitionInstance = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onstart: (() => void) | null
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

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
  tag?: string | null
  description?: string | null
  rating?: number | null
  rating_count?: number | null
  menu_item_variants?: MenuVariant[] | null
}

type MenuPayload = {
  categories: Category[]
  items: MenuItem[]
}

type Props = {
  table: string
  tableToken: string
  restaurantId: string
  menu: MenuPayload
}

type SelectionState = {
  variantId: string | null
  addonIds: string[]
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function smartMatch(search: string, ...values: string[]) {
  const query = normalizeText(search)
  if (!query) return true

  const target = normalizeText(values.join(" "))
  const targetWords = target.split(" ").filter(Boolean)
  const queryWords = query.split(" ").filter(Boolean)

  return queryWords.every((word) => {
    if (target.includes(word)) return true

    return targetWords.some(
      (targetWord) =>
        targetWord.startsWith(word) ||
        word.startsWith(targetWord) ||
        targetWord.includes(word)
    )
  })
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

  if (category.available_from && !category.available_until) {
    return `Available after ${formatTime(category.available_from)}`
  }

  if (!category.available_from && category.available_until) {
    return `Available until ${formatTime(category.available_until)}`
  }

  if (category.available_from && category.available_until) {
    return `Available ${formatTime(category.available_from)} - ${formatTime(
      category.available_until
    )}`
  }

  return null
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

function getItemTags(tag: MenuItem["tag"]) {
  if (!tag?.trim()) return []

  return tag
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

function getDisplayDescription(item: MenuItem) {
  return (
    item.description?.trim() ||
    "Freshly prepared with quality ingredients, balanced flavors, and served hot for the best taste."
  )
}

function VegIcon() {
  return (
    <span className="grid size-4 shrink-0 place-items-center rounded-[4px] border border-green-500 bg-green-500/5">
      <span className="size-2 rounded-full bg-green-500" />
    </span>
  )
}

function MenuSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-3 pb-28 pt-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70"
        />
      ))}
    </div>
  )
}

export default function QRMenuClient({
  table,
  tableToken,
  restaurantId,
  menu,
}: Props) {
  const [liveMenu, setLiveMenu] = useState<MenuItem[]>(menu.items)
  const [categories, setCategories] = useState<Category[]>(menu.categories)
  const [refreshing, setRefreshing] = useState(false)
  const [activeMainCategoryId, setActiveMainCategoryId] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showMicPrompt, setShowMicPrompt] = useState(false)
  const [storedOrderCount, setStoredOrderCount] = useState(0)
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null)
  const [sheetSelection, setSheetSelection] = useState<SelectionState>({
    variantId: null,
    addonIds: [],
  })
  const [sessionReady, setSessionReady] = useState(false);
const router = useRouter();

useEffect(() => {
  const createSession = async () => {
    try {
      const response = await fetch("/api/qr/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "ACTIVE_SESSION_EXISTS") {
          router.replace("/qr/session-conflict");
          return;
        }

        router.replace(`/qr/table/${tableToken}/occupied`);
        return;
      }

      setSessionReady(true);
    } catch {
      router.replace(`/qr/table/${tableToken}/occupied`);
    }
  };

  createSession();
}, [router, tableToken]);



  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addToCart = useQRCartStore((state) => state.addToCart)
  const cart = useQRCartStore((state) => state.cart)
  const increaseQuantity = useQRCartStore((state) => state.increaseQuantity)
  const decreaseQuantity = useQRCartStore((state) => state.decreaseQuantity)
  const hasHydrated = useQRCartStore((state) => state.hasHydrated)

  const startVoiceSearch = () => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition ?? window.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      alert("Voice search is not supported in this browser.")
      return
    }

    const recognition = new SpeechRecognitionAPI()

    recognition.lang = "en-IN"
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ""
      setSearchQuery(transcript)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognition.start()
  }

  const fetchMenuData = useCallback(async () => {
    try {
      setRefreshing(true)

      const response = await fetch("/api/menu", {
        method: "GET",
        cache: "no-store",
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        console.error("MENU API FETCH ERROR:", data.error)
        return
      }

      setCategories(data.data.categories ?? [])
      setLiveMenu(data.data.items ?? [])
    } catch (error) {
      console.error("MENU REFRESH ERROR:", error)
    } finally {
      setRefreshing(false)
    }
  }, [])

  const scheduleMenuRefresh = useCallback(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current)
    refreshTimer.current = setTimeout(fetchMenuData, 400)
  }, [fetchMenuData])

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
        scheduleMenuRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_categories",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        scheduleMenuRefresh
      )
      .subscribe()

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current)
      supabaseBrowser.removeChannel(channel)
    }
  }, [restaurantId, scheduleMenuRefresh])

  useEffect(() => {
  const updateCount = () => {
    setStoredOrderCount(getStoredQROrderCount(table))
  }

  updateCount()

  window.addEventListener("storage", updateCount)
  window.addEventListener("focus", updateCount)

  return () => {
    window.removeEventListener("storage", updateCount)
    window.removeEventListener("focus", updateCount)
  }
}, [table])

  const mainCategories = useMemo(
    () =>
      categories
        .filter((cat) => cat.parent_id === null)
        .sort((a, b) => a.sort_order - b.sort_order),
    [categories]
  )

  const subCategories = useMemo(
    () =>
      categories
        .filter((cat) => cat.parent_id !== null)
        .sort((a, b) => a.sort_order - b.sort_order),
    [categories]
  )

  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>()
    categories.forEach((category) => map.set(category.id, category))
    return map
  }, [categories])

  const visibleMainCategories = useMemo(
    () =>
      activeMainCategoryId === "all"
        ? mainCategories
        : mainCategories.filter((cat) => cat.id === activeMainCategoryId),
    [activeMainCategoryId, mainCategories]
  )

  const restaurantCart = useMemo(
    () => cart.filter((item) => item.restaurantId === restaurantId),
    [cart, restaurantId]
  )

  const totalItems = useMemo(
    () => restaurantCart.reduce((sum, item) => sum + item.quantity, 0),
    [restaurantCart]
  )

  const totalAmount = useMemo(
    () =>
      restaurantCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [restaurantCart]
  )

  const getCategoryImage = useCallback(
    (categoryId: string) => {
      const childIds = subCategories
        .filter((cat) => cat.parent_id === categoryId)
        .map((cat) => cat.id)

      return (
        liveMenu.find(
          (item) =>
            item.image &&
            (item.category_id === categoryId ||
              childIds.includes(item.category_id ?? ""))
        )?.image ?? "/images/restaurant-hero.png"
      )
    },
    [liveMenu, subCategories]
  )

  const renderedItemCount = useMemo(() => {
    return visibleMainCategories.reduce((total, mainCategory) => {
      const childCategories = subCategories.filter(
        (cat) => cat.parent_id === mainCategory.id
      )

      return (
        total +
        childCategories.reduce((subTotal, subCategory) => {
          const main = categoryMap.get(subCategory.parent_id ?? "")

          const items = liveMenu.filter(
            (item) =>
              item.category_id === subCategory.id &&
              smartMatch(
                searchQuery,
                item.name,
                item.description ?? "",
                item.tag ?? "",
                subCategory.name,
                main?.name ?? ""
              )
          )

          return subTotal + items.length
        }, 0)
      )
    }, 0)
  }, [visibleMainCategories, subCategories, categoryMap, liveMenu, searchQuery])

  const openCustomizeSheet = (item: MenuItem) => {
    const variants = getActiveVariants(item)
    const firstVariant = variants[0] ?? null

    setCustomizingItem(item)
    setSheetSelection({
      variantId: firstVariant?.id ?? null,
      addonIds: [],
    })
  }

  const closeCustomizeSheet = () => {
    setCustomizingItem(null)
    setSheetSelection({
      variantId: null,
      addonIds: [],
    })
  }

  const addSelectedItemToCart = () => {
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

    const cartKey = buildCartKey({
      itemId: customizingItem.id,
      variantId: selectedVariant?.id ?? null,
      addonIds: selectedAddonIds,
    })

    addToCart({
      cartKey,
      id: customizingItem.id,
      restaurantId: customizingItem.restaurant_id,
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

  if (!hasHydrated) return <MenuSkeleton />

  if (!sessionReady) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-gold)]" />
    </div>
  );
}

  return (
    <>
    
      <div className="sticky top-[72px] z-20 -mx-3 border-b border-white/[0.05] bg-[var(--color-bg)]/95 px-3 pb-4 pt-3 backdrop-blur-2xl sm:-mx-4 sm:top-[82px] sm:px-4">
  <div className="mx-auto max-w-5xl">
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-gold)]">
          Table {table}
        </p>

        <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">
          Browse menu and track your orders
        </p>
      </div>

      <Link
        href={`/qr/table/${tableToken}/orders`}
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-gold)]/70 bg-[var(--color-gold)]/10 px-4 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--color-gold)] transition hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)]"
      >
        Orders

        {storedOrderCount > 0 && (
          <span className="ml-2 grid min-w-5 place-items-center rounded-full bg-[var(--color-gold)] px-1.5 py-0.5 text-[10px] font-black leading-none text-[var(--color-bg)]">
            {storedOrderCount > 9 ? "9+" : storedOrderCount}
          </span>
        )}
      </Link>
    </div>

    <div className="relative mt-4">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />

      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={
          isListening
            ? "Listening..."
            : refreshing
              ? "Updating menu..."
              : "Search dishes, tags, categories..."
        }
        className="h-12 w-full rounded-full border border-white/[0.08] bg-white/[0.025] pl-11 pr-24 text-sm font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)] transition focus:border-[var(--color-border-gold)] focus:bg-white/[0.04]"
      />

      {searchQuery ? (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="absolute right-12 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-[var(--color-text-muted)] transition hover:bg-white/5 hover:text-[var(--color-text)]"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => setShowMicPrompt(true)}
        className={`absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full transition ${
          isListening
            ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
            : "text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10"
        }`}
        aria-label="Voice search"
      >
        {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
      </button>
    </div>

    <div className="relative mt-5">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />

      <div className="flex gap-5 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden  pt-1">
        <button
          type="button"
          onClick={() => setActiveMainCategoryId("all")}
          className="group flex w-[72px] shrink-0 flex-col items-center gap-2"
        >
          <div
            className={`grid size-[66px] place-items-center rounded-full transition ${
              activeMainCategoryId === "all"
                ? "bg-[var(--color-gold)]/12 shadow-[0_0_0_1px_var(--color-border-gold)]"
                : "bg-white/[0.035]"
            }`}
          >
            <span className="text-2xl">🍽️</span>
          </div>

          <span
            className={`max-w-full truncate text-center text-[11px] font-black ${
              activeMainCategoryId === "all"
                ? "text-[var(--color-gold)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            All
          </span>

          <span
            className={`h-1 w-8 rounded-full transition ${
              activeMainCategoryId === "all"
                ? "bg-[var(--color-gold)]"
                : "bg-transparent"
            }`}
          />
        </button>

        {mainCategories.map((category) => (
          <button
            type="button"
            key={category.id}
            onClick={() => setActiveMainCategoryId(category.id)}
            className="group flex w-[88px] shrink-0 flex-col items-center gap-2"
          >
            <div
              className={`relative grid size-[66px] place-items-center rounded-full transition ${
                activeMainCategoryId === category.id
                  ? "bg-[var(--color-gold)]/12 shadow-[0_0_0_1px_var(--color-border-gold)]"
                  : "bg-white/[0.035]"
              }`}
            >
              <img
                src={getCategoryImage(category.id)}
                alt={category.name}
                className="size-[58px] rounded-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <span
              className={`max-w-full truncate text-center text-[11px] font-black ${
                activeMainCategoryId === category.id
                  ? "text-[var(--color-gold)]"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              {category.name}
            </span>

            <span
              className={`h-1 w-8 rounded-full transition ${
                activeMainCategoryId === category.id
                  ? "bg-[var(--color-gold)]"
                  : "bg-transparent"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  </div>
</div>

      <div className="mx-auto max-w-5xl space-y-10 pb-32 pt-6">
        {visibleMainCategories.map((mainCategory) => {
          const childCategories = subCategories.filter(
            (cat) => cat.parent_id === mainCategory.id
          )

          const mainAvailable = isCategoryAvailable(mainCategory)
          const mainAvailabilityText = getAvailabilityText(mainCategory)

          const hasVisibleItemsInMain = childCategories.some((subCategory) =>
            liveMenu.some(
              (item) =>
                item.category_id === subCategory.id &&
                smartMatch(
                  searchQuery,
                  item.name,
                  item.description ?? "",
                  item.tag ?? "",
                  subCategory.name,
                  mainCategory.name
                )
            )
          )

          if (!hasVisibleItemsInMain) return null

          return (
            <section key={mainCategory.id}>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[var(--color-gold)]">
                    Menu
                  </p>

                  <h2 className="mt-1 font-heading text-4xl font-normal leading-none sm:text-5xl">
                    {mainCategory.name}
                  </h2>
                </div>

                {!mainAvailable && mainAvailabilityText && (
                  <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-200">
                    <Timer className="size-3.5" />
                    {mainAvailabilityText}
                  </p>
                )}
              </div>

              <div className="space-y-8">
                {childCategories.map((subCategory) => {
                  const main = categoryMap.get(subCategory.parent_id ?? "")

                  const items = liveMenu
                    .filter(
                      (item) =>
                        item.category_id === subCategory.id &&
                        smartMatch(
                          searchQuery,
                          item.name,
                          item.description ?? "",
                          item.tag ?? "",
                          subCategory.name,
                          main?.name ?? ""
                        )
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))

                  if (items.length === 0) return null

                  const subAvailable = isCategoryAvailable(subCategory)
                  const subAvailabilityText = getAvailabilityText(subCategory)

                  return (
                    <div key={subCategory.id}>
                      <div className="mb-3 flex items-end justify-between gap-3">
                        <div>
                          <h3 className="font-heading text-2xl font-normal leading-none sm:text-3xl">
                            {subCategory.name}
                          </h3>

                          {!subAvailable && subAvailabilityText && (
                            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-yellow-300">
                              <Timer className="size-3.5" />
                              {subAvailabilityText}
                            </p>
                          )}
                        </div>

                        <p className="shrink-0 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                          {items.length} items
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:gap-4">
                        {items.map((item) => {
                          const variants = getActiveVariants(item)
                          const defaultVariant = variants[0] ?? null
                          const addons = getActiveAddons(defaultVariant)
                          const isCustomizable =
                            variants.length > 0 || addons.length > 0

                          const itemPrice = defaultVariant?.price ?? item.price

                          const cartKey = buildCartKey({
                            itemId: item.id,
                            variantId: defaultVariant?.id ?? null,
                            addonIds: [],
                          })

                          const exactCartItem = restaurantCart.find(
                            (x) => x.cartKey === cartKey
                          )

                          const itemCartQuantity = restaurantCart
                            .filter((cartItem) => cartItem.id === item.id)
                            .reduce((sum, cartItem) => sum + cartItem.quantity, 0)

                          const isUnavailable =
                            !item.is_available || !mainAvailable || !subAvailable

                          const tags = getItemTags(item.tag)
                          return (
                            <article
                              key={item.id}
                              className={`min-w-0 overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/42 shadow-[0_10px_28px_rgba(0,0,0,0.16)] transition hover:border-[var(--color-border-gold)]/55 hover:bg-[var(--color-surface-soft)]/60 ${
                                isUnavailable ? "opacity-55" : ""
                              }`}
                            >
                              <div className="relative">
                                <div className="relative h-[96px] overflow-hidden bg-black/30 sm:h-[132px]">
                                  <img
                                    src={item.image ?? "/images/restaurant-hero.png"}
                                    alt={item.name}
                                    className={`h-full w-full object-cover transition duration-300 hover:scale-105 ${
                                      isUnavailable ? "grayscale" : ""
                                    }`}
                                  />

                                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                  <div className="absolute left-2 top-2 flex items-center gap-1.5">
                                    <VegIcon />

                                    {tags[0] && (
                                      <span className="rounded-full bg-black/55 px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-[var(--color-gold)] backdrop-blur-md">
                                        {tags[0]}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="-mt-4 px-2">
                                  {itemCartQuantity > 0 && !isUnavailable ? (
                                    <div className="relative z-10 mx-auto flex h-9 max-w-[112px] items-center justify-between rounded-[12px] border border-[var(--color-border-gold)] bg-[var(--color-bg)] p-1 shadow-[0_10px_24px_rgba(0,0,0,0.34)]">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isCustomizable) {
                                            const firstItem = restaurantCart.find(
                                              (cartItem) => cartItem.id === item.id
                                            )
                                            if (firstItem) decreaseQuantity(firstItem.cartKey)
                                            return
                                          }

                                          if (exactCartItem) {
                                            decreaseQuantity(exactCartItem.cartKey)
                                          }
                                        }}
                                        className="grid size-7 place-items-center rounded-[9px] bg-black/30 text-[var(--color-gold)]"
                                      >
                                        <Minus className="size-3.5" />
                                      </button>

                                      <span className="min-w-5 text-center text-sm font-black">
                                        {itemCartQuantity}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isCustomizable) {
                                            openCustomizeSheet(item)
                                            return
                                          }

                                          if (exactCartItem) {
                                            increaseQuantity(exactCartItem.cartKey)
                                          }
                                        }}
                                        className="grid size-7 place-items-center rounded-[9px] bg-[var(--color-gold)] text-[var(--color-bg)]"
                                      >
                                        <Plus className="size-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={isUnavailable}
                                      onClick={() => {
                                        if (isCustomizable) {
                                          openCustomizeSheet(item)
                                          return
                                        }

                                        addToCart({
                                          cartKey,
                                          id: item.id,
                                          restaurantId: item.restaurant_id,
                                          name: item.name,
                                          basePrice: item.price,
                                          price: itemPrice,
                                          image: item.image,
                                          quantity: 1,
                                          variant: defaultVariant
                                            ? {
                                                id: defaultVariant.id,
                                                name: defaultVariant.name,
                                                price: defaultVariant.price,
                                              }
                                            : null,
                                          addons: [],
                                        })
                                      }}
                                      className="relative z-10 mx-auto flex h-9 w-full max-w-[112px] items-center justify-center rounded-[12px] border border-[var(--color-border-gold)] bg-[var(--color-bg)] text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-gold)] shadow-[0_10px_24px_rgba(0,0,0,0.34)] transition hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-35"
                                    >
                                      {isUnavailable ? "Closed" : "Add"}
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="p-2.5 pt-2 sm:p-3 sm:pt-2.5">
                                <h2 className="truncate text-[12px] font-black leading-tight tracking-[-0.02em] text-[var(--color-text)] sm:text-[14px]">
                                  {item.name}
                                </h2>

                                <div className="mt-1.5 flex items-center justify-between gap-2">
                                  <p className="text-[13px] font-black text-[var(--color-text)] sm:text-[14px]">
                                    ₹{itemPrice}
                                  </p>

                                  {isCustomizable && !isUnavailable && (
                                    <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--color-gold)]">
                                      Custom
                                    </span>
                                  )}
                                </div>

                                {isUnavailable && (
                                  <p className="mt-2 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-red-200">
                                    {!item.is_available
                                      ? "Out of stock"
                                      : "Not available now"}
                                  </p>
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
          <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/70 p-8 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
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

      {showMicPrompt && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setShowMicPrompt(false)}
        >
          <div
            className="w-full max-w-md rounded-[25px] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--color-gold)]/15 text-[var(--color-gold)]">
              <Mic className="size-6" />
            </div>

            <h2 className="mt-4 text-center font-heading text-3xl font-normal">
              Search by voice
            </h2>

            <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-6 text-[var(--color-text-muted)]">
              Tap Start, then choose “Allow while visiting the site” so you can
              search dishes by speaking.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowMicPrompt(false)}
                className="h-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-sm font-bold text-[var(--color-text)]"
              >
                Not now
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMicPrompt(false)

                  setTimeout(() => {
                    startVoiceSearch()
                  }, 250)
                }}
                className="h-12 rounded-2xl bg-[var(--color-gold)] text-sm font-black text-[var(--color-bg)]"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-3 backdrop-blur-sm">
          <div className="mb-3 max-h-[88vh] w-full max-w-xl overflow-hidden rounded-[25px] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_24px_90px_rgba(0,0,0,0.6)]">
            {(() => {
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
                              Choose option
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
                      onClick={addSelectedItemToCart}
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

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-[22px] border border-[var(--color-border-gold)] bg-[var(--color-bg)]/95 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--color-gold)] text-[var(--color-bg)]">
                <ShoppingBag className="size-5" />
              </div>

              <div className="min-w-0">
  <p className="truncate text-sm font-black">
    {totalItems} {totalItems === 1 ? "Item" : "Items"} in cart
  </p>

  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
    Subtotal
  </p>

  <p className="text-sm font-black text-[var(--color-gold)]">
    ₹{totalAmount.toFixed(2)}
  </p>
</div>
            </div>

            <Link
              href={`/qr/table/${tableToken}/cart`}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-gold)] px-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-bg)]"
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
