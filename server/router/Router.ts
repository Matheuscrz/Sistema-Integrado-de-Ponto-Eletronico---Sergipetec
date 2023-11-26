import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import Erro from "../middlewares/Erro";
import MobileRoutes from "./Mobile.routes";
import WebRoutes from "./Web.routes";
import loggerMiddleware from "../middlewares/LoggerMiddleware";
import path from "path";
/**
 * Classe que encapsula a configuração das rotas e middleware para o aplicativo Express.
 * Utiliza o middleware CORS, manipulação de erros e rotas definidas nos módulos MobileRoutes e WebRoutes.
 * @class
 * @name Router
 */
class Router {
  private readonly app: Express;

  /**
   * Cria uma instância da classe Router.
   * Configura as rotas e middleware, incluindo CORS e manipulação de erros.
   * @constructor
   */
  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
  }

  /**
   * Configura os middleware do aplicativo, incluindo CORS e manipulação de erros.
   * @private
   * @function
   * @name Router.configureMiddleware
   */
  private configureMiddleware() {
    // Configurações para o middleware CORS
    const corsOptions: CorsOptions = {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Host"],
    };

    // Aplica o middleware CORS
    this.app.use(cors(corsOptions));

    // Habilita o parsing do corpo da requisição como JSON
    this.app.use(express.json());

    // Configuração para servir arquivos estáticos do frontend
    this.app.use(
      express.static(path.join(__dirname, "../../client/Web/build"))
    );

    // Adiciona o middleware de manipulação de erros
    this.app.use(Erro.middleware);
  }

  /**
   * Configura as rotas do aplicativo, incluindo as rotas definidas nos módulos MobileRoutes e WebRoutes.
   * @private
   * @function
   * @name Router.configureRoutes
   */
  private configureRoutes() {
    this.app.use(loggerMiddleware);
    // Instancia os módulos de rotas para mobile e web
    const mobileRoutes = new MobileRoutes();
    const webRoutes = new WebRoutes();

    // Aplica as rotas no caminho '/mobile' e '/web', respectivamente
    this.app.use("/mobile", mobileRoutes.getRouter());
    this.app.use("/web", webRoutes.getRouter());
  }

  /**
   * Retorna o aplicativo Express configurado.
   * @function
   * @name Router.getExpressApp
   * @returns {Express} O aplicativo Express configurado.
   */
  getExpressApp() {
    return this.app;
  }
}

// Exporta a classe Router
export default Router;
