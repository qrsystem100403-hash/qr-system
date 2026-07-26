import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { can } from "@/lib/auth/can";
import { forbidden } from "next/navigation";
import BusinessDetails from "./BusinessDetails";

export default async function RestaurantProfilePage() {
  const { restaurant, role } =
    await requireRestaurantUser();

  if (!can(role, "settings")) {
    forbidden();
  }

  return (
    <div
      className="mx-auto space-y-8"
      style={{
        maxWidth: "900px",
      }}
    >
      <div>
        <p
          className="text-sm font-semibold"
          style={{
            color: "var(--color-primary)",
          }}
        >
          Restaurant Settings
        </p>

        <h1
          className="mt-2 text-4xl font-black"
          style={{
            color: "var(--color-heading)",
          }}
        >
          Restaurant Profile
        </h1>

        <p
          className="mt-3"
          style={{
            color:
              "var(--color-text-muted)",
          }}
        >
          Manage your restaurant information,
          branding and legal details.
        </p>
      </div>

      {/* Basic Information */}

      <section className="dashboard-card p-6">
        <h2 className="text-xl font-bold">
          Basic Information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Restaurant Name
            </label>

            <input
              defaultValue={restaurant.name}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Business Name
            </label>

            <input
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone
            </label>

            <input
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>
        </div>
      </section>

      <BusinessDetails />
    </div>
  );
}