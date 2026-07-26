import { Search } from "lucide-react";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { can } from "@/lib/auth/can";
import { forbidden } from "next/navigation";
import SettingsCategory from "./_components/SettingsCategory";
import { SETTINGS_SECTIONS } from "./_components/settings-data";

export default async function SettingsPage() {
  const { role } = await requireRestaurantUser();

  if (!can(role, "settings")) {
    forbidden();
  }

  return (
    <div
      className="mx-auto space-y-8"
      style={{
        maxWidth: "var(--page-max-width)",
      }}
    >
      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p
            className="text-sm font-semibold"
            style={{
              color: "var(--color-primary)",
            }}
          >
            Restaurant Configuration
          </p>

          <h1
            className="mt-2 text-4xl font-black"
            style={{
              color: "var(--color-heading)",
            }}
          >
            Settings
          </h1>

          <p
            className="mt-3 max-w-2xl"
            style={{
              color: "var(--color-text-muted)",
            }}
          >
            Manage workflows, billing, QR ordering, notifications,
            staff permissions and future integrations from one place.
          </p>
        </div>

        {/* Search */}

        <div
          className="dashboard-card flex h-12 w-full max-w-md items-center gap-3 px-4"
        >
          <Search
            className="h-5 w-5"
            style={{
              color: "var(--color-text-soft)",
            }}
          />

          <input
            placeholder="Search settings..."
            disabled
            className="w-full bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Categories */}

      <div className="space-y-16">
        {SETTINGS_SECTIONS.map((section) => (
          <SettingsCategory
            key={section.title}
            title={section.title}
            items={section.items}
          />
        ))}
      </div>
    </div>
  );
}