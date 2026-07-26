"use client";

import {  useState } from "react";

import {
  DashboardField,
  DashboardInput,
  DashboardSection,
} from "@/app/components/dashboard/form";

import LogoUploader from "./LogoUploader";
import SaveButton from "./SaveButton";

import RestaurantReceipt from "@/app/components/billing/RestaurantReceipt";

type Props = {
  restaurant: {
    id: string;

    name: string;

    logo: string | null;

    tagline: string | null;

    phone: string | null;

    address: string | null;

    gst_number: string | null;

    fssai_number: string | null;
  };
};

export default function RestaurantProfileForm({
  restaurant,
}: Props) {
  const [initialForm, setInitialForm] =
  useState({
    logo: restaurant.logo,
    name: restaurant.name,
    tagline: restaurant.tagline ?? "",
    phone: restaurant.phone ?? "",
    address: restaurant.address ?? "",
    gst_number: restaurant.gst_number ?? "",
    fssai_number:
      restaurant.fssai_number ?? "",
  });

const [form, setForm] =
  useState(initialForm);

const dirty =
  JSON.stringify(form) !==
  JSON.stringify(initialForm);

  function update(
  key: keyof typeof form,
  value: any,
) {
  setForm((prev) => ({
    ...prev,
    [key]: value,
  }));
}

  return (
    <div
      className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]"
      style={{
        alignItems: "start",
      }}
    >
      {/* LEFT */}
      <div className="space-y-6">
        <DashboardSection
  title="Restaurant Information"
  description="Manage your restaurant branding and business identity."
>
  <LogoUploader
    value={form.logo}
    restaurantName={form.name}
    onChange={(url) =>
      update("logo", url)
    }
  />

  <div className="mt-8 grid gap-5">
    <DashboardField
      label="Restaurant Name"
    >
      <DashboardInput
        value={form.name}
        placeholder="Restaurant Name"
        onChange={(e) =>
          update(
            "name",
            e.target.value,
          )
        }
      />
    </DashboardField>

    <DashboardField
      label="Tagline"
    >
      <DashboardInput
        value={form.tagline}
        placeholder="Eg. Delicious food served with love."
        onChange={(e) =>
          update(
            "tagline",
            e.target.value,
          )
        }
      />
    </DashboardField>
  </div>
</DashboardSection>

<DashboardSection
  title="Contact Information"
  description="Customer contact details shown on receipts and menus."
>
  <div className="grid gap-5 md:grid-cols-2">
    <DashboardField
      label="Phone Number"
    >
      <DashboardInput
        value={form.phone}
        placeholder="+91 98765 43210"
        onChange={(e) =>
          update(
            "phone",
            e.target.value,
          )
        }
      />
    </DashboardField>

    <DashboardField
      label="Address"
    >
      <DashboardInput
        value={form.address}
        placeholder="Restaurant Address"
        onChange={(e) =>
          update(
            "address",
            e.target.value,
          )
        }
      />
    </DashboardField>
  </div>
</DashboardSection>
<DashboardSection
  title="Business & Legal Information"
  description="These details appear on customer receipts and invoices."
>
  <div className="grid gap-5 md:grid-cols-2">
    <DashboardField
      label="GST Number"
    >
      <DashboardInput
        value={form.gst_number}
        placeholder="22AAAAA0000A1Z5"
        onChange={(e) =>
          update(
            "gst_number",
            e.target.value.toUpperCase(),
          )
        }
      />
    </DashboardField>

    <DashboardField
      label="FSSAI Number"
    >
      <DashboardInput
        value={form.fssai_number}
        placeholder="12345678901234"
        onChange={(e) =>
          update(
            "fssai_number",
            e.target.value,
          )
        }
      />
    </DashboardField>
  </div>

  <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
    <p className="text-sm font-semibold text-[var(--color-heading)]">
      Receipt Preview
    </p>

    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
      Any changes you make here will be reflected instantly in the live receipt preview.
    </p>
  </div>
</DashboardSection>

<div className="flex justify-end">
  <SaveButton
  form={form}
  dirty={dirty}
  onSaved={() =>
    setInitialForm(form)
  }
/>
</div>

</div>

      

      {/* RIGHT */}
<div className="sticky top-6">
    <RestaurantReceipt
  mode="preview"
  restaurant={{
  name: form.name,
  logo: form.logo,
  tagline: form.tagline,
  address: form.address,
  phone: form.phone,
  gstin: form.gst_number,
  fssai: form.fssai_number,
  branding: "logo_name",
}}
  items={[
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
  ]}
  settings={{
    gstEnabled: true,
    gstMode: "exclusive",
    gstPercent: 5,
    serviceChargeEnabled: true,
    serviceChargeType: "percentage",
    serviceChargeValue: 5,
    roundOffEnabled: true,
  }}
  totals={{
    subtotal: 1000,
    gstAmount: 50,
    serviceChargeAmount: 50,
    roundOff: 0,
    grandTotal: 1100,
  }}
  bill={{
    number: "PREVIEW",
    table: "Table 8",
    cashier: "Admin",
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }}
/>

</div>

</div>
);
}