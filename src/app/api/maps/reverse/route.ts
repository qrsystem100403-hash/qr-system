import { NextRequest } from "next/server";

import {
  badRequest,
  fail,
  ok,
} from "@/lib/api";
import { logger } from "@/lib/logger";

export async function GET(
  request: NextRequest,
) {
  const lat =
    request.nextUrl.searchParams.get(
      "lat",
    );

  const lon =
    request.nextUrl.searchParams.get(
      "lon",
    );

  if (!lat || !lon) {
    return badRequest(
      "Missing coordinates.",
    );
  }

  try {
    const response =
      await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
        {
          headers: {
            "User-Agent":
              "QR Ordering Engine Restaurant SaaS",
            Accept:
              "application/json",
          },
        },
      );

    if (!response.ok) {
      logger.error({
        message:
          "Reverse geocoding request failed",
        context: {
          module:
            "geocoding",
          action:
            "reverseLookup",
          metadata: {
            latitude: lat,
            longitude: lon,
            status:
              response.status,
          },
        },
      });

      return fail(
        new Error(
          "Reverse geocoding service failed.",
        ),
      );
    }

    const data =
      await response.json();

    logger.info({
      message:
        "Reverse geocoding completed",
      context: {
        module:
          "geocoding",
        action:
          "reverseLookup",
        metadata: {
          latitude: lat,
          longitude: lon,
        },
      },
    });

    return ok(data);
  } catch (error) {
    logger.error({
      message:
        "Unexpected reverse geocoding error",
      error,
      context: {
        module:
          "geocoding",
        action:
          "reverseLookup",
        metadata: {
          latitude: lat,
          longitude: lon,
        },
      },
    });

    return fail(error);
  }
}