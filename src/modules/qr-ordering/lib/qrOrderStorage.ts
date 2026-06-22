export type StoredQROrder = {
  orderId: string
  trackingToken: string

  table: string
  tableToken: string

  restaurantId: string

  createdAt: string
  expiresAt: string
}

const STORAGE_KEY = "qr_customer_orders_v1"
const DAY_MS = 24 * 60 * 60 * 1000

function isBrowser() {
  return typeof window !== "undefined"
}

function isValidStoredOrder(order: StoredQROrder) {
  return Boolean(
    order.orderId &&
      order.trackingToken &&
      order.table &&
      order.tableToken &&
      order.restaurantId &&
      order.createdAt &&
      order.expiresAt
  )
}

export function getStoredQROrders(): StoredQROrder[] {
  if (!isBrowser()) return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) return []

    const now = Date.now()

    const validOrders = parsed
      .filter(isValidStoredOrder)
      .filter((order: StoredQROrder) => {
        return new Date(order.expiresAt).getTime() > now
      })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(validOrders))

    return validOrders
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

export function saveQROrder(order: {
  orderId: string
  trackingToken: string

  table: string
  tableToken: string

  restaurantId: string
}) {
  if (!isBrowser()) return

  const now = new Date()
  const existing = getStoredQROrders()

  const alreadySaved = existing.find((item) => item.orderId === order.orderId)

  const nextOrder: StoredQROrder = {
    ...order,
    createdAt: alreadySaved?.createdAt ?? now.toISOString(),
    expiresAt: alreadySaved?.expiresAt ?? new Date(now.getTime() + DAY_MS).toISOString(),
  }

  const withoutDuplicate = existing.filter(
    (item) => item.orderId !== order.orderId
  )

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([nextOrder, ...withoutDuplicate])
  )
}

export function removeQROrder(orderId: string) {
  if (!isBrowser()) return

  const orders = getStoredQROrders().filter(
    (order) => order.orderId !== orderId
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function extendQROrderFor24Hours(orderId: string) {
  if (!isBrowser()) return

  const orders = getStoredQROrders()
  const expiresAt = new Date(Date.now() + DAY_MS).toISOString()

  const nextOrders = orders.map((order) =>
    order.orderId === orderId ? { ...order, expiresAt } : order
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders))
}

export function getStoredQROrderCount(
  tableToken?: string
) {
  const orders = getStoredQROrders()

  if (!tableToken) return orders.length

  return orders.filter(
  (order) =>
    order.tableToken ===
    tableToken
).length
}