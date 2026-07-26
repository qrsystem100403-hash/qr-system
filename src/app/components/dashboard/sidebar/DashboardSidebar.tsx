"use client";



import { usePathname } from "next/navigation";
import { getSidebarSections } from "@/lib/dashboard/sidebar";
import SidebarNavGroup from "./SidebarNavGroup";
import SidebarRestaurantCard from "./SidebarRestaurantCard";
import SidebarFooter from "./SidebarFooter";
import { useDashboardLayout } from "@/app/components/dashboard/DashboardLayoutProvider"
import DashboardCard from "../ui/DashboardCard";
type Props = {
  restaurant: {
    name: string;
    logo: string | null;
  };

  currentUser: {
    fullName: string;
    role: string;
  };

  role: string;

  features: {
    kitchen_display_enabled: boolean;
    cashier_dashboard_enabled: boolean;
    waiter_dashboard_enabled: boolean;
    online_orders_enabled: boolean;
    attendance_enabled: boolean;
    inventory_enabled: boolean;
  };
};


export default function DashboardSidebar({
  restaurant,
  currentUser,
  role,
  features,
}: Props) {
  const pathname = usePathname();
  const { sidebarMode } =
  useDashboardLayout();

const sections =
  getSidebarSections(
    role,
    features,
  );





  return (
    <aside
      className={`
hidden
lg:flex
fixed
inset-y-0
left-0
z-100
w-[var(--sidebar-width)]
flex-col
border-r
border-[var(--sidebar-border)]
bg-[var(--sidebar-bg)]
transition-all
duration-300
${
  sidebarMode === "hidden"
    ? "-translate-x-full"
    : "translate-x-0"
}
`}
    >
      
      <DashboardCard className="border-none shadow-none ">
        <SidebarRestaurantCard
        fullName={currentUser.fullName}
        role={currentUser.role}
      />
      </DashboardCard>
      <div
  className="
    flex-1
    overflow-y-auto
    dashboard-scrollbar
    px-6
    pt-1
  "
>

  <nav className="mt-2 space-y-10">
    {sections.map((section) => (
      <SidebarNavGroup
        key={section.title}
        title={section.title}
        items={section.items}
        pathname={pathname}
      />
    ))}
  </nav>
</div>

      <SidebarFooter />
    </aside>
  );
}