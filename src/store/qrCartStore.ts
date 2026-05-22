import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartAddon = {
  id: string
  name: string
  price: number
}

export type CartVariant = {
  id: string
  name: string
  price: number
}

export type CartItem = {
  cartKey: string
  id: string
  restaurantId: string
  name: string
  basePrice: number
  price: number
  image: string | null
  quantity: number
  variant: CartVariant | null
  addons: CartAddon[]
}

type CartStore = {
  cart: CartItem[]
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  addToCart: (item: CartItem) => void
  increaseQuantity: (cartKey: string) => void
  decreaseQuantity: (cartKey: string) => void
  removeFromCart: (cartKey: string) => void
  updateCartItem: (
    cartKey: string,
    data: Partial<Pick<CartItem, "name" | "basePrice" | "price" | "image">>
  ) => void
  clearCart: () => void
  clearRestaurantCart: (restaurantId: string) => void
}

export function buildCartKey({
  itemId,
  variantId,
  addonIds,
}: {
  itemId: string
  variantId?: string | null
  addonIds?: string[]
}) {
  const sortedAddonIds = [...(addonIds ?? [])].sort()

  return [itemId, variantId ?? "base", sortedAddonIds.join("+")]
    .filter(Boolean)
    .join("__")
}

export const useQRCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find(
            (cartItem) => cartItem.cartKey === item.cartKey
          )

          if (existing) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.cartKey === item.cartKey
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + item.quantity,
                    }
                  : cartItem
              ),
            }
          }

          return {
            cart: [...state.cart, item],
          }
        }),

      increaseQuantity: (cartKey) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.cartKey === cartKey
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        })),

      decreaseQuantity: (cartKey) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.cartKey === cartKey
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      removeFromCart: (cartKey) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.cartKey !== cartKey),
        })),

      updateCartItem: (cartKey, data) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.cartKey === cartKey
              ? {
                  ...item,
                  ...data,
                }
              : item
          ),
        })),

      clearCart: () =>
        set({
          cart: [],
        }),

      clearRestaurantCart: (restaurantId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.restaurantId !== restaurantId),
        })),
    }),
    {
      name: "qr-cart-storage",
      version: 2,
      migrate: () => {
        return {
          cart: [],
          hasHydrated: false,
        }
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)