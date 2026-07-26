import { z } from "zod";

import {
  badRequest,
  fail,
  forbidden,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";
import { supabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  workflow_mode: z.enum([
    "simple",
    "advanced",
  ]),
  table_workflow_mode: z.enum([
    "simple",
    "advanced",
    "expert",
  ]),
});

const ALLOWED_ROLES = [
  "owner",
  "manager",
] as const;

function canManageSettings(
  role: string,
) {
  return ALLOWED_ROLES.includes(
    role as (typeof ALLOWED_ROLES)[number],
  );
}

export async function GET() {
  try {
    const {
      restaurant,
      restaurantUser,
    } =
      await requireRestaurantUser();

    logger.info({
      message:
        "Workflow settings loaded",
      context: {
        module: "settings",
        action:
          "getWorkflowSettings",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
      },
    });

    return ok({
      workflow_mode:
        restaurant.workflow_mode,
      table_workflow_mode:
        restaurant.table_workflow_mode,
    });
  } catch (error) {
    logger.error({
      message:
        "Failed to load workflow settings",
      error,
      context: {
        module: "settings",
        action:
          "getWorkflowSettings",
      },
    });

    return fail(error);
  }
}

export async function PATCH(
  request: Request,
) {
  try {
    const {
      restaurant,
      restaurantUser,
      role,
    } =
      await requireRestaurantUser();

    if (
      !canManageSettings(role)
    ) {
      logger.warn({
        message:
          "Unauthorized workflow settings update attempt",
        context: {
          module: "settings",
          action:
            "updateWorkflowSettings",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
        },
      });

      return forbidden();
    }

    const body =
      await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      logger.warn({
        message:
          "Invalid workflow settings payload",
        context: {
          module: "settings",
          action:
            "updateWorkflowSettings",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
          metadata: {
            issues:
              parsed.error.flatten(),
          },
        },
      });

      return badRequest(
        "Invalid settings.",
        parsed.error.flatten(),
      );
    }

    const {
      workflow_mode,
      table_workflow_mode,
    } = parsed.data;

    const { error } =
      await supabaseAdmin
        .from("restaurants")
        .update({
          workflow_mode,
          table_workflow_mode,
        })
        .eq(
          "id",
          restaurant.id,
        );

    if (error) {
      logger.error({
        message:
          "Failed to update workflow settings",
        error,
        context: {
          module: "settings",
          action:
            "updateWorkflowSettings",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
        },
      });

      return fail(error);
    }

    logger.audit({
      message:
        "Workflow settings updated",
      context: {
        module: "settings",
        action:
          "updateWorkflowSettings",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
        metadata: {
          workflow_mode,
          table_workflow_mode,
        },
      },
    });

    return ok(
      undefined,
      "Workflow settings updated successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Unexpected error while updating workflow settings",
      error,
      context: {
        module: "settings",
        action:
          "updateWorkflowSettings",
      },
    });

    return fail(error);
  }
}