
import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import { getWorkflowConfig } from "@/lib/orders/workflow-config";
import { dashboardService } from "@/modules/dashboard/services/dashboard.service";

import { can } from "@/lib/auth/can";
import { forbidden } from "next/navigation";
import DashboardOverviewHeader from "@/app/components/dashboard/sections/DashboardOverviewHeader";
import DashboardPipeline from "@/app/components/dashboard/sections/DashboardPipeline";
import { getBusinessInsights } from "@/modules/dashboard/services/businessInsights.service";
import DashboardBusinessInsights from "@/app/components/dashboard/sections/DashboardBusinessInsights";

import { getRevenueTrend } from "@/modules/dashboard/services/revenueTrend.service";
import DashboardRevenueTrend from "@/app/components/dashboard/sections/DashboardRevenueTrend";
import DashboardOverviewStats from "@/app/components/dashboard/sections/DashboardOverviewStats";
import {
  Clock3,
  UtensilsCrossed,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import DashboardRecentActivity from "@/app/components/dashboard/sections/DashboardRecentActivity";



export default async function OwnerDashboard() {
  const {
  restaurant,
  supabase,
  role,
  features,
} = await requireRestaurantUser();

const insights = await getBusinessInsights(
  supabase,
  restaurant.id,
);

const revenueTrend =
  await getRevenueTrend(
    supabase,
    restaurant.id,
  );

const workflowConfig =
  getWorkflowConfig(features);

  if (!can(role, "dashboard")) {
  forbidden();
}

  
const overview =
  await dashboardService.getOverview(
    supabase,
    restaurant.id,
  );
 

const recentActivities: {
  id: string;
  type: "pending" | "preparing" | "served" | "cancelled";
  title: string;
  subtitle: string;
  time: string;
}[] = [
  {
    id: "1",
    type: "pending",
    title: "Table 4 placed a new order",
    subtitle: "Order #1042 • ₹540",
    time: "1m",
  },
  {
    id: "2",
    type: "preparing",
    title: "Kitchen started preparing",
    subtitle: "Order #1041",
    time: "3m",
  },
  {
    id: "3",
    type: "served",
    title: "Order served",
    subtitle: "Table 2",
    time: "6m",
  },
  {
    id: "4",
    type: "cancelled",
    title: "Order cancelled",
    subtitle: "Table 7",
    time: "10m",
  },
  {
    id: "5",
    type: "pending",
    title: "Table 9 placed a new order",
    subtitle: "Order #1040 • ₹310",
    time: "15m",
  },
];

  return (
    <>
    <DashboardOverviewHeader/>

    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">

  <DashboardOverviewStats
  todayRevenue={overview.todayRevenue}
  activeOrders={overview.activeOrders}
  totalOrders={overview.totalOrders}
  activeTables={overview.activeTables}
/>

  <div className="grid gap-5 xl:grid-cols-12">

    {/* Revenue Chart */}
    <section className="xl:col-span-8">
  <DashboardRevenueTrend
  data={revenueTrend.data}
  totalRevenue={revenueTrend.todayRevenue}
  revenueChange={revenueTrend.revenueChange}
  totalOrders={overview.totalOrders}
  averageOrderValue={
  revenueTrend.averageOrderValue
}
/>
</section>

    {/* Business Insights */}
    <section className="xl:col-span-4">
  <DashboardBusinessInsights
    averageOrderValue={insights.averageOrderValue}
    completionRate={insights.completionRate}
    cancelledToday={insights.cancelledToday}
    peakHour={insights.peakHour}
    bestSellingItem={insights.bestSellingItem}
  />
</section>

    {/* Order Pipeline */}
    <section className="xl:col-span-8">

      <DashboardPipeline
  stages={
    workflowConfig.requiresReadyStage
      ? [
          {
            key: "pending",
            label: "Received",
            count: overview.pendingOrders,
            icon: Clock3,
            color: "#F59E0B",
          },
          {
            key: "preparing",
            label: "Preparing",
            count: overview.preparingOrders,
            icon: UtensilsCrossed,
            color: "#3B82F6",
          },
          {
            key: "ready",
            label: "Ready",
            count: overview.readyOrders,
            icon: CheckCircle2,
            color: "#8B5CF6",
          },
          {
            key: "served",
            label: "Served",
            count: overview.servedToday,
            icon: PartyPopper,
            color: "#10B981",
          },
        ]
      : [
          {
            key: "pending",
            label: "Received",
            count: overview.pendingOrders,
            icon: Clock3,
            color: "#F59E0B",
          },
          {
            key: "preparing",
            label: "Preparing",
            count: overview.preparingOrders,
            icon: UtensilsCrossed,
            color: "#3B82F6",
          },
          {
            key: "served",
            label: "Completed",
            count: overview.servedToday,
            icon: PartyPopper,
            color: "#10B981",
          },
        ]
  }
  activeOrders={overview.activeOrders}
  bottleneck={
    workflowConfig.requiresReadyStage
      ? (
          [
            {
              label: "Received",
              count: overview.pendingOrders,
            },
            {
              label: "Preparing",
              count: overview.preparingOrders,
            },
            {
              label: "Ready",
              count: overview.readyOrders,
            },
          ].sort((a, b) => b.count - a.count)[0].label
        )
      : (
          [
            {
              label: "Received",
              count: overview.pendingOrders,
            },
            {
              label: "Preparing",
              count: overview.preparingOrders,
            },
          ].sort((a, b) => b.count - a.count)[0].label
        )
  }
/>


    </section>
<section className="xl:col-span-4">
  <DashboardRecentActivity
    activities={recentActivities}
  />
</section>

    {/* Payment Summary */}
    <section className="xl:col-span-4">

    </section>

  </div>

</div>
    </>
  
);
}