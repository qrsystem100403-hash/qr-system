"use client";

import { useState } from "react";
import SaveButton from "./SaveButton";
import {
  DashboardSection,
  DashboardSwitch,
} from "@/app/components/dashboard/form";

type Props = {
  initialData: {
    kitchen_display_enabled: boolean;
    cashier_dashboard_enabled: boolean;
    waiter_dashboard_enabled: boolean;
    online_orders_enabled: boolean;
    attendance_enabled: boolean;
    inventory_enabled: boolean;
  };
};

export default function RestaurantFeaturesForm({
  initialData,
}: Props) {
  const [form, setForm] =
    useState(initialData);

  function update(
    key: keyof typeof form,
    value: boolean,
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="space-y-6">
      <DashboardSection
        title="Restaurant Modules"
        description="Enable only the modules your restaurant actually uses."
      >
        <div className="space-y-5">
          <DashboardSwitch
            label="Kitchen Display"
            description="Dedicated kitchen dashboard for chefs."
            checked={
              form.kitchen_display_enabled
            }
            onChange={(v) =>
              update(
                "kitchen_display_enabled",
                v,
              )
            }
          />

          <DashboardSwitch
            label="Cashier Dashboard"
            description="Separate billing & payment dashboard."
            checked={
              form.cashier_dashboard_enabled
            }
            onChange={(v) =>
              update(
                "cashier_dashboard_enabled",
                v,
              )
            }
          />

          <DashboardSwitch
            label="Waiter Dashboard"
            description="Dedicated dashboard for waiters."
            checked={
              form.waiter_dashboard_enabled
            }
            onChange={(v) =>
              update(
                "waiter_dashboard_enabled",
                v,
              )
            }
          />

          <DashboardSwitch
            label="Online Orders"
            description="Accept customer orders online."
            checked={
              form.online_orders_enabled
            }
            onChange={(v) =>
              update(
                "online_orders_enabled",
                v,
              )
            }
          />

          <DashboardSwitch
            label="Attendance"
            description="Enable employee attendance system."
            checked={
              form.attendance_enabled
            }
            onChange={(v) =>
              update(
                "attendance_enabled",
                v,
              )
            }
          />

          <DashboardSwitch
            label="Inventory"
            description="Enable inventory management."
            checked={
              form.inventory_enabled
            }
            onChange={(v) =>
              update(
                "inventory_enabled",
                v,
              )
            }
          />
        </div>
      </DashboardSection>

      <div className="flex justify-end">
        <SaveButton form={form} />
      </div>
    </div>
  );
}