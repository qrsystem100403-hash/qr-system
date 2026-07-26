import { v2 as cloudinary } from "cloudinary";

import {
  badRequest,
  created,
  fail,
  forbidden,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

const ALLOWED_MENU_ROLES = [
  "owner",
  "manager",
] as const;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_IMAGE_SIZE =
  3 * 1024 * 1024;

function canManageMenu(role: string) {
  return ALLOWED_MENU_ROLES.includes(
    role as (typeof ALLOWED_MENU_ROLES)[number],
  );
}

function assertCloudinaryEnv() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME;

  const apiKey =
    process.env.CLOUDINARY_API_KEY;

  const apiSecret =
    process.env.CLOUDINARY_API_SECRET;

  if (
    !cloudName ||
    !apiKey ||
    !apiSecret
  ) {
    throw new Error(
      "Missing Cloudinary environment variables",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export async function POST(
  request: Request,
) {
  try {
    assertCloudinaryEnv();

    const {
      restaurant,
      role,
      restaurantUser,
    } =
      await requireRestaurantUser();

    if (!canManageMenu(role)) {
      logger.warn({
        message:
          "Unauthorized menu image upload attempt",
        context: {
          module: "menu",
          action: "uploadMenuImage",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
        },
      });

      return forbidden();
    }

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (
      !file ||
      !(file instanceof File)
    ) {
      logger.warn({
        message:
          "Menu image missing",
        context: {
          module: "menu",
          action: "uploadMenuImage",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
        },
      });

      return badRequest(
        "Image file is required",
      );
    }

    if (
      !ALLOWED_IMAGE_TYPES.has(
        file.type,
      )
    ) {
      logger.warn({
        message:
          "Unsupported menu image type",
        context: {
          module: "menu",
          action: "uploadMenuImage",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
          metadata: {
            type: file.type,
          },
        },
      });

      return badRequest(
        "Only JPG, PNG, WEBP or AVIF images are allowed.",
      );
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      logger.warn({
        message:
          "Menu image exceeds size limit",
        context: {
          module: "menu",
          action: "uploadMenuImage",
          restaurantId:
            restaurant.id,
          userId:
            restaurantUser.id,
          metadata: {
            size: file.size,
          },
        },
      });

      return badRequest(
        "Image must be less than 3MB.",
      );
    }

    const arrayBuffer =
      await file.arrayBuffer();

    const buffer = Buffer.from(
      arrayBuffer,
    );

    const result =
      await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `restaurants/${restaurant.id}/menu`,
              resource_type:
                "image",
              overwrite: false,
              use_filename: false,
              unique_filename: true,
              transformation: [
                {
                  width: 800,
                  height: 800,
                  crop: "limit",
                  quality: "auto",
                  fetch_format:
                    "auto",
                },
              ],
            },
            (
              error,
              result,
            ) => {
              if (
                error ||
                !result
              ) {
                reject(
                  error ??
                    new Error(
                      "Cloudinary upload failed",
                    ),
                );

                return;
              }

              resolve({
                secure_url:
                  result.secure_url,
                public_id:
                  result.public_id,
              });
            },
          )
          .end(buffer);
      });

    logger.audit({
      message:
        "Menu image uploaded",
      context: {
        module: "menu",
        action:
          "uploadMenuImage",
        restaurantId:
          restaurant.id,
        userId:
          restaurantUser.id,
        metadata: {
          publicId:
            result.public_id,
        },
      },
    });

    return created(
      {
        url: result.secure_url,
        publicId:
          result.public_id,
      },
      "Image uploaded successfully.",
    );
  } catch (error) {
    logger.error({
      message:
        "Failed to upload menu image",
      error,
      context: {
        module: "menu",
        action:
          "uploadMenuImage",
      },
    });

    return fail(error);
  }
}