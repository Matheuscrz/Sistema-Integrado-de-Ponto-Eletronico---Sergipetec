import express, { Router } from "express";
import GetRoutes from "./Get.routes";

/**
 * Classe que define rotas específicas para operações GET no contexto web.
 * Utiliza a classe GetRoutes para configurar as rotas correspondentes.
 * @class
 * @name WebRoutes
 */
class WebRoutes {
  private readonly router: Router;

  /**
   * Cria uma instância da classe WebRoutes.
   * Configura as rotas específicas para operações GET utilizando a classe GetRoutes.
   * @constructor
   */
  constructor() {
    this.router = express.Router();
    this.configureRoutes();
  }

  /**
   * Configura as rotas específicas para operações GET utilizando a classe GetRoutes.
   * @private
   * @function
   * @name WebRoutes.configureRoutes
   */
  private configureRoutes() {
    const getRoutes = new GetRoutes();

    // Adiciona as rotas GET ao roteador web
    this.router.use(getRoutes.getRouter());
  }

  /**
   * Retorna o roteador configurado com as rotas definidas para operações GET.
   * @function
   * @name WebRoutes.getRouter
   * @returns {Router} O roteador configurado com as rotas definidas para operações GET.
   */
  getRouter() {
    return this.router;
  }
}

// Exporta a classe WebRoutes
export default WebRoutes;
