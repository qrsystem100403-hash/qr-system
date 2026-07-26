import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import WorkflowSettingsClient from "@/modules/settings/components/WorkflowSettingsClient";
import { can } from "@/lib/auth/can";
import { forbidden } from "next/navigation";

export default async function WorkflowSettingsPage() {
  const { restaurant, role } =
    await requireRestaurantUser();

  if (!can(role, "settings")) {
    forbidden();
  }

  return (
    <WorkflowSettingsClient
      tableWorkflowMode={
        restaurant.table_workflow_mode ??
        "simple"
      }
    />
  );
}