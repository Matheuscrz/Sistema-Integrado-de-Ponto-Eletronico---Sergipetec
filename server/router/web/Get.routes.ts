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
      const index = path.join(__dirname, "../../../client/Web/index.html");
      res.sendFile(index);
    });

    this.router.get("/RecuperarSenha", (req: Request, res: Response) => {
      const recover = path.join(
        __dirname,
        "../../../client/Web/pages/RecuperarSenha.html"
      );
      res.sendFile(recover);
    });

    this.router.get("/Home", (req: Request, res: Response) => {
      const home = path.join(__dirname, "../../../client/Web/pages/Home.html");
      res.sendFile(home);
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
