import * as winston from "winston";
import { Request } from "express";
import { format as formatDate } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    const logInfo = {
      level,
      message,
      timestamp: formatTimestamp(timestamp),
      method: meta.method,
      url: meta.url,
      user: meta.user,
    };

    return JSON.stringify(logInfo);
  }
);

// Função para formatar o timestamp para o fuso horário brasileiro
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const timeZone = "America/Sao_Paulo";
  const formattedDate = utcToZonedTime(date, timeZone);
  return formatDate(formattedDate, "yyyy-MM-dd HH:mm:ssXXX", {
    timeZone: timeZone,
  } as any);
  // O uso de 'as any' aqui é uma solução temporária para contornar o erro de tipo.
};

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
      logInfo.method = req.method;
      logInfo.url = req.originalUrl;
      logInfo.user = req.user;
    }

    AppLogger.instance.log(logInfo);
  }
}

export default AppLogger;
