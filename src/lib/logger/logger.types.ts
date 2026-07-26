export type LogLevel =
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "audit";

export interface LogContext {
  restaurantId?: string;
  userId?: string;
  module?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface LogPayload {
  message: string;
  context?: LogContext;
  error?: unknown;
}

export interface Logger {
  debug(payload: LogPayload): void;
  info(payload: LogPayload): void;
  warn(payload: LogPayload): void;
  error(payload: LogPayload): void;
  audit(payload: LogPayload): void;
}