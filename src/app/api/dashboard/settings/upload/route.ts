import { v2 as cloudinary } from "cloudinary";

import {
  badRequest,
  fail,
  forbidden,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";
import { requireRestaurantUser } from "@/lib/requireRestaurantUser";

const ALLOWED_ROLES = [
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
  2 * 1024 * 1024;

function canManageRestaurant(
  role: string,
) {
  return ALLOWED_ROLES.includes(
    role as (typeof ALLOWED_ROLES)[number],
  );
}

function configureCloudinary() {
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
    configureCloudinary();

    const {
      restaurant,
      restaurantUser,
      role,
    } =
      await requireRestaurantUser();

    if (
      !canManageRestaurant(role)
    ) {
      logger.warn({
        message:
          "Unauthorized restaurant logo upload attempt",
        context: {
          module: "settings",
          action:
            "uploadRestaurantLogo",
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
      return badRequest(
        "Logo image is required.",
      );
    }

    if (
      !ALLOWED_IMAGE_TYPES.has(
        file.type,
      )
    ) {
      return badRequest(
        "Only JPG, PNG, WEBP or AVIF images are allowed.",
      );
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      return badRequest(
        "Logo must be less than 2MB.",
      );
    }

    const arrayBuffer =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    const result =
      await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `restaurants/${restaurant.id}/branding`,
              public_id: "logo",
              overwrite: true,
              invalidate: true,
              resource_type:
                "image",
              transformation: [
                {
                  width: 512,
                  height: 512,
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
                      "Cloudinary upload failed.",
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
        "Restaurant logo uploaded",
      context: {
        module: "settings",
        action:
          "uploadRestaurantLogo",
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

    return ok({
      url: result.secure_url,
      publicId:
        result.public_id,
    });
  } catch (error) {
    logger.error({
      message:
        "Failed to upload restaurant logo",
      error,
      context: {
        module: "settings",
        action:
          "uploadRestaurantLogo",
      },
    });

    return fail(error);
  }
}