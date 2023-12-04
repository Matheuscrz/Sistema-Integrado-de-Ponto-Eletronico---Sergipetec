import { Request, Response, NextFunction } from "express";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

class RedirectMiddleware {
  static redirectToHttps(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // Verifica se a solicitação é para um arquivo estático
    const isStaticFile = path.extname(req.url).length > 0;
    if (isStaticFile) {
      return next();
    }

    // Verifica se deve redirecionar para HTTPS
    if (process.env.USE_HTTPS === "true" && !req.secure) {
      const httpsUrl = `https://${req.hostname}:${process.env.HTTPS_PORT_WEB}${req.url}`;
      return res.redirect(301, httpsUrl);
    }

    // Se não for uma solicitação para arquivo estático e não precisar redirecionar, continue
    next();
  }
}

export default RedirectMiddleware;
