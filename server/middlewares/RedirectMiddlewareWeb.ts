import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

dotenv.config();
class RedirectMiddleware {
  static redirectToHttps(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // Verifica se a solicitação é para o favicon.ico
    if (req.url === "/favicon.ico") {
      console.log(
        "Solicitação para favicon.ico. Não é necessário redirecionar."
      );
      return next();
    }

    if (process.env.USE_HTTPS === "true" && !req.secure) {
      const httpsUrl = `https://${req.hostname}:${process.env.HTTPS_PORT_WEB}${req.url}`;
      return res.redirect(301, httpsUrl);
    }
    next();
  }
}
export default RedirectMiddleware;
