"use client";

import LogoutButton from "@/app/dashboard/LogoutButton";

import DashboardCard from "../ui/DashboardCard";

export default function SidebarFooter() {
  return (
    <div className="border-t border-[var(--color-border)] p-5">
      
        <LogoutButton />
    </div>
  );
}