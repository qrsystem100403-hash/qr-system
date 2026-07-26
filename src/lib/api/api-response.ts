import { NextResponse } from "next/server";

import { AppError } from "@/lib/errors";

type SuccessResponse<T> = {
  success: true;
  data?: T;
  message?: string;
};

type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function success<T>(
  status: number,
  data?: T,
  message?: string,
) {
  const body: SuccessResponse<T> = {
    success: true,
    data,
    message,
  };

  return NextResponse.json(body, {
    status,
  });
}

function error(
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  const body: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };

  return NextResponse.json(body, {
    status,
  });
}

export function ok<T>(
  data?: T,
  message = "Success",
) {
  return success(200, data, message);
}

export function created<T>(
  data?: T,
  message = "Created successfully",
) {
  return success(201, data, message);
}

export function noContent() {
  return new NextResponse(null, {
    status: 204,
  });
}

export function badRequest(
  message = "Bad request",
  details?: unknown,
) {
  return error(
    400,
    "BAD_REQUEST",
    message,
    details,
  );
}

export function unauthorized(
  message = "Unauthorized",
) {
  return error(
    401,
    "UNAUTHORIZED",
    message,
  );
}

export function forbidden(
  message = "Forbidden",
) {
  return error(
    403,
    "FORBIDDEN",
    message,
  );
}

export function notFound(
  message = "Resource not found",
) {
  return error(
    404,
    "NOT_FOUND",
    message,
  );
}

export function conflict(
  message = "Conflict",
  details?: unknown,
) {
  return error(
    409,
    "CONFLICT",
    message,
    details,
  );
}

export function internalServerError(
  message = "Internal server error",
  details?: unknown,
) {
  return error(
    500,
    "INTERNAL_SERVER_ERROR",
    message,
    details,
  );
}

export function fail(error: unknown) {
  if (error instanceof AppError) {
    return errorResponse(error);
  }

  return internalServerError();
}

function errorResponse(error: AppError) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    },
    {
      status: error.status,
    },
  );
}