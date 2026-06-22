import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import WorkflowSettingsClient from "@/modules/settings/components/WorkflowSettingsClient"

export default async function SettingsPage() {
  const { restaurant } =
    await requireRestaurantUser()

  return (
    <WorkflowSettingsClient
  workflowMode={
    restaurant.workflow_mode ??
    "simple"
  }
  tableWorkflowMode={
    restaurant.table_workflow_mode ??
    "simple"
  }
/>
  )
}