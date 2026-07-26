"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  Armchair,
  Save,
  Settings2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import DashboardSegmentedControl from "@/app/components/dashboard/ui/DashboardSegmentedControl";

import DashboardButton from "@/app/components/dashboard/ui/DashboardButton";
import DashboardCard from "@/app/components/dashboard/ui/DashboardCard";
import DashboardBadge from "@/app/components/dashboard/ui/DashboardBadge";

type Props = {
  tableWorkflowMode:
    | "simple"
    | "advanced"
    | "expert";
}

export default function WorkflowSettingsClient({
  tableWorkflowMode,
}: Props) {

const [tableWorkflow, setTableWorkflow] =
  useState(tableWorkflowMode);

const [loading, setLoading] =
  useState(false);

  const hasChanges = useMemo(() => {
  return tableWorkflowMode !== tableWorkflow;
}, [
  tableWorkflowMode,
  tableWorkflow,
]);

  async function saveSettings() {
    try {
      setLoading(true)

      const response = await fetch(
        "/api/dashboard/settings/workflows",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
  table_workflow_mode: tableWorkflow,
}),
        }
      )

      const result =
        await response.json()

      if (!result.success) {
        toast.error(
          result.error ||
            "Failed to save settings"
        )
        return
      }

      toast.success(
        "Workflow settings updated"
      )
    } catch {
      toast.error(
        "Failed to save settings"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
  <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">

    {/* Header */}

    <DashboardCard padding="lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <DashboardBadge variant="info">
            Restaurant Settings
          </DashboardBadge>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-heading)] lg:text-4xl">
            Workflow Configuration
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
            Configure how orders and tables move through your restaurant.
            These settings affect the behaviour of your entire ordering
            system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[300px]">


          <SummaryCard
            title="Tables"
            value={tableWorkflow}
            icon={<Armchair className="size-5" />}
          />

          <SummaryCard
            title="Status"
            value="Active"
            icon={<Settings2 className="size-5" />}
          />

        </div>

      </div>
    </DashboardCard>

    

    <DashboardCard padding="lg">
  <div className="flex flex-col gap-8">

    <div className="flex items-start gap-4">

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-[var(--radius-lg)]
          bg-[var(--color-primary-soft)]
          text-[var(--color-primary)]
        "
      >
        <Armchair className="size-6" />
      </div>

      <div>

        <h2 className="text-2xl font-bold text-[var(--color-heading)]">
          Table Workflow
        </h2>

        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Decide how tables are managed throughout service.
        </p>

      </div>

    </div>

    <div className="space-y-6">

  <DashboardSegmentedControl
    className="lg:grid-cols-3"
    value={tableWorkflow}
    onChange={setTableWorkflow}
    options={[
      {
        value: "simple",
        label: "Simple",
        description:
          "Automatic management",
      },
      {
        value: "advanced",
        label: "Advanced",
        description:
          "Manual table release",
      },
      {
        value: "expert",
        label: "Expert",
        description:
          "Full manual workflow",
      },
    ]}
  />

  <DashboardCard
    padding="md"
    className="bg-[var(--color-surface-soft)]"
  >
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
      Preview
    </p>

    <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium">

      <DashboardBadge variant="success">
        Available
      </DashboardBadge>

      <ArrowRight className="size-4 text-[var(--color-text-soft)]" />

      <DashboardBadge variant="warning">
        Occupied
      </DashboardBadge>
      <ArrowRight className="size-4 text-[var(--color-text-soft)]" />

          <DashboardBadge variant="info">
            Bill Requested
          </DashboardBadge>


      {tableWorkflow === "expert" && (
        <>
          <ArrowRight className="size-4 text-[var(--color-text-soft)]" />

          <DashboardBadge variant="neutral">
            Inspection
          </DashboardBadge>
        </>
      )}

    </div>
  </DashboardCard>

</div>

  </div>
</DashboardCard>

    {hasChanges && (
  <div
    className="
      sticky
      bottom-4
      z-40
      mt-2
    "
  >
    <DashboardCard
      padding="md"
      className="
        border-[var(--color-primary-border)]
        shadow-[var(--shadow-lg)]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* Left */}

        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-[var(--radius-lg)]
              bg-[var(--color-warning-soft)]
              text-[var(--color-warning)]
            "
          >
            <Save className="size-5" />
          </div>

          <div>
            <h3 className="font-semibold text-[var(--color-heading)]">
              Unsaved Changes
            </h3>

            <p className="text-sm text-[var(--color-text-muted)]">
              Save your workflow configuration.
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="flex gap-3">

          <DashboardButton
            variant="secondary"
            onClick={() => {
              setTableWorkflow(tableWorkflowMode);
            }}
          >
            Reset
          </DashboardButton>

          <DashboardButton
            loading={loading}
            onClick={saveSettings}
          >
            Save Changes
          </DashboardButton>

        </div>
      </div>
    </DashboardCard>
  </div>
)}

  </section>
)
function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: ReactNode
}) {
  return (
    <DashboardCard padding="sm">
      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
            {title}
          </p>

          <h3 className="mt-3 text-xl font-bold capitalize text-[var(--color-heading)]">
            {value}
          </h3>

        </div>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-[var(--radius-lg)]
            bg-[var(--color-primary-soft)]
            text-[var(--color-primary)]
          "
        >
          {icon}
        </div>

      </div>
    </DashboardCard>
  )
}

  
}
