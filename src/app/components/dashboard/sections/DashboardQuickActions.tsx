import {
  LayoutDashboard,
  QrCode,
  ReceiptText,
  UtensilsCrossed,
} from "lucide-react";

import DashboardCard from "../ui/DashboardCard";
import QuickActionCard from "../cards/QuickActionCard";

export default function DashboardQuickActions() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--color-heading)]">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Frequently used shortcuts
        </p>
      </div>

      <div
  className="
    grid
    gap-4
    sm:grid-cols-2
    xl:grid-cols-4
  "
>
        <QuickActionCard
          title="Live Orders"
          description="Manage active customer orders"
          href="/dashboard/orders"
          icon={ReceiptText}
          color="blue"
        />

        <QuickActionCard
          title="Menu"
          description="Update food items & pricing"
          href="/dashboard/menu"
          icon={UtensilsCrossed}
          color="green"
        />

        <QuickActionCard
          title="QR Tables"
          description="Manage restaurant tables"
          href="/dashboard/tables"
          icon={QrCode}
          color="amber"
        />

        <QuickActionCard
          title="Operations"
          description="Customer requests & alerts"
          href="/dashboard/operations"
          icon={LayoutDashboard}
          color="zinc"
        />
      </div>
    </section>
  )}