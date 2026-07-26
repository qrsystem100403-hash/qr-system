import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ChefHat,
  CreditCard,
  LayoutDashboard,
  MenuSquare,
  Package,
  QrCode,
  ReceiptText,
  Settings,
  Table2,
  Users,
  Wallet,
  CalendarDays,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

type Features = {
  kitchen_display_enabled: boolean;
  cashier_dashboard_enabled: boolean;
  waiter_dashboard_enabled: boolean;
  online_orders_enabled: boolean;
  attendance_enabled: boolean;
  inventory_enabled: boolean;
};

export function getSidebarSections(
  role: string,
  features: Features,
): SidebarSection[] {
  switch (role) {
    case "owner":
    case "manager":
      return getOwnerSidebar(features);

    case "kitchen":
      return getKitchenSidebar();

    case "cashier":
      return getCashierSidebar();

    case "waiter":
      return getWaiterSidebar();

    default:
      return [];
  }
}

function getOwnerSidebar(
  features: Features,
): SidebarSection[] {
  const management: SidebarItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Orders",
      href: "/dashboard/orders",
      icon: ReceiptText,
    },
    {
      label: "Menu",
      href: "/dashboard/menu",
      icon: MenuSquare,
    },
    {
      label: "Tables",
      href: "/dashboard/tables",
      icon: Table2,
    },
  ];

  const operations: SidebarItem[] = [
    {
      label: "Staff",
      href: "/dashboard/staff",
      icon: Users,
    },
  ];

  if (features.attendance_enabled) {
    operations.push({
      label: "Attendance",
      href: "/dashboard/attendance",
      icon: CalendarDays,
    });
  }

  if (features.inventory_enabled) {
    operations.push({
      label: "Inventory",
      href: "/dashboard/inventory",
      icon: Package,
    });
  }

  if (features.kitchen_display_enabled) {
    operations.push({
      label: "Kitchen",
      href: "/dashboard/kitchen",
      icon: ChefHat,
    });
  }

  if (features.cashier_dashboard_enabled) {
    operations.push({
      label: "Cashier",
      href: "/dashboard/cashier",
      icon: Wallet,
    });
  }

  const reports: SidebarItem[] = [
    {
      label: "Requests",
      href: "/dashboard/operations",
      icon: QrCode,
    },
    {
      label: "History",
      href: "/dashboard/orders/history",
      icon: ReceiptText,
    },
  ];

  return [
    {
      title: "Management",
      items: management,
    },
    {
      title: "Operations",
      items: operations,
    },
    {
      title: "Reports",
      items: reports,
    },
    {
      title: "Settings",
      items: [
        {
          label: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
  ];
}

function getKitchenSidebar(): SidebarSection[] {
  return [
    {
      title: "Kitchen",
      items: [
        {
          label: "Kitchen",
          href: "/dashboard/kitchen",
          icon: ChefHat,
        },
      ],
    },
  ];
}

function getCashierSidebar(): SidebarSection[] {
  return [
    {
      title: "Cashier",
      items: [
        {
          label: "Cashier",
          href: "/dashboard/cashier",
          icon: Wallet,
        },
        {
          label: "Payments",
          href: "/dashboard/payments",
          icon: CreditCard,
        },
      ],
    },
  ];
}

function getWaiterSidebar(): SidebarSection[] {
  return [
    {
      title: "Waiter",
      items: [
        {
          label: "Tables",
          href: "/dashboard/tables",
          icon: Table2,
        },
        {
          label: "Requests",
          href: "/dashboard/operations",
          icon: Bell,
        },
      ],
    },
  ];
}

export function getMobileNavigation(
  role: string,
  features: Features,
) {
  const sections = getSidebarSections(
    role,
    features,
  );

  const items = sections.flatMap(
    (section) => section.items,
  );

  return {
    bottom: items.slice(0, 4),
    more: items.slice(4),
  };
}