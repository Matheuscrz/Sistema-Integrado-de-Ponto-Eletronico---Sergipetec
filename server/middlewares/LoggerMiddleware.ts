import { Request, Response, NextFunction } from "express";
import AppLogger from "../config/AppLogger";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const logger = AppLogger.getInstance();
    logger.info(
      `Solicitação ${req.method} recebida para ${req.originalUrl}`,
      req
    );
    next();
  } catch (error) {
    console.error("Ocorreu um erro ao executar ação", error);
  }
};

export default loggerMiddleware;
