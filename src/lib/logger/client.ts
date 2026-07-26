export const clientLogger = {
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.error(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.info(...args);
    }
  },
};