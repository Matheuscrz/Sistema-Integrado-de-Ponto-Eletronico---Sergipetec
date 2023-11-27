import express, { Router, Request, Response } from "express";
import path from "path";

class GetRoutes {
  private readonly router: Router;

  /**
   * Cria uma instância da classe GetRoutes.
   * Configura as rotas para paginas web
   * @constructor
   */
  constructor() {
    this.router = express.Router();
    const staticPath = path.join(__dirname, "../../../client/Web");
    this.router.use(express.static(staticPath));
    this.configureRoutes();
  }

  /**
   * Configura as rotas para obter dados do usuário, histórico e download de comprovantes.
   * @private
   * @function
   * @name GetRoutes.configureRoutes
   */
  private configureRoutes() {
    this.router.get("/", (req: Request, res: Response) => {
      const login = path.join(__dirname, "../../../client/Web/index.html");
      res.sendFile(login);
    });
  }

  /**
   * Retorna o roteador configurado com as rotas definidas.
   * @function
   * @name GetRoutes.getRouter
   * @returns {Router} O roteador configurado com as rotas definidas.
   */
  getRouter() {
    return this.router;
  }
}
export default GetRoutes;
