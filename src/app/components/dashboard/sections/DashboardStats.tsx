import {
  IndianRupee,
  LayoutDashboard,
  ReceiptText,
  Table2,
} from "lucide-react";

import DashboardStatCard from "../ui/DashboardStatCard";

type Props = {
  todayRevenue: number;
  activeOrders: number;
  totalOrders: number;
  activeTables: number;
};

export default function DashboardStats({
  todayRevenue,
  activeOrders,
  totalOrders,
  activeTables,
}: Props) {
  return (
    <section
      className="
        grid
        grid-cols-1
        gap-5

        sm:grid-cols-2

        2xl:grid-cols-4
      "
    >
      <DashboardStatCard
        title="Revenue"
        value={todayRevenue}
        prefix="₹"
        description="Today's revenue"
        icon={IndianRupee}
        href="/dashboard/orders/history"
        color="green"
        badge={{
          label: "Live",
          variant: "success",
        }}
      />

      <DashboardStatCard
        title="Active Orders"
        value={activeOrders}
        description="Currently processing"
        icon={LayoutDashboard}
        href="/dashboard/orders"
        color="blue"
      />

      <DashboardStatCard
        title="Today's Orders"
        value={totalOrders}
        description="Orders received today"
        icon={ReceiptText}
        href="/dashboard/orders"
        color="zinc"
      />

      <DashboardStatCard
        title="Active Tables"
        value={activeTables}
        description="QR tables enabled"
        icon={Table2}
        href="/dashboard/tables"
        color="amber"
      />
    </section>
  );
}