import { supabaseAdmin } from "@/lib/supabase/admin";
import { StaffRepository } from "../repositories/staff.repository";
import type {
  CreateStaffInput,
  UpdateStaffInput,
} from "../schemas";

export class StaffService {
  private repository =
    new StaffRepository();

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
  const {
    staff: memberships,
    total,
  } = await this.repository.getRestaurantStaff({
    restaurantId,
    page,
    limit,
    search,
    role,
    status,
    sort,
  });

  const profiles =
    await this.repository.getProfiles(
      memberships.map(
        (member) => member.user_id,
      ),
    );

  const staff = memberships.map(
    (member) => ({
      ...member,
      profile:
        profiles.find(
          (profile) =>
            profile.id === member.user_id,
        ) ?? null,
    }),
  );

  return {
    staff,
    total,
    page,
    limit,
    totalPages: Math.max(
      1,
      Math.ceil(total / limit),
    ),
  };
}

  async createStaff(
    restaurantId: string,
    createdBy: string,
    input: CreateStaffInput,
  ) {
    const authResult =
      await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          full_name: input.full_name,
        },
      });

    if (authResult.error) {
  if (
    authResult.error.message
      .toLowerCase()
      .includes("already been registered")
  ) {
    throw new Error("email_exists");
  }

  throw authResult.error;
}

    const authUser = authResult.data.user;

    if (!authUser) {
      throw new Error("Failed to create auth user.");
    }

    const { error: profileError } =
      await supabaseAdmin
  .from("users")
  .insert({
    id: authUser.id,
    restaurant_id: restaurantId,
    full_name: input.full_name,
    email: input.email,
    phone: input.phone || null,
    role: input.role,
  });

    if (profileError) {
  await supabaseAdmin.auth.admin.deleteUser(authUser.id);

  if (
    profileError.code === "23505" &&
    profileError.message.toLowerCase().includes("phone")
  ) {
    throw new Error("phone_exists");
  }

  throw profileError;
}

const employeeId =
  await this.repository.getNextEmployeeId(
    restaurantId,
  );

    const { error: membershipError } =
  await supabaseAdmin
    .from("restaurant_users")
    .insert({
      restaurant_id: restaurantId,

      user_id: authUser.id,

      employee_id: employeeId,

      role: input.role,

      employment_status:
        input.employment_status,

      joined_at:
        input.joined_at ??
        new Date()
          .toISOString()
          .slice(0, 10),

      shift_mode:
        input.shift_mode,

      created_by: createdBy,

      attendance_shift_start:
        input.attendance_shift_start,

      attendance_shift_end:
        input.attendance_shift_end,
    });

    if (membershipError) {
      await supabaseAdmin
        .from("users")
        .delete()
        .eq("id", authUser.id);

      await supabaseAdmin.auth.admin.deleteUser(
        authUser.id,
      );

      throw membershipError;
    }

    return authUser;
  }

  async updateStaff(
  userId: string,
  input: UpdateStaffInput,
) {
  await this.repository.updateStaff(
  userId,
  {
    full_name: input.full_name,
    phone: input.phone || null,
    role: input.role,

    employment_status:
  input.employment_status ?? "active",

shift_mode:
  input.shift_mode ?? "custom",

    joined_at:
      input.joined_at ??
      new Date()
        .toISOString()
        .slice(0, 10),


    attendance_shift_start:
      input.attendance_shift_start,

    attendance_shift_end:
      input.attendance_shift_end,
  },
);
}

  async deleteStaff(userId: string) {
  await this.repository.deleteStaff(userId);

  const { error: profileError } =
    await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId);

  if (profileError) {
    throw profileError;
  }

  const { error: authError } =
    await supabaseAdmin.auth.admin.deleteUser(
      userId,
    );

  if (authError) {
    throw authError;
  }
}

async updateEmploymentStatus(
  userId: string,
  status: "active" | "on_leave" | "terminated",
) {
  await this.repository.updateEmploymentStatus(
    userId,
    status,
  );
}
}



export const staffService =
  new StaffService();