import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import GetRoutes from "./Get.routes";
import PostRoutes from "./Post.routes";
import loggerMiddleware from "../middlewares/LoggerMiddleware";

/**
 * Classe que encapsula a configuração das rotas e middleware para o aplicativo Express.
 * Utiliza o middleware CORS, manipulação de erros e rotas definidas nos módulos GetRoutes e PostRoutes
 * @class
 * @name Router
 */
class Router {
  private readonly app: Express;

  /**
   * Cria uma instância da classe ApiRoutes.
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

    this.app.use(loggerMiddleware);
  }

  /**
   * Configura as rotas do aplicativo, incluindo as rotas definidas nos módulos GetRoutes e PostRoutes.
   * @private
   * @function
   * @name Router.configureRoutes
   */
  private configureRoutes() {
    // Instancia os módulos de rotas
    const getRoutes = new GetRoutes();
    const postRoutes = new PostRoutes();

    // Configuração de rotas
    this.app.use(getRoutes.getRouter());
    this.app.use(postRoutes.getRouter());
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

export default Router;
