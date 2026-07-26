import { NextResponse } from "next/server";

import {
  InvalidSessionError,
  SessionExpiredError,
  SessionNotFoundError,
} from "./session.errors";

export function handleSessionError(error: unknown) {
  if (error instanceof SessionExpiredError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 403,
      }
    );
  }

  if (error instanceof SessionNotFoundError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 404,
      }
    );
  }

  if (error instanceof InvalidSessionError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }

  throw error;
}