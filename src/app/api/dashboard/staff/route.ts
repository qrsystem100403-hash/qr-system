// src/app/api/dashboard/staff/route.ts

import {
  badRequest,
  conflict,
  created,
  fail,
  ok
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireOwnerUser } from "@/lib/requireRestaurantUser";
import { staffService } from "@/modules/staff/services/staff.service";
import {
  createStaffSchema,
  updateStaffSchema,
} from "@/modules/staff/schemas";

export async function GET(request: Request) {
  try {
    const { restaurant } =
      await requireOwnerUser();

    const { searchParams } = new URL(
      request.url,
    );

    const page = Number(
      searchParams.get("page") ?? "1",
    );

    const limit = Number(
      searchParams.get("limit") ?? "10",
    );

    const search =
      searchParams.get("search") ?? "";

    const role =
      searchParams.get("role") ?? "all";

    const status =
      searchParams.get("status") ?? "all";

    const sort =
      searchParams.get("sort") ??
      "newest";

    const result =
      await staffService.getRestaurantStaff({
        restaurantId: restaurant.id,
        page,
        limit,
        search,
        role,
        status,
        sort,
      });

    return ok({
      staff: result.staff,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    logger.error({
      message:
        "Failed to load restaurant staff",
      error,
      context: {
        module: "staff",
        action: "getRestaurantStaff",
      },
    });

    return fail(error);
  }
}

export async function POST(
  request: Request,
) {
  try {
    const {
      restaurant,
      user,
    } = await requireOwnerUser();

    const body =
      await request.json();

    const parsed =
      createStaffSchema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Staff validation failed",
        context: {
          module: "staff",
          action: "createStaff",
          restaurantId: restaurant.id,
          userId: user.id,
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid staff details.",
        parsed.error.flatten(),
      );
    }

    await staffService.createStaff(
      restaurant.id,
      user.id,
      parsed.data,
    );

    logger.audit({
      message: "Staff created",
      context: {
        module: "staff",
        action: "createStaff",
        restaurantId: restaurant.id,
        userId: user.id,
      },
    });

    return created(
      undefined,
      "Staff created successfully.",
    );
  } catch (error: any) {
    logger.error({
      message:
        "Failed to create staff",
      error,
      context: {
        module: "staff",
        action: "createStaff",
      },
    });

    if (error?.message === "email_exists") {
      return conflict(
        "Email is already registered.",
        {
          field: "email",
        },
      );
    }

    if (error?.message === "phone_exists") {
      return conflict(
        "Phone number already exists.",
        {
          field: "phone",
        },
      );
    }

    return fail(error);
  }
}

export async function PATCH(
  request: Request,
) {
  try {
    await requireOwnerUser();

    const body = await request.json();

    const { userId, ...payload } = body;

    const parsed =
      updateStaffSchema.safeParse(payload);

    if (!parsed.success) {
      logger.warn({
        message:
          "Staff update validation failed",
        context: {
          module: "staff",
          action: "updateStaff",
          metadata: {
            userId,
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid staff details.",
        parsed.error.flatten(),
      );
    }

    await staffService.updateStaff(
      userId,
      parsed.data,
    );

    logger.audit({
      message: "Staff updated",
      context: {
        module: "staff",
        action: "updateStaff",
        metadata: {
          userId,
        },
      },
    });

    return ok(
      undefined,
      "Staff updated successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Failed to update staff",
      error,
      context: {
        module: "staff",
        action: "updateStaff",
      },
    });

    return fail(error);
  }
}

export async function DELETE(
  request: Request,
) {
  try {
    await requireOwnerUser();

    const { userId } =
      await request.json();

    await staffService.deleteStaff(
      userId,
    );

    logger.audit({
      message: "Staff deleted",
      context: {
        module: "staff",
        action: "deleteStaff",
        metadata: {
          userId,
        },
      },
    });

    return ok(
      undefined,
      "Staff deleted successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Failed to delete staff",
      error,
      context: {
        module: "staff",
        action: "deleteStaff",
      },
    });

    return fail(error);
  }
}



export async function PUT(
  request: Request,
) {
  try {
    await requireOwnerUser();

    const body = await request.json();

    const {
      userId,
      employment_status,
    }: {
      userId: string;
      employment_status:
        | "active"
        | "on_leave"
        | "terminated";
    } = body;

    if (
      ![
        "active",
        "on_leave",
        "terminated",
      ].includes(employment_status)
    ) {
      logger.warn({
        message:
          "Invalid employment status",
        context: {
          module: "staff",
          action: "updateEmploymentStatus",
          metadata: {
            userId,
            employment_status,
          },
        },
      });

      return badRequest(
        "Invalid employment status.",
      );
    }

    await staffService.updateEmploymentStatus(
      userId,
      employment_status,
    );

    logger.audit({
      message:
        "Employment status updated",
      context: {
        module: "staff",
        action: "updateEmploymentStatus",
        metadata: {
          userId,
          employment_status,
        },
      },
    });

    const message =
      employment_status === "active"
        ? "Employee activated successfully."
        : employment_status ===
            "on_leave"
        ? "Employee marked as on leave."
        : "Employee terminated successfully.";

    return ok(undefined, message);
  } catch (error) {
    logger.error({
      message:
        "Failed to update employment status",
      error,
      context: {
        module: "staff",
        action:
          "updateEmploymentStatus",
      },
    });

    return fail(error);
  }
}