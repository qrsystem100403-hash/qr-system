import {
  Bell,
  CreditCard,
  QrCode,
  ReceiptIndianRupee,
  Settings2,
  Store,
  Table2,
  Users,
  Printer,
  Plug,
  MapPinned,
  ShieldCheck,
  Workflow,
} from "lucide-react";

export const SETTINGS_SECTIONS = [
  {
    title: "Restaurant",
    items: [
      {
        title: "Restaurant Profile",
        description:
          "Restaurant name, logo, address and contact information.",
        href: "/dashboard/settings/restaurant",
        icon: Store,
      },
      {
        title: "Restaurant Features",
        description:
          "Enable kitchen, cashier, waiter and online ordering modules.",
        href: "/dashboard/settings/features",
        icon: Settings2,
      },
      {
        title: "Attendance",
        description:
          "Configure GPS attendance and attendance policies.",
        href: "/dashboard/settings/attendance",
        icon: MapPinned,
      },
      {
        title: "Workflow",
        description:
          "Configure order workflow and restaurant operations.",
        href: "/dashboard/settings/workflow",
        icon: Workflow,
      },
    ],
  },

  {
    title: "Operations",
    items: [
      {
        title: "Tables",
        description:
          "Configure dining tables and table behaviour.",
        href: "/dashboard/settings/tables",
        icon: Table2,
        comingSoon: true,
      },
      {
        title: "QR Ordering",
        description:
          "Customer ordering preferences and QR experience.",
        href: "/dashboard/settings/qr-ordering",
        icon: QrCode,
        comingSoon: true,
      },
      {
        title: "Notifications",
        description:
          "Manage notification delivery and alerts.",
        href: "/dashboard/settings/notifications",
        icon: Bell,
        comingSoon: true,
      },
    ],
  },

  {
    title: "Staff",
    items: [
      {
        title: "Roles & Permissions",
        description:
          "Control dashboard access for each role.",
        href: "/dashboard/settings/staff",
        icon: ShieldCheck,
        comingSoon: true,
      },
      {
        title: "Shift Management",
        description:
          "Create shifts and assign them to staff members.",
        href: "/dashboard/settings/shifts",
        icon: Users,
        comingSoon: true,
      },
    ],
  },

  {
    title: "Billing",
    items: [
      {
        title: "Billing & Taxes",
        description:
          "GST, service charge and billing configuration.",
        href: "/dashboard/settings/billing",
        icon: ReceiptIndianRupee,
      },
      {
        title: "Printer",
        description:
          "Thermal printer configuration.",
        href: "/dashboard/settings/printer",
        icon: Printer,
        comingSoon: true,
      },
      {
        title: "Payment Gateway",
        description:
          "Configure Razorpay and future payment gateways.",
        href: "/dashboard/settings/payment",
        icon: CreditCard,
        comingSoon: true,
      },
    ],
  },

];