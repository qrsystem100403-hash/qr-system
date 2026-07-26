import SettingsItem from "./SettingsItem";
import { LucideIcon } from "lucide-react";

type Item = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

type Props = {
  title: string;
  items: Item[];
};

export default function SettingsCategory({
  title,
  items,
}: Props) {
  return (
    <section className="space-y-4">
      <div className="mb-4">
  <h2
    className="text-lg font-bold"
    style={{
      color: "var(--color-heading)",
    }}
  >
    {title}
  </h2>

  <p
    className="mt-1 text-sm"
    style={{
      color: "var(--color-text-muted)",
    }}
  >
    {getCategoryDescription(title)}
  </p>

  <div
    className="mt-4 h-px"
    style={{
      background: "var(--color-divider)",
    }}
  />
</div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
  {items.map((item) => (
    <SettingsItem
      key={item.title}
      title={item.title}
      description={item.description}
      href={item.href}
      icon={item.icon}
      comingSoon={item.comingSoon}
    />
  ))}
</div>
      
    </section>
    
  );
  function getCategoryDescription(
  title: string,
) {
  switch (title) {
    case "Restaurant":
      return "Restaurant profile, attendance and table configuration.";

    case "Operations":
      return "Configure order processing and daily restaurant workflows.";

    case "Staff":
      return "Manage employees, roles and shift assignments.";

    case "Billing":
      return "Taxes, printers, invoices and payment configuration.";

    case "Integrations":
      return "Connect payment gateways and third-party services.";

    default:
      return "";
  }
}
}