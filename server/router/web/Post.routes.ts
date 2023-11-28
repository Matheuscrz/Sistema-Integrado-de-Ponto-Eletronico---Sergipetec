import express, { Router, Request, Response } from "express";
import authenticate from "../../auth/authenticate";
import verifyToken from "../../auth/verifyToken";
import path from "path";

class PostRoutes {
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
   * @name PostRoutes.configureRoutes
   */
  private configureRoutes() {
    this.router.post("/Login", authenticate.authenticateUser);

  }
  /**
   * Retorna o roteador configurado com as rotas definidas.
   * @function
   * @name PostRoutes.getRouter
   * @returns {Router} O roteador configurado com as rotas definidas.
   */
  getRouter() {
    return this.router;
  }
}
export default PostRoutes;
