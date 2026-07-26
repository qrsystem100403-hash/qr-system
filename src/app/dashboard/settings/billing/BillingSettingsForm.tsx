"use client";


import { useEffect, useState } from "react";

import BillingPreview from "./BillingPreview";
import SaveButton from "./SaveButton";

import {
  DashboardField,
  DashboardInput,
  DashboardSection,
  DashboardSelect,
  DashboardSwitch,
} from "@/app/components/dashboard/form";

import {
  ImageIcon,
  Store,
  Type,
  Receipt,
  Check,
} from "lucide-react";

type Props = {
  initialData: any;

  restaurant: {
    id: string;
    name: string;
    logo: string | null;
    phone: string | null;
    primary_color?: string | null;
  };
};

export default function BillingSettingsForm({
  initialData,
  restaurant,
}: Props) {
  const initialForm = {
  gst_enabled:
    initialData?.gst_enabled ?? false,
  gst_mode:
    initialData?.gst_mode ?? "exclusive",
  gst_percent:
    initialData?.gst_percent ?? 0,
  service_charge_enabled:
    initialData?.service_charge_enabled ??
    false,
  service_charge_type:
    initialData?.service_charge_type ??
    "percentage",
  service_charge_value:
    initialData?.service_charge_value ??
    0,
  round_off_enabled:
    initialData?.round_off_enabled ??
    true,
  receipt_branding:
    initialData?.receipt_branding ??
    "logo_name",
};

const [form, setForm] =
  useState(initialForm);

const [dirty, setDirty] =
  useState(false);

  function update(
    key: keyof typeof form,
    value: any,
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  useEffect(() => {
  setDirty(
    JSON.stringify(form) !==
      JSON.stringify(initialForm),
  );
}, [form]);

  return (
    <div
  className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]"
  style={{
    alignItems: "start",
  }}
>

      {/* Left */}


<div className="space-y-6">

  <DashboardSection
    title="GST"
    description="Configure Goods & Services Tax."
  >
    <DashboardSwitch
      label="Enable GST"
      description="Apply GST to every bill."
      checked={form.gst_enabled}
      onChange={(value) =>
        update("gst_enabled", value)
      }
    />

    {form.gst_enabled && (
      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <DashboardField
          label="GST Mode"
        >
          <DashboardSelect
            value={form.gst_mode}
            onChange={(e) =>
              update(
                "gst_mode",
                e.target.value,
              )
            }
          >
            <option value="exclusive">
              Exclusive
            </option>

            <option value="inclusive">
              Inclusive
            </option>

          </DashboardSelect>
        </DashboardField>

        <DashboardField
          label="GST Percentage"
        >
          <DashboardInput
            type="number"
             min={0}
            value={form.gst_percent}
            onChange={(e) =>
              update(
                "gst_percent",
                Number(
                  e.target.value,
                ),
              )
            }
          />
        </DashboardField>

      </div>
    )}
  </DashboardSection>

  <DashboardSection
  title="Service Charge"
  description="Configure optional service charges."
>
  <DashboardSwitch
    label="Enable Service Charge"
    description="Add a service charge to customer bills."
    checked={form.service_charge_enabled}
    onChange={(value) =>
      update(
        "service_charge_enabled",
        value,
      )
    }
  />

  {form.service_charge_enabled && (
    <div className="mt-6 grid gap-5 md:grid-cols-2">

      <DashboardField
        label="Charge Type"
      >
        <DashboardSelect
          value={
            form.service_charge_type
          }
          onChange={(e) =>
            update(
              "service_charge_type",
              e.target.value,
            )
          }
        >
          <option value="percentage">
            Percentage
          </option>

          <option value="fixed">
            Fixed Amount
          </option>
        </DashboardSelect>
      </DashboardField>

      <DashboardField
        label={
          form.service_charge_type ===
          "percentage"
            ? "Percentage"
            : "Amount"
        }
      >
        <DashboardInput
          type="number"
           min={0}
          value={
            form.service_charge_value
          }
          onChange={(e) =>
            update(
              "service_charge_value",
              Number(
                e.target.value,
              ),
            )
          }
        />
      </DashboardField>

    </div>
  )}
</DashboardSection>

<DashboardSection
  title="Round Off"
  description="Automatically round the final bill."
>
  <DashboardSwitch
    label="Enable Round Off"
    description="Round the final payable amount to the nearest whole number."
    checked={form.round_off_enabled}
    onChange={(value) =>
      update("round_off_enabled", value)
    }
  />
</DashboardSection>

<DashboardSection
  title="Receipt Branding"
  description="Choose how your restaurant branding appears on printed receipts."
>
  <div className="grid gap-4 md:grid-cols-2">
    {[
      {
        value: "logo",
        title: "Logo Only",
        preview: (
  <div className="flex h-14 items-center justify-center">
    {restaurant.logo ? (
      <img
        src={restaurant.logo}
        alt={restaurant.name}
        className="h-10 w-10 rounded-full object-cover"
      />
    ) : (
      <ImageIcon className="h-10 w-10 text-[var(--color-primary)]" />
    )}
  </div>
),
      },
      {
        value: "logo_name",
        title: "Logo + Name",
        preview: (
  <div className="flex h-14 items-center gap-3">
    {restaurant.logo ? (
      <img
        src={restaurant.logo}
        alt={restaurant.name}
        className="h-10 w-10 rounded-full object-cover"
      />
    ) : (
      <Store className="h-10 w-10 text-[var(--color-primary)]" />
    )}

    <span className="font-bold">
      {restaurant.name}
    </span>
  </div>
),
      },
      {
        value: "name",
        title: "Name Only",
        preview: (
  <div className="flex h-14 items-center">
    <Type className="mr-2 h-7 w-7 text-[var(--color-primary)]" />
    <span className="font-bold">
  {restaurant.name}
</span>
  </div>
),
      },
      {
  value: "compact",
  title: "Compact Receipt",
        preview: (
  <div className="flex h-14 items-center justify-center">
    <div className="w-14 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-2">
      <div className="mb-1 h-1 rounded bg-[var(--color-border-strong)]" />
      <div className="mb-1 h-1 rounded bg-[var(--color-border)]" />
      <div className="h-1 w-2/3 rounded bg-[var(--color-border)]" />
    </div>
  </div>
),
      },
    ].map((option) => {
      const active =
        form.receipt_branding === option.value;

      return (
        
        <button
          key={option.value}
          type="button"
          onClick={() =>
            update(
              "receipt_branding",
              option.value,
            )
          }
          className="
relative
rounded-2xl
border
p-4
text-left
transition-all
hover:-translate-y-1
hover:shadow-lg
"
          style={{
            borderColor: active
              ? "var(--color-primary)"
              : "var(--color-border)",
            background: active
              ? "var(--color-primary-soft)"
              : "var(--color-surface)",
            boxShadow: active
              ? "var(--shadow-md)"
              : "none",
          }}
        >
          {active && (
  <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
    <Check className="h-4 w-4" />
  </div>
)}
          {option.value === "logo_name" &&
  !active && (
    <span className="mb-3 inline-flex items-center rounded-full bg-[var(--color-success-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-success)]">
      Recommended
    </span>
)}
          {option.preview}

          <div className="mt-4">
            <p className="font-semibold text-[var(--color-heading)]">
              {option.title}
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {option.value === "logo"
                ? "Display only the restaurant logo."
                : option.value ===
                    "logo_name"
                  ? "Show both logo and restaurant name."
                  : option.value ===
                      "name"
                    ? "Display only the restaurant name."
                    : "Print a compact receipt without branding."}
            </p>
          </div>
        </button>
      );
    })}
  </div>
</DashboardSection>
</div>



      {/* Right */}

      <div className="sticky top-6 space-y-6">

        <BillingPreview
  form={form}
  restaurant={restaurant}
/>

        <SaveButton
  form={form}
  dirty={dirty}
  onSaved={() => setDirty(false)}
/>

      </div>

    </div>
  );
}