import * as http from "http";
import * as https from "https";
import { Express } from "express";
import { readFileSync } from "fs";
import path from "path";
import ApiRoutes from "../router/api/Api.routes";
import * as dotenv from "dotenv";

dotenv.config();
/**
 * Classe que representa o servidor da API, com suporte opcional para HTTPS.
 * @class
 * @name ServerApi
 */
class ServerApi {
  private readonly HTTP_PORT: number;
  private readonly HTTPS_PORT: number;
  private readonly app: Express;
  private httpServer: http.Server;
  private httpsServer: https.Server | null;

  /**
   * Construtor da classe ServerApi.
   * Configura as portas do servidor HTTP e HTTPS, inicializa a aplicação Express e cria o servidor HTTP.
   * Configura o servidor HTTPS se a variável de ambiente USE_HTTPS estiver definida como "true".
   * @constructor
   */
  constructor() {
    // Configura a porta do servidor HTTP
    this.HTTP_PORT = process.env.HTTP_PORT_API
      ? parseInt(process.env.HTTP_PORT_API)
      : 3001;

    // Configura a porta do servidor HTTPS
    this.HTTPS_PORT = process.env.HTTPS_PORT_API
      ? parseInt(process.env.HTTPS_PORT_API)
      : 3444;

    // Inicializa a aplicação Express utilizando as rotas da classe ApiRoutes
    this.app = new ApiRoutes().getExpressApp();
    // Adiciona o middleware de redirecionamento

    // this.app.use(RedirectMiddleware.redirectToHttps);

    // Cria o servidor HTTP utilizando a aplicação Express
    this.httpServer = http.createServer(this.app);
    // Inicializa a propriedade httpsServer como nula
    this.httpsServer = null;

    // Configura o servidor HTTPS se USE_HTTPS estiver definido como "true"
    if (process.env.USE_HTTPS === "true") {
      this.setupHttpsServer();
    }
  }

  /**
   * Configura o servidor HTTPS com base nas variáveis de ambiente HTTPS_PRIVATE_KEY_PATH_API e HTTPS_CERTIFICATE_PATH_API.
   * O servidor HTTPS só será configurado se ambas as variáveis estiverem definidas.
   * @private
   */
  private setupHttpsServer(): void {
    const privateKeyPath = process.env.HTTPS_PRIVATE_KEY_PATH_API;
    const certificatePath = process.env.HTTPS_CERTIFICATE_PATH_API;

    if (privateKeyPath && certificatePath) {
      // Lê o conteúdo dos arquivos de chave privada e certificado
      const privateKey = readFileSync(path.resolve(privateKeyPath), "utf8");
      const certificate = readFileSync(path.resolve(certificatePath), "utf8");
      // Cria as credenciais para o servidor HTTPS
      const credentials = { key: privateKey, cert: certificate };
      // Cria o servidor HTTPS utilizando as credenciais e a aplicação Express
      this.httpsServer = https.createServer(credentials, this.app);
    } else {
      console.log(
        "Certificado HTTPS não configurado. O servidor HTTPS não será iniciado."
      );
    }
  }

  /**
   * Inicia o servidor da API HTTP.
   * Exibe mensagens no console indicando que o servidor está escutando nas portas HTTP e, se configurado, HTTPS.
   * @public
   */
  start() {
    // Inicia o servidor HTTP na porta configurada
    this.httpServer.listen(this.HTTP_PORT, () => {
      console.log(`Servidor de API está escutando na porta ${this.HTTP_PORT}`);
      // Inicia o servidor HTTPS se estiver configurado
      if (this.httpsServer) {
        this.startHttpsServer();
      }
    });
  }

  /**
   * Inicia o servidor da API HTTPS se configurado.
   * Exibe mensagens no console indicando que o servidor HTTPS está escutando na porta configurada.
   * @private
   */
  private startHttpsServer(): void {
    if (this.httpsServer) {
      // Inicia o servidor HTTPS na porta configurada
      this.httpsServer.listen(this.HTTPS_PORT, () => {
        console.log(
          `Servidor de API HTTPS está escutando na porta ${this.HTTPS_PORT}`
        );
      });
    } else {
      console.log("Servidor HTTPS não iniciado devido à falta de certificado.");
    }
  }
}

export default ServerApi;
