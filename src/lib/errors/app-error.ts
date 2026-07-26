import type { ErrorCode } from "./error.codes"

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(
    message: string,
    code: ErrorCode,
    status: number,
    details?: unknown,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.details = details;

    Error.captureStackTrace?.(this, this.constructor);
  }
}