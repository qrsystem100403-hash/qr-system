import type {
  Logger,
  LogLevel,
  LogPayload,
} from "./logger.types";

function writeLog(
  level: LogLevel,
  payload: LogPayload,
) {
  const log = {
    timestamp: new Date().toISOString(),
    level,
    message: payload.message,
    context: payload.context,
    error:
      payload.error instanceof Error
        ? {
            name: payload.error.name,
            message: payload.error.message,
            stack: payload.error.stack,
          }
        : payload.error,
  };

  switch (level) {
    case "debug":
      if (process.env.NODE_ENV !== "production") {
        console.debug(log);
      }
      break;

    case "info":
      console.info(log);
      break;

    case "warn":
      console.warn(log);
      break;

    case "error":
      console.error(log);
      break;

    case "audit":
      console.info(log);
      break;
  }
}

export const logger: Logger = {
  debug(payload) {
    writeLog("debug", payload);
  },

  info(payload) {
    writeLog("info", payload);
  },

  warn(payload) {
    writeLog("warn", payload);
  },

  error(payload) {
    writeLog("error", payload);
  },

  audit(payload) {
    writeLog("audit", payload);
  },
};