"use client";

import RestaurantReceipt from "@/app/components/billing/RestaurantReceipt";

type Props = {
  form: {
    gst_enabled: boolean;
    gst_mode: "exclusive" | "inclusive";
    gst_percent: number;
    service_charge_enabled: boolean;
    service_charge_type: "percentage" | "fixed";
    service_charge_value: number;
    round_off_enabled: boolean;
    receipt_branding:
      | "logo"
      | "logo_name"
      | "name"
      | "compact";
  };

  restaurant: {
    name: string;
    logo: string | null;
    phone: string | null;
    address?: string | null;
    gstNumber?: string | null;
    fssaiNumber?: string | null;
  };
};

export default function BillingPreview({
  form,
  restaurant,
}: Props)  {

  const receiptRestaurant = {
  name: restaurant.name,
  logo: restaurant.logo ?? undefined,
  phone: restaurant.phone ?? undefined,
  address: restaurant.address ?? "Restaurant Address",
  gstin: restaurant.gstNumber ?? undefined,
  fssai: restaurant.fssaiNumber ?? undefined,
  tagline: "Billing Preview",
  branding: form.receipt_branding,
};
  

  const items = [
    {
      id: "1",
      name: "Veg Burger",
      qty: 2,
      unitPrice: 300,
      totalPrice: 600,
    },
    {
      id: "2",
      name: "French Fries",
      qty: 1,
      unitPrice: 200,
      totalPrice: 200,
    },
    {
      id: "3",
      name: "Cold Drink",
      qty: 2,
      unitPrice: 100,
      totalPrice: 200,
    },
  ];

  const settings = {
    gstEnabled: form.gst_enabled,
    gstMode: form.gst_mode,
    gstPercent: form.gst_percent,
    serviceChargeEnabled:
      form.service_charge_enabled,
    serviceChargeType:
      form.service_charge_type,
    serviceChargeValue:
      form.service_charge_value,
    roundOffEnabled:
      form.round_off_enabled,
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );

  let gstAmount = 0;

  if (settings.gstEnabled) {
    if (settings.gstMode === "exclusive") {
      gstAmount = Number(
        (
          subtotal *
          (settings.gstPercent / 100)
        ).toFixed(2),
      );
    } else {
      gstAmount = Number(
        (
          subtotal -
          subtotal /
            (1 +
              settings.gstPercent /
                100)
        ).toFixed(2),
      );
    }
  }

  let serviceChargeAmount = 0;

  if (
    settings.serviceChargeEnabled
  ) {
    if (
      settings.serviceChargeType ===
      "percentage"
    ) {
      serviceChargeAmount = Number(
        (
          subtotal *
          (settings.serviceChargeValue /
            100)
        ).toFixed(2),
      );
    } else {
      serviceChargeAmount = Number(
        settings.serviceChargeValue.toFixed(
          2,
        ),
      );
    }
  }

  const beforeRound = Number(
    (
      subtotal +
      serviceChargeAmount +
      (settings.gstMode === "exclusive"
        ? gstAmount
        : 0)
    ).toFixed(2),
  );

  let grandTotal = beforeRound;
  let roundOff = 0;

  if (settings.roundOffEnabled) {
    grandTotal = Math.round(beforeRound);

    roundOff = Number(
      (
        grandTotal - beforeRound
      ).toFixed(2),
    );
  }

  const now = new Date();

const billDate = now.toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const billTime = now.toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

  return (
    <RestaurantReceipt
      mode="preview"
      restaurant={receiptRestaurant}
      items={items}
      settings={settings}
      totals={{
        subtotal,
        gstAmount,
        serviceChargeAmount,
        roundOff,
        grandTotal,
      }}
     bill={{
  number: "INV-1001",
  table: "Table 8",
  cashier: "Preview",
  date: billDate,
  time: billTime,
}}
    />
  );
}