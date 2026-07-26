"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import DashboardPagination from "@/app/components/dashboard/ui/DashboardPagination";
import {
  RefreshCw,
  Search,
  CreditCard,
  Bell,
  Droplets,
  Utensils,
  MessageSquare,
  CheckCircle2,
  Clock3,
  ReceiptText,
  ConciergeBell,
} from "lucide-react";
;

import { useDashboardHeader } from "@/app/components/dashboard/header/DashboardHeaderProvider";

import DashboardButton from "@/app/components/dashboard/ui/DashboardButton";
import DashboardToolbar from "@/app/components/dashboard/ui/DashboardToolbar";
import DashboardSearch from "@/app/components/dashboard/ui/DashboardSearch";
import DashboardCard from "@/app/components/dashboard/ui/DashboardCard";
import DashboardBadge from "@/app/components/dashboard/ui/DashboardBadge";
import DashboardStats from "@/app/components/dashboard/ui/DashboardStats";



type Request = {
  id: string;
  request_type: string;
  table_name: string;
  custom_message: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
};

type Props = {
  activeTab: "pending" | "resolved";
  requests: Request[];
  billCount: number;
  customCount: number;
  serviceCount: number;
  resolveRequest: (requestId: string) => Promise<void>;
};

const FILTERS = [
  "All",
  "Bill",
  "Waiter",
  "Water",
  "Fork",
  "Spoon",
  "Tissue",
  "Other",
];

const REQUEST_LABELS: Record<string, string> = {
  bill: "Bill Requested",
  waiter: "Waiter Requested",
  water: "Water Requested",
  spoon: "Spoon Requested",
  fork: "Fork Requested",
  tissue: "Tissue Requested",
  other: "Custom Request",
};

export default function OperationsClient({
  activeTab,
  requests,
  billCount,
  customCount,
  serviceCount,
  resolveRequest,
}: Props) {
  const router = useRouter();

  const { setHeader } = useDashboardHeader();

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [isPending, startTransition] = useTransition();

  const [page, setPage] = useState(1);

const [pageSize, setPageSize] =
  useState(12);

  useEffect(() => {
  setPage(1);
}, [search, filter]);
  

  useEffect(() => {
    setHeader({
      title: "Operations",
      description:
        "Monitor and resolve customer service requests.",
        actions: (
            <DashboardButton
            variant="secondary"
            onClick={() => router.refresh()}
  aria-label="Refresh"
  className="
    h-9
    w-9
    p-0
    lg:h-11
    lg:w-auto
    lg:px-5
  "
>
  <RefreshCw className="size-4" />
  <span className="hidden lg:inline">
    Refresh
  </span>
</DashboardButton>
      ),
    });

    return () => setHeader(null);
  }, [router, setHeader]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.table_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        REQUEST_LABELS[
          request.request_type
        ]
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        request.custom_message
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All"
          ? true
          : request.request_type ===
            filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [requests, search, filter]);

  const totalPages = Math.ceil(
  filteredRequests.length / pageSize
);

const paginatedRequests =
  filteredRequests.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  function getTimeAgo(date: string) {
    const seconds = Math.floor(
      (Date.now() -
        new Date(date).getTime()) /
        1000,
    );

    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours}h`;

    return `${Math.floor(hours / 24)}d`;
  }


  function getRequestTheme(type: string) {
  switch (type) {
    case "bill":
      return {
        bg: "bg-red-100 dark:bg-red-500/10",
        text: "text-red-600",
      };

    case "waiter":
      return {
        bg: "bg-blue-100 dark:bg-blue-500/10",
        text: "text-blue-600",
      };

    case "water":
      return {
        bg: "bg-cyan-100 dark:bg-cyan-500/10",
        text: "text-cyan-600",
      };

    case "fork":
    case "spoon":
    case "tissue":
      return {
        bg: "bg-emerald-100 dark:bg-emerald-500/10",
        text: "text-emerald-600",
      };

    default:
      return {
        bg: "bg-amber-100 dark:bg-amber-500/10",
        text: "text-amber-600",
      };
  }
}

  function getIcon(type: string) {
    switch (type) {
      case "bill":
        return CreditCard;

      case "waiter":
        return Bell;

      case "water":
        return Droplets;

      case "fork":
      case "spoon":
      case "tissue":
        return Utensils;

      case "other":
        return MessageSquare;

      default:
        return Bell;
    }
  }
    return (
    <main
      className="
        space-y-6
        pb-24
        lg:pb-8
      "
    >
      <DashboardToolbar
        left={
          <DashboardSearch
            value={search}
            onChange={setSearch}
            placeholder="Search table or request..."
          />
        }
        right={
          <div
            className="
              flex
              rounded-[var(--radius-xl)]
              border
              border-[var(--color-border)]
              bg-[var(--color-surface-soft)]
              p-1
            "
          >
            <Link
              href="/dashboard/operations"
              className={`
                rounded-[calc(var(--radius-xl)-4px)]
                px-4
                py-2
                text-sm
                font-semibold
                transition
                ${
                  activeTab === "pending"
                    ? `
                      bg-[var(--color-primary)]
                      text-white
                    `
                    : `
                      text-[var(--color-text)]
                    `
                }
              `}
            >
              Pending
            </Link>

            <Link
              href="/dashboard/operations?tab=resolved"
              className={`
                rounded-[calc(var(--radius-xl)-4px)]
                px-4
                py-2
                text-sm
                font-semibold
                transition
                ${
                  activeTab === "resolved"
                    ? `
                      bg-[var(--color-primary)]
                      text-white
                    `
                    : `
                      text-[var(--color-text)]
                    `
                }
              `}
            >
              Resolved
            </Link>
          </div>
        }
      />

      {activeTab === "pending" && (
  <DashboardStats
    items={[
      {
        label: "Pending Requests",
        value: requests.length,
        icon: Bell,
        description: "Waiting for action",
      },
      {
        label: "Bill Requests",
        value: billCount,
        icon: ReceiptText,
        description: "Need billing",
      },
      {
        label: "Service Requests",
        value: serviceCount,
        icon: ConciergeBell,
        description: "Customer assistance",
      },
      {
        label: "Custom Requests",
        value: customCount,
        icon: MessageSquare,
        description: "Special requests",
      },
    ]}
  />
)}


      <div
        className="
          flex
          gap-2
          overflow-x-auto
          pb-1
          scrollbar-none
        "
      >
        {FILTERS.map((item) => (
          <DashboardButton
            key={item}
            type="button"
            variant={
              filter === item
                ? "primary"
                : "secondary"
            }
            onClick={() => setFilter(item)}
            className="whitespace-nowrap"
          >
            {item}
          </DashboardButton>
        ))}
      </div>

      <div
  className="
    grid
    gap-4
    grid-cols-1
xl:grid-cols-2
  "
>
                {filteredRequests.length === 0 ? (
          <DashboardCard
  className="
    py-16
    md:col-span-2
    2xl:col-span-3
  "
>
            <div className="flex flex-col items-center justify-center text-center">
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--color-primary-soft)]
                "
              >
                <CheckCircle2
                  className="
                    size-8
                    text-[var(--color-primary)]
                  "
                />
              </div>

              <h3
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-[var(--color-heading)]
                "
              >
                All caught up
              </h3>

              <p
                className="
                  mt-2
                  max-w-sm
                  text-sm
                  text-[var(--color-text-muted)]
                "
              >
                {activeTab === "pending"
                  ? "There are no pending service requests."
                  : "No resolved requests yet."}
              </p>
            </div>
          </DashboardCard>
        ) : (
          paginatedRequests.map((request) => {
            const Icon = getIcon(request.request_type);
            const theme = getRequestTheme(request.request_type);

            return (
              <DashboardCard
  key={request.id}
  hover
  className="
    h-full
    overflow-hidden
    transition-all
    duration-200
    hover:-translate-y-1
  "
>
  <div className="flex h-full flex-col p-5">

    {/* Header */}
    <div className="flex items-start gap-4">

      <div
        className={`
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-2xl
          ${theme.bg}
        `}
      >
        <Icon className={`size-5 ${theme.text}`} />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <h3
              className="
                text-base
                font-semibold
                text-[var(--color-heading)]
              "
            >
              {REQUEST_LABELS[request.request_type]}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2">

              <DashboardBadge>
                {request.table_name}
              </DashboardBadge>

              <div
                className="
                  flex
                  items-center
                  gap-1
                  text-xs
                  text-[var(--color-text-muted)]
                "
              >
                <Clock3 className="size-3.5" />
                {getTimeAgo(request.created_at)} ago
              </div>

            </div>

          </div>

          {activeTab === "resolved" ? (
            <DashboardBadge variant="success">
              Resolved
            </DashboardBadge>
          ) : (
            <DashboardBadge variant="warning">
              Pending
            </DashboardBadge>
          )}

        </div>

      </div>

    </div>

    {/* Body */}

    <div className="mt-5 flex-1">

      {request.custom_message ? (

        <div
          className="
            rounded-[var(--radius-lg)]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface-soft)]
            p-4
          "
        >
          <p
            className="
              text-sm
              leading-6
              text-[var(--color-text)]
            "
          >
            {request.custom_message}
          </p>
        </div>

      ) : (

        <div
          className="
            rounded-[var(--radius-lg)]
            bg-[var(--color-surface-soft)]
            px-4
            py-3
          "
        >
          <p
            className="
              text-sm
              text-[var(--color-text-soft)] text-center
              font-medium
            "
          >
            
            <span>
              {REQUEST_LABELS[
                request.request_type
              ].toLowerCase()}
            </span>
           {" "} by Customer
          </p>
        </div>

      )}

    </div>

    {/* Footer */}

    <div
      className="
        mt-5
        flex
        items-center
        justify-between
        border-t
        border-[var(--color-border)]
        pt-4
      "
    >

      {activeTab === "resolved" ? (

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-green-600
          "
        >
          <CheckCircle2 className="size-4" />
          Resolved
        </div>

      ) : (

        <DashboardBadge variant="warning">
          Pending
        </DashboardBadge>

      )}

      {activeTab === "pending" && (

        <form
  action={() =>
    startTransition(async () => {
      await resolveRequest(request.id);
    })
  }
>
  <DashboardButton
    type="submit"
    loading={isPending}
    disabled={isPending}
    className="h-10 px-4"
  >
    {!isPending && (
      <CheckCircle2 className="size-4" />
    )}
    Resolve
  </DashboardButton>
</form>

      )}

    </div>

  </div>
</DashboardCard>
            );
          })
        )}
      </div>

      <DashboardPagination
  page={page}
  totalPages={totalPages}
  totalItems={filteredRequests.length}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>
           
    </main>
  );
}
    