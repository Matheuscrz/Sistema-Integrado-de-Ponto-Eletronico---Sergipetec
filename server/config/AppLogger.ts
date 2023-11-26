import * as winston from "winston";
import { Request } from "express";

// Define um formato personalizado para o log
const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    const logInfo = {
      level,
      message,
      timestamp,
      method: meta.method,
      url: meta.url,
      ip: meta.host,
      user: meta.user,
    };

    return JSON.stringify(logInfo);
  }
);

class AppLogger {
  private static instance: winston.Logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp(), logFormat),
    transports: [
      new winston.transports.File({
        filename: "./log/app.log",
        maxsize: 10 * 1024 * 1024,
        maxFiles: 5,
      }),
    ],
  });

  private constructor() {}

  public static getInstance(): winston.Logger {
    return AppLogger.instance;
  }

  public info(message: string, req?: Request): void {
    this.log("info", message, req);
  }

  public warn(message: string, req?: Request): void {
    this.log("warn", message, req);
  }

  public error(message: string, req?: Request): void {
    this.log("error", message, req);
  }

  public debug(message: string, req?: Request): void {
    this.log("debug", message, req);
  }

  private log(level: string, message: string, req?: Request): void {
    const logInfo: any = {
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    if (req) {
      logInfo.ip = req.host;
      logInfo.method = req.method;
      logInfo.url = req.originalUrl;
      logInfo.user = req.user;
    }

    AppLogger.instance.log(logInfo);
  }
}

export default AppLogger;
