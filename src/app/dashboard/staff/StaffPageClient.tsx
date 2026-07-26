"use client";

import { useCallback, useEffect, useState } from "react";
import AddStaffDialog from "./_components/AddStaffDialog";
import StaffTable from "./StaffTable";
import type { Staff } from "@/modules/staff/types";
import EditStaffDialog from "./_components/EditStaffDialog";
import StaffStats from "./_components/StaffStats";
import StaffFilters from "./_components/StaffFilters";
import { toast } from "sonner";


type Props = {
  initialPage: number;
  initialSearch: string;
  initialRole: string;
  initialStatus: string;
  initialSort: string;
};

export default function StaffPageClient({
  initialPage,
  initialSearch,
  initialRole,
  initialStatus,
  initialSort,
}: Props) {

  const [staff, setStaff] =
  useState<Staff[]>([]);

const [loading, setLoading] =
  useState(true);

const [editingStaff, setEditingStaff] =
  useState<Staff | null>(null);

const [page, setPage] =
  useState(initialPage);

const [search, setSearch] =
  useState(initialSearch);

const [roleFilter, setRoleFilter] =
  useState(initialRole);

const [statusFilter, setStatusFilter] =
  useState(initialStatus);

const [sort, setSort] =
  useState(initialSort);


const total = staff.length;

const active = staff.filter(
  (member) =>
    member.employment_status ===
    "active",
).length;

const onLeave = staff.filter(
  (member) =>
    member.employment_status ===
    "on_leave",
).length;

const terminated = staff.filter(
  (member) =>
    member.employment_status ===
    "terminated",
).length;

const managers = staff.filter(
  (member) => member.role === "manager",
).length;

const inactive = staff.filter(
  (member) =>
    member.profile?.is_active === false,
).length;



const loadStaff = useCallback(
  async (
    currentPage = page,
    currentSearch = search,
    currentRole = roleFilter,
    currentStatus = statusFilter,
    currentSort = sort,
  ) => {
  setLoading(true);

  try {
    const params = new URLSearchParams({
  page: String(currentPage),
  search: currentSearch,
  role: currentRole,
  status: currentStatus,
  sort: currentSort,
});

const res = await fetch(
  `/api/dashboard/staff?${params.toString()}`
);

   const result = await res.json();

if (result.success) {
  setStaff(result.data?.staff ?? []);
}
  } finally {
    setLoading(false);
  }
},
[
  page,
  search,
  roleFilter,
  statusFilter,
  sort,
]);

const handleToggleStatus = async (
  member: Staff,
) => {
  try {
    const response = await fetch(
      "/api/dashboard/staff",
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
  userId: member.user_id,
  status:
    member.employment_status === "active"
      ? "terminated"
      : "active",
}),
      },
    );

    const data =
      await response.json();

    if (!response.ok) {
      toast.error(
        data.error ??
          "Failed to update staff status.",
      );
      return;
    }

    toast.success(data.message);

    await loadStaff();
  } catch {
    toast.error(
      "Failed to update staff status.",
    );
  }
};

useEffect(() => {
  loadStaff();
}, [loadStaff]);

const filteredStaff = [...staff]
  .filter((member) => {
    const searchTerm = search
      .trim()
      .toLowerCase();

    if (!searchTerm) {
      return true;
    }

    return [
      member.employee_id,
      member.profile?.full_name,
      member.profile?.email,
      member.profile?.phone,
    ]
      .filter(Boolean)
      .some((value) =>
        value!
          .toLowerCase()
          .includes(searchTerm),
      );
  })
  .filter((member) => {
    if (roleFilter === "all") {
      return true;
    }

    return member.role === roleFilter;
  })
  .filter((member) => {
    if (statusFilter === "all") {
      return true;
    }

    return (
      member.employment_status ===
      statusFilter
    );
  });

switch (sort) {
  case "oldest":
    filteredStaff.sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime(),
    );
    break;

  case "name":
    filteredStaff.sort((a, b) =>
      (a.profile?.full_name ?? "").localeCompare(
        b.profile?.full_name ?? "",
      ),
    );
    break;

  case "role":
    filteredStaff.sort((a, b) =>
      a.role.localeCompare(b.role),
    );
    break;

  default:
    filteredStaff.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime(),
    );
}

  return (
    <div className="">

      
      
<StaffTable
  loading={loading}
  staff={filteredStaff}
  total={total}
  active={active}
  onLeave={onLeave}
  managers={managers}
  search={search}
  role={roleFilter}
  status={statusFilter}
  sort={sort}
  onSearchChange={setSearch}
  onRoleChange={setRoleFilter}
  onStatusChange={setStatusFilter}
  onSortChange={setSort}
  onClear={() => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setSort("newest");
  }}
  onToggleStatus={handleToggleStatus}
  onEdit={setEditingStaff}
/>

<EditStaffDialog
  open={!!editingStaff}
  staff={editingStaff}
  onClose={() => setEditingStaff(null)}
  onUpdated={async () => {
    await loadStaff();
    setEditingStaff(null);
  }}
/>

    </div>
  );
}