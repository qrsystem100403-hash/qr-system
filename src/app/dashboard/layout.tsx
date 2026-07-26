import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

import "@/styles/dashboard-theme.css";

import DashboardSidebar from "../components/dashboard/sidebar/DashboardSidebar";
import DashboardTopbar from "../components/dashboard/DashboardTopbar";

import MobileBottomNav from "../components/dashboard/MobileBottomNav";
import NotificationCenter from "../components/dashboard/NotificationCenter";

import DashboardThemeProvider from "./DashboardThemeProvider";

import AccountStatusWatcher from "./AccountStatusWatcher";

import { DashboardHeaderProvider } from "@/app/components/dashboard/header/DashboardHeaderProvider";
import { DashboardLayoutProvider } from "../components/dashboard/DashboardLayoutProvider";
import DashboardShell from "../components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
  restaurant,
  role,
  features,
  user,
  profile,
} = await requireRestaurantUser();

  return (
    <DashboardThemeProvider>

      <DashboardLayoutProvider>
<DashboardHeaderProvider>
        <AccountStatusWatcher
    userId={user.id}
/>
<main
  id="dashboard-root"
  className="
    dashboard-theme
    min-h-screen
    bg-[var(--color-bg)]
    text-[var(--color-text)]
    font-[var(--font-dashboard)]
    transition-colors
    duration-300
  "
>
        <DashboardShell
  sidebar={
    <DashboardSidebar
      restaurant={{
        name: restaurant.name,
        logo: restaurant.logo,
      }}
      currentUser={{
        fullName: profile?.full_name ?? "Unknown User",
        role,
      }}
      role={role}
      features={features}
    />
  }
  topbar={
    <DashboardTopbar
      restaurantName={restaurant.name}
      restaurantLogo={restaurant.logo}
    />
  }
>
  {children}
</DashboardShell>

        <MobileBottomNav
  role={role}
  features={features}
/>

        <NotificationCenter
          restaurantId={restaurant.id}
        />
      </main>
      </DashboardHeaderProvider>
      </DashboardLayoutProvider>
      
      
      
    </DashboardThemeProvider>
  );
}