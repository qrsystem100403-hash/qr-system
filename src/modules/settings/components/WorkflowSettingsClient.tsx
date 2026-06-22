"use client"

import { useState } from "react"
import {
  Loader2,
  Save,
  Settings2,
  Workflow,
  ChefHat,
  Armchair,
} from "lucide-react"
import { toast } from "sonner"

type Props = {
  workflowMode: "simple" | "advanced"
  tableWorkflowMode:
    | "simple"
    | "advanced"
    | "expert"
}

export default function WorkflowSettingsClient({
  workflowMode,
  tableWorkflowMode,
}: Props) {
  const [orderWorkflow, setOrderWorkflow] =
    useState(
      workflowMode ?? "simple"
    )

  const [tableWorkflow, setTableWorkflow] =
    useState(
      tableWorkflowMode ??
        "simple"
    )

  const [loading, setLoading] =
    useState(false)

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
            workflow_mode:
              orderWorkflow,
            table_workflow_mode:
              tableWorkflow,
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
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-black">
          Settings
        </h1>

        <p className="mt-1 text-sm text-[#667085] dark:text-[#98A2B3]">
          Configure restaurant
          workflows and operational
          behavior.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#667085] dark:text-[#98A2B3]">
                Order Workflow
              </p>

              <p className="mt-2 text-3xl font-black capitalize">
                {orderWorkflow}
              </p>
            </div>

            <ChefHat className="size-6 text-[#2F7D57]" />
          </div>
        </div>

        <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#667085] dark:text-[#98A2B3]">
                Table Workflow
              </p>

              <p className="mt-2 text-3xl font-black capitalize">
                {tableWorkflow}
              </p>
            </div>

            <Armchair className="size-6 text-[#2F7D57]" />
          </div>
        </div>

        <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#667085] dark:text-[#98A2B3]">
                Configuration
              </p>

              <p className="mt-2 text-3xl font-black">
                Active
              </p>
            </div>

            <Settings2 className="size-6 text-[#2F7D57]" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#E4DED3] bg-white p-6 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]">
            <Workflow className="size-5" />
          </div>

          <div>
            <h2 className="text-xl font-black">
              Order Workflow
            </h2>

            <p className="text-sm text-[#667085] dark:text-[#98A2B3]">
              Control how orders move
              through the kitchen.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <label
            className={`cursor-pointer rounded-3xl border p-5 transition ${
              orderWorkflow ===
              "simple"
                ? "border-[#2F7D57] bg-[#E7F3EC] dark:bg-[#183026]"
                : "border-[#E4DED3] dark:border-[#2A2F35]"
            }`}
          >
            <input
              type="radio"
              name="orderWorkflow"
              className="hidden"
              checked={
                orderWorkflow ===
                "simple"
              }
              onChange={() =>
                setOrderWorkflow(
                  "simple"
                )
              }
            />

            <p className="font-bold">
              Simple Workflow
            </p>

            <p className="mt-1 text-sm text-[#667085] dark:text-[#98A2B3]">
              Orders move with
              minimal staff
              interaction and fewer
              status updates.
            </p>
          </label>

          <label
            className={`cursor-pointer rounded-3xl border p-5 transition ${
              orderWorkflow ===
              "advanced"
                ? "border-[#2F7D57] bg-[#E7F3EC] dark:bg-[#183026]"
                : "border-[#E4DED3] dark:border-[#2A2F35]"
            }`}
          >
            <input
              type="radio"
              name="orderWorkflow"
              className="hidden"
              checked={
                orderWorkflow ===
                "advanced"
              }
              onChange={() =>
                setOrderWorkflow(
                  "advanced"
                )
              }
            />

            <p className="font-bold">
              Advanced Workflow
            </p>

            <p className="mt-1 text-sm text-[#667085] dark:text-[#98A2B3]">
              Full kitchen lifecycle
              with preparation and
              serving stages.
            </p>
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-[#E4DED3] bg-white p-6 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-[#E7F3EC] text-[#2F7D57] dark:bg-[#183026] dark:text-[#7BC99A]">
            <Armchair className="size-5" />
          </div>

          <div>
            <h2 className="text-xl font-black">
              Table Workflow
            </h2>

            <p className="text-sm text-[#667085] dark:text-[#98A2B3]">
              Control how table
              statuses behave during
              restaurant operations.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {[
            {
              value: "simple",
              title: "Simple",
              description:
                "Everything managed automatically.",
            },
            {
              value: "advanced",
              title: "Advanced",
              description:
                "Staff manually marks tables available.",
            },
            {
              value: "expert",
              title: "Expert",
              description:
                "Complete manual control over table states.",
            },
          ].map((mode) => (
            <label
              key={mode.value}
              className={`cursor-pointer rounded-3xl border p-5 transition ${
                tableWorkflow ===
                mode.value
                  ? "border-[#2F7D57] bg-[#E7F3EC] dark:bg-[#183026]"
                  : "border-[#E4DED3] dark:border-[#2A2F35]"
              }`}
            >
              <input
                type="radio"
                name="tableWorkflow"
                className="hidden"
                checked={
                  tableWorkflow ===
                  mode.value
                }
                onChange={() =>
                  setTableWorkflow(
                    mode.value as
                      | "simple"
                      | "advanced"
                      | "expert"
                  )
                }
              />

              <p className="font-bold">
                {mode.title}
              </p>

              <p className="mt-1 text-sm text-[#667085] dark:text-[#98A2B3]">
                {
                  mode.description
                }
              </p>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={loading}
          className="
            inline-flex
            h-12
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-[#0B3B36]
            px-6
            text-sm
            font-bold
            text-white
            transition
            hover:opacity-90
            disabled:opacity-50
          "
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}

          Save Changes
        </button>
      </div>
    </section>
  )
}