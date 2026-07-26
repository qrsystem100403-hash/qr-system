import { supabaseAdmin } from "@/lib/supabase/admin";

export class StaffRepository {
  async getRestaurantStaff({
  restaurantId,
  page,
  limit,
  search,
  role,
  status,
  sort,
}: {
  restaurantId: string;
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
  sort?: string;
}) {
  let query = supabaseAdmin
    .from("restaurant_users")
    .select(
      `
      id,
      restaurant_id,
      user_id,
      role,
      employee_id,
      employment_status,
      joined_at,
      shift_mode,
      attendance_shift_start,
      attendance_shift_end,
      created_at,
      created_by
      `,
      {
        count: "exact",
      },
    )
    .eq("restaurant_id", restaurantId)
    .neq("role", "owner");

  if (role && role !== "all") {
    query = query.eq("role", role);
  }

  if (status && status !== "all") {
    query = query.eq(
      "employment_status",
      status,
    );
  }

  switch (sort) {
    case "oldest":
      query = query.order("created_at", {
        ascending: true,
      });
      break;

    case "role":
      query = query.order("role", {
        ascending: true,
      });
      break;

    case "newest":
    default:
      query = query.order("created_at", {
        ascending: false,
      });
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const {
    data,
    count,
    error,
  } = await query.range(from, to);

  if (error) {
    throw error;
  }

  let memberships = data ?? [];

  if (search?.trim()) {
    const searchText =
      search.trim().toLowerCase();

    const profiles =
      await this.getProfiles(
        memberships.map(
          (member) => member.user_id,
        ),
      );

    memberships = memberships.filter(
      (member) => {
        const profile = profiles.find(
          (p) =>
            p.id === member.user_id,
        );

        return [
          member.employee_id,
          profile?.full_name,
          profile?.email,
          profile?.phone,
        ]
          .filter(Boolean)
          .some((value) =>
            value!
              .toLowerCase()
              .includes(searchText),
          );
      },
    );
  }

  return {
    staff: memberships,
    total: count ?? 0,
  };
}

  async getProfiles(userIds: string[]) {
    if (!userIds.length) return [];

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .in("id", userIds);

    if (error) throw error;

    return data ?? [];
  }

  async getNextEmployeeId(
  restaurantId: string,
) {
  const { data, error } = await supabaseAdmin
    .rpc("get_next_employee_id", {
      restaurant_uuid: restaurantId,
    });

  if (error) throw error;

  return data;
}

  async updateStaff(
  userId: string,
  data: {
  full_name: string;
  phone: string | null;
  role: string;
  employment_status:
  | "active"
  | "on_leave"
  | "terminated";

shift_mode:
  | "custom"
  | "template";
  joined_at: string;
  attendance_shift_start: string;
  attendance_shift_end: string;
},
) {
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      full_name: data.full_name,
      phone: data.phone,
      role: data.role,
    })
    .eq("id", userId);

  if (error) throw error;

  const { error: membershipError } =
    await supabaseAdmin
  .from("restaurant_users")
  .update({
  role: data.role,
  employment_status: data.employment_status,
  joined_at: data.joined_at,
  shift_mode: data.shift_mode,
  attendance_shift_start: data.attendance_shift_start,
  attendance_shift_end: data.attendance_shift_end,
})
  .eq("user_id", userId);

  if (membershipError) throw membershipError;
}

  async deleteStaff(userId: string) {
    const { error } = await supabaseAdmin
      .from("restaurant_users")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  }

  async updateEmploymentStatus(
  userId: string,
  status: "active" | "on_leave" | "terminated",
){
  const { error } = await supabaseAdmin
  .from("restaurant_users")
  .update({
    employment_status: status,
  })
  .eq("user_id", userId);

if (error) throw error;

 
}
}
