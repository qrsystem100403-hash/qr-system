export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled"

export type OrderAddon = {
  id: string
  addon_name: string
  addon_price: number
}

export type OrderItem = {
  id: string
  qty: number
  item_price: number
  item_name: string | null
  variant_name: string | null
  order_item_addons: OrderAddon[]
}

export type Order = {
  id: string
  order_type: string | null
  table_name: string | null
  customer_name: string | null
  customer_phone: string | null
  address: string | null
  tracking_token: string | null
  total: number
  payment_status: string
  order_status: OrderStatus
  customer_note: string | null
  cancel_reason: string | null
  created_at: string
  order_items: OrderItem[]
}

export type StatusTabValue = OrderStatus | "all"