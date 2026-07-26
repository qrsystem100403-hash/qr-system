export type ReceiptAddon = {
  id: string;
  name: string;
  price: number;
};

export type ReceiptItem = {
  id: string;

  name: string;

  qty: number;

  unitPrice: number;

  totalPrice: number;

  variant?: string;

  addons?: ReceiptAddon[];

  note?: string;
};


export type ReceiptRestaurant = {
  name: string;

  tagline?: string;

  address?: string;

  phone?: string;

  email?: string;

  website?: string;

  gstin?: string;

  fssai?: string;

  logo?: string | null;

  footerMessage?: string;

  branding?:
    | "logo"
    | "logo_name"
    | "name"
    | "compact";
};

export type ReceiptSettings = {
  gstEnabled: boolean;

  gstMode:
    | "exclusive"
    | "inclusive";

  gstPercent: number;

  serviceChargeEnabled: boolean;

  serviceChargeType:
    | "percentage"
    | "fixed";

  serviceChargeValue: number;

  roundOffEnabled: boolean;
};

export type ReceiptBill = {
  number: string;
  table: string;
  cashier: string;
  date: string;
  time: string;
  sessionId?: string;
  paymentMethod?: string;
  paymentStatus?: string;
};