import {
  badRequest,
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireOwnerUser } from "@/lib/requireRestaurantUser";
import { staffService } from "@/modules/staff/services/staff.service";

export async function PATCH(
  request: Request,
) {
  try {
    await requireOwnerUser();

    const { userId, is_active } =
      await request.json();

    if (
      !userId ||
      typeof is_active !== "boolean"
    ) {
      logger.warn({
        message:
          "Invalid staff status update request",
        context: {
          module: "staff",
          action: "updateStaffStatus",
          metadata: {
            userId,
            is_active,
          },
        },
      });

      return badRequest(
        "Invalid request.",
      );
    }

    await staffService.updateEmploymentStatus(
  userId,
  is_active ? "active" : "terminated",
);

    logger.audit({
      message: "Staff status updated",
      context: {
        module: "staff",
        action: "updateStaffStatus",
        metadata: {
          userId,
          is_active,
        },
      },
    });

    return ok(
      undefined,
      is_active
        ? "Staff activated successfully."
        : "Staff deactivated successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Failed to update staff status",
      error,
      context: {
        module: "staff",
        action: "updateStaffStatus",
      },
    });

    return fail(error);
  }
}