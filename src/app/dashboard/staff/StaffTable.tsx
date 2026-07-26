"use client";

import StaffMobileList from "./_components/mobile/StaffMobileList";
import type { Staff } from "@/modules/staff/types";
import StaffManagementTable from "./StaffManagementTable";
import AddStaffDialog from "./_components/AddStaffDialog";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Briefcase,
  RotateCcw,
} from "lucide-react";

type Props = {
  staff: Staff[];
  loading: boolean;

  total: number;
  active: number;
  onLeave: number;
  managers: number;

  search: string;
  role: string;
  status: string;
  sort: string;

  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClear: () => void;

  onEdit: (staff: Staff) => void;
  onToggleStatus: (staff: Staff) => void;
};

export default function StaffTable({
  staff,
  loading,

  total,
  active,
  onLeave,
  managers,

  search,
  role,
  status,
  sort,

  onSearchChange,
  onRoleChange,
  onStatusChange,
  onSortChange,
  onClear,

  onEdit,
  onToggleStatus,
}: Props) {
  return (
  <section
    className="
      overflow-hidden
      rounded-[20px]
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      
      
    "
  >
    {/* Header */}
    <div
      className="
        border-b
        border-[var(--color-border)]
        p-6
      "
    >
      <div className="flex flex-col gap-5">

  <div className="flex items-center justify-between gap-4">

    <div>

      <h2
        className="
          text-2xl
          font-bold
          text-[var(--color-heading)]
        "
      >
        Staff Management
      </h2>

      <p
        className="
          mt-1
          text-sm
          text-[var(--color-text-muted)]
        "
      >
        Manage employees, shifts and permissions.
      </p>

    </div>
    <div
    className="
      flex
      flex-wrap
      gap-3
    "
  >

    <div className="flex items-center gap-2 rounded-xl bg-[var(--color-primary-soft)] px-4 py-2">
      <Users className="size-4 text-[var(--color-primary)]"/>
      <span className="font-semibold">
        {total}
      </span>
      <span className="text-sm text-[var(--color-text-muted)]">
        Total
      </span>
    </div>

    <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2">
      <UserCheck className="size-4 text-emerald-600"/>
      <span className="font-semibold">
        {active}
      </span>
      <span className="text-sm">
        Active
      </span>
    </div>

    <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2">
      <UserX className="size-4 text-amber-600"/>
      <span className="font-semibold">
        {onLeave}
      </span>
      <span className="text-sm">
        Leave
      </span>
    </div>

    <div className="flex items-center gap-2 rounded-xl bg-sky-500/10 px-4 py-2">
      <Briefcase className="size-4 text-sky-600"/>
      <span className="font-semibold">
        {managers}
      </span>
      <span className="text-sm">
        Managers
      </span>
    </div>

  </div>

    <AddStaffDialog />
    

  </div>
  

  

</div>
      </div>

      {/* Toolbar */}
<div
  className="
    flex
    flex-col
    gap-4
    border-t
    border-[var(--color-border)]
    bg-[var(--color-surface)]
    p-5
    lg:flex-row
    lg:items-center
    lg:justify-between
  "
>
  {/* Search */}
  <div
    className="
      flex
      h-11
      w-full
      max-w-md
      items-center
      rounded-xl
      border
      border-[var(--color-border)]
      bg-[var(--color-surface-soft)]
      px-4
    "
  >
    <Search
      className="
        size-4
        text-[var(--color-text-muted)]
      "
    />

    <input
      value={search}
      onChange={(e) =>
        onSearchChange(e.target.value)
      }
      placeholder="Search employee, ID, email..."
      className="
        h-full
        flex-1
        bg-transparent
        px-3
        outline-none
      "
    />
  </div>

  {/* Filters */}
  <div
    className="
      flex
      flex-wrap
      items-center
      gap-3
    "
  >
    <select
      value={role}
      onChange={(e) =>
        onRoleChange(e.target.value)
      }
      className="
        h-11
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-4
      "
    >
      <option value="all">
        All Roles
      </option>

      <option value="manager">
        Manager
      </option>

      <option value="cashier">
        Cashier
      </option>

      <option value="kitchen">
        Kitchen
      </option>

      <option value="waiter">
        Waiter
      </option>
    </select>

    <select
      value={status}
      onChange={(e) =>
        onStatusChange(e.target.value)
      }
      className="
        h-11
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-4
      "
    >
      <option value="all">
        All Status
      </option>

      <option value="active">
        Active
      </option>

      <option value="on_leave">
        On Leave
      </option>

      <option value="terminated">
        Terminated
      </option>
    </select>

    <select
      value={sort}
      onChange={(e) =>
        onSortChange(e.target.value)
      }
      className="
        h-11
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-4
      "
    >
      <option value="newest">
        Newest
      </option>

      <option value="oldest">
        Oldest
      </option>

      <option value="name">
        Name
      </option>

      <option value="role">
        Role
      </option>
    </select>

    <button
      onClick={onClear}
      className="
        flex
        h-11
        items-center
        gap-2
        rounded-xl
        border
        border-[var(--color-border)]
        px-4
        transition-colors
        hover:bg-[var(--color-surface-soft)]
      "
    >
      <RotateCcw className="size-4" />
      Clear
    </button>
  </div>
</div>
  {/* Desktop */}
<div className="hidden lg:block">

  <div
    className="
      h-[calc(100vh-320px)]
      min-h-[520px]
      overflow-hidden
    "
  >
    <div
      className="
        h-full
        overflow-y-auto
      "
    >
      <StaffManagementTable
        staff={staff}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
      />
    </div>
  </div>

</div>

{/* Mobile */}

<div className="lg:hidden">
  <StaffMobileList
    staff={staff}
    onEdit={onEdit}
    onToggleStatus={onToggleStatus}
  />
</div>

</section>
);
}