import { requireRestaurantUser } from "@/lib/requireRestaurantUser"
import OperationsRealtime from "./OperationRealtime"
import Link from "next/link"

export default async function OperationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string
  }>
}) {

  const params =
  await searchParams

const activeTab =
  params.tab === "resolved"
    ? "resolved"
    : "pending"

  const { restaurant, supabase } =
    await requireRestaurantUser()

  const { data: requests } = await supabase
  .from("requests")
  .select(`
  id,
  request_type,
  table_name,
  custom_message,
  status,
  created_at,
  resolved_at
`)
  .eq("restaurant_id", restaurant.id)
  .eq(
  "status",
  activeTab === "resolved"
    ? "resolved"
    : "pending"
)


  async function resolveRequest(
  requestId: string
) {
  "use server"

  console.log(
    "RESOLVING REQUEST",
    requestId
  )

  const { restaurant, supabase } =
    await requireRestaurantUser()

  const { data, error } = await supabase
  .from("requests")
  .update({
    status: "resolved",
    resolved_at: new Date().toISOString(),
  })
  .eq("id", requestId)
  .eq("restaurant_id", restaurant.id)
  .select()

console.log("UPDATED ROWS", data)
console.log("UPDATE ERROR", error)
console.log("UPDATE RESTAURANT", restaurant.id)

  console.log(
    "RESOLVE ERROR",
    error
  )
}

function getTimeAgo(
  dateString: string
) {
  const seconds =
    Math.floor(
      (Date.now() -
        new Date(
          dateString
        ).getTime()) /
        1000
    )

  if (seconds < 60)
    return `${seconds}s ago`

  const minutes =
    Math.floor(seconds / 60)

  if (minutes < 60)
    return `${minutes}m ago`

  const hours =
    Math.floor(minutes / 60)

  if (hours < 24)
    return `${hours}h ago`

  const days =
    Math.floor(hours / 24)

  return `${days}d ago`
}

const sortedRequests =
  [...(requests ?? [])].sort(
    (a, b) => {
      if (activeTab === "resolved") {
        return (
          new Date(
            b.resolved_at ?? ""
          ).getTime() -
          new Date(
            a.resolved_at ?? ""
          ).getTime()
        )
      }

      const priority: Record<string, number> = {
  bill: 1,
  other: 2,
  waiter: 3,
  water: 4,
  spoon: 5,
  fork: 6,
  tissue: 7,
}

      return (
        (priority[a.request_type] ??
          999) -
        (priority[b.request_type] ??
          999)
      )
    }
  )

  const billCount =
  requests?.filter(
    (r) => r.request_type === "bill"
  ).length ?? 0

const customCount =
  requests?.filter(
    (r) => r.request_type === "other"
  ).length ?? 0

const serviceCount =
  requests?.filter(
    (r) =>
      r.request_type !== "bill" &&
      r.request_type !== "other"
  ).length ?? 0


  const requestLabels: Record<
  string,
  string
> = {
  bill: "💳 Bill Request",
  waiter: "🙋 Waiter Request",
  water: "💧 Water Request",
  spoon: "🥄 Spoon Request",
  fork: "🍴 Fork Request",
  tissue: "🧻 Tissue Request",
  other: "💬 Custom Request",
}



  return (
  <>
    <OperationsRealtime
      restaurantId={restaurant.id}
    />

    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-black">
          Operations
        </h1>

        <p className="mt-1 text-sm text-[#667085] dark:text-[#98A2B3]">
          Manage service requests and
          customer assistance calls
        </p>
      </div>

      {activeTab === "pending" && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
            <p className="text-sm text-[#667085]">
              Pending
            </p>

            <p className="mt-2 text-3xl font-black">
              {requests?.length ?? 0}
            </p>
          </div>

          <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
            <p className="text-sm text-[#667085]">
              Bills
            </p>

            <p className="mt-2 text-3xl font-black text-red-600">
              {billCount}
            </p>
          </div>

          <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
            <p className="text-sm text-[#667085]">
              Service
            </p>

            <p className="mt-2 text-3xl font-black text-blue-600">
              {serviceCount}
            </p>
          </div>

          <div className="rounded-3xl border border-[#E4DED3] bg-white p-5 shadow-sm dark:border-[#2A2F35] dark:bg-[#171A1F]">
            <p className="text-sm text-[#667085]">
              Custom
            </p>

            <p className="mt-2 text-3xl font-black text-amber-600">
              {customCount}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Link
          href="/dashboard/operations"
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "pending"
              ? "bg-[#0B3B36] text-white"
              : "border border-[#E4DED3] bg-white dark:border-[#2A2F35] dark:bg-[#171A1F]"
          }`}
        >
          Pending
        </Link>

        <Link
          href="/dashboard/operations?tab=resolved"
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "resolved"
              ? "bg-[#0B3B36] text-white"
              : "border border-[#E4DED3] bg-white dark:border-[#2A2F35] dark:bg-[#171A1F]"
          }`}
        >
          Resolved
        </Link>
      </div>

      <div className="space-y-3">
        {sortedRequests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D0D5DD] bg-white p-12 text-center dark:border-[#2A2F35] dark:bg-[#171A1F]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F3EC] text-xl">
              ✅
            </div>

            <h3 className="mt-4 text-lg font-bold">
              All caught up
            </h3>

            <p className="mt-2 text-sm text-[#667085]">
              {activeTab ===
              "pending"
                ? "No pending requests right now."
                : "No resolved requests yet."}
            </p>
          </div>
        ) : (
          sortedRequests.map(
            (request) => (
              <div
                key={request.id}
                className="
                  rounded-3xl
                  border
                  border-[#E4DED3]
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:shadow-md
                  dark:border-[#2A2F35]
                  dark:bg-[#171A1F]
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-bold ${
                          request.request_type ===
                          "bill"
                            ? "text-red-600"
                            : request.request_type ===
                              "other"
                            ? "text-amber-600"
                            : "text-blue-600"
                        }`}
                      >
                        {
                          requestLabels[
                            request
                              .request_type
                          ]
                        }
                      </h3>

                      {activeTab ===
                        "resolved" && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold uppercase text-green-700">
                          Resolved
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#667085]">
                      <span className="rounded-full bg-[#F2F4F7] px-2 py-1 dark:bg-[#20242A]">
                        {
                          request.table_name
                        }
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {getTimeAgo(
                          request.created_at
                        )}
                      </span>
                    </div>

                    {request.request_type ===
                      "other" &&
                      request.custom_message && (
                        <div className="mt-3">
                          <p className="inline-flex rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950/30 dark:text-amber-200">
                            {
                              request.custom_message
                            }
                          </p>
                        </div>
                      )}

                    {activeTab ===
                      "resolved" &&
                      request.resolved_at && (
                        <p className="mt-3 text-xs font-semibold text-green-600">
                          Resolved{" "}
                          {getTimeAgo(
                            request.resolved_at
                          )}
                        </p>
                      )}
                  </div>

                  {activeTab ===
                    "pending" && (
                    <form
                      action={resolveRequest.bind(
                        null,
                        request.id
                      )}
                    >
                      <button
                        type="submit"
                        className="
                          rounded-2xl
                          bg-[#0B3B36]
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          text-white
                          transition
                          hover:opacity-90
                        "
                      >
                        Resolve
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )
          )
        )}
      </div>
    </section>
  </>
)
}