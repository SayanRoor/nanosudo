/**
 * Production-safe logger utility
 * Logs errors only in development mode
 * In production, errors should be sent to error tracking service (e.g., Sentry)
 */

type LogLevel = "error" | "warn" | "info" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.isDevelopment) {
      // In production, send to error tracking service
      // TODO: Integrate with Sentry or similar service
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case "error":
         
        console.error(prefix, message, context ?? "");
        break;
      case "warn":
         
        console.warn(prefix, message, context ?? "");
        break;
      case "info":
        // eslint-disable-next-line no-console
        console.info(prefix, message, context ?? "");
        break;
      case "debug":
        // eslint-disable-next-line no-console
        console.debug(prefix, message, context ?? "");
        break;
    }
  }

  error(message: string, context?: LogContext): void {
    this.log("error", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }
}

export const logger = new Logger();
