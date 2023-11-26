import express, { Router } from "express";
import GetRoutes from "./Get.routes";
import PostRoutes from "./Post.routes";

/**
 * Classe que define rotas específicas para operações GET e POST no contexto mobile.
 * Utiliza as classes GetRoutes e PostRoutes para configurar as rotas correspondentes.
 * @class
 * @name MobileRoutes
 */
class MobileRoutes {
  private readonly router: Router;

  /**
   * Cria uma instância da classe MobileRoutes.
   * Configura as rotas específicas para operações GET e POST utilizando as classes GetRoutes e PostRoutes.
   * @constructor
   */
  constructor() {
    this.router = express.Router();
    this.configureRoutes();
  }

  /**
   * Configura as rotas específicas para operações GET e POST utilizando as classes GetRoutes e PostRoutes.
   * @private
   * @function
   * @name MobileRoutes.configureRoutes
   */
  private configureRoutes() {
    const getRoutes = new GetRoutes();
    const postRoutes = new PostRoutes();

    // Adiciona as rotas GET e POST ao roteador mobile
    this.router.use("/get", getRoutes.getRouter());
    this.router.use("/post", postRoutes.getRouter());
  }

  /**
   * Retorna o roteador configurado com as rotas definidas para operações GET e POST.
   * @function
   * @name MobileRoutes.getRouter
   * @returns {Router} O roteador configurado com as rotas definidas para operações GET e POST.
   */
  getRouter() {
    return this.router;
  }
}

// Exporta a classe MobileRoutes
export default MobileRoutes;
