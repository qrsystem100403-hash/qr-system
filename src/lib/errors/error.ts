import { AppError } from "./app-error";
import { ERROR_CODES } from "./error.codes";

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, ERROR_CODES.VALIDATION_ERROR, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, ERROR_CODES.UNAUTHORIZED, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, ERROR_CODES.FORBIDDEN, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, ERROR_CODES.NOT_FOUND, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, ERROR_CODES.CONFLICT, 409);
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed", details?: unknown) {
    super(message, ERROR_CODES.DATABASE_ERROR, 500, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, ERROR_CODES.RATE_LIMITED, 429);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error", details?: unknown) {
    super(message, ERROR_CODES.INTERNAL_SERVER_ERROR, 500, details);
  }
}