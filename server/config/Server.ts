import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { Express } from "express";
import Router from "../router/api/Api.routes";
import ServerWeb from "./ServerWeb";

dotenv.config();
/**
 * Classe que encapsula a configuração e inicialização do servidor Express.
 * Utiliza as rotas definidas no Router.
 * @class
 * @name Server
 */
class Server {
  private readonly HTTP_PORT: number;
  private readonly HTTPS_PORT: number;
  private readonly app: Express;
  private httpServer: http.Server;
  private httpsServer: https.Server | null;
  /**
   * Cria uma instância da classe Server.
   * Configura a porta do servidor lendo do ambiente ou usando 3001 como padrão.
   * Inicializa o aplicativo Express utilizando as rotas definidas no Router.
   * @constructor
   * @returns {void} Sem retorno.
   */
  constructor(private readonly serverWeb: ServerWeb) {
    // Define a porta do servidor, lendo do ambiente ou usando 3001 como padrão
    this.HTTP_PORT = process.env.HTTP_PORT
      ? parseInt(process.env.HTTP_PORT)
      : 3001;
    // Define a porta do servidor HTTPS, lendo do ambiente ou usando 3443 como padrão
    this.HTTPS_PORT = process.env.HTTPS_PORT
      ? parseInt(process.env.HTTPS_PORT)
      : 3443;
    // Inicializa o aplicativo Express utilizando as rotas definidas no Router
    this.app = new Router().getExpressApp();
    this.httpServer = http.createServer(this.app);
    this.httpsServer = null;
  }
  /**
   * Configura o servidor HTTPS se o certificado estiver disponível.
   * @function
   * @name Server.setupHttpsServer
   * @returns {void}
   */
  private setupHttpsServer(): void {
    const privateKeyPath = process.env.HTTPS_PRIVATE_KEY_PATH;
    const certificatePath = process.env.HTTPS_CERTIFICATE_PATH;

    if (privateKeyPath && certificatePath) {
      const privateKey = fs.readFileSync(path.resolve(privateKeyPath), "utf8");
      const certificate = fs.readFileSync(
        path.resolve(certificatePath),
        "utf8"
      );
      const credentials = { key: privateKey, cert: certificate };
      // Cria uma instância do servidor HTTPS
      this.httpsServer = https.createServer(credentials, this.app);
    } else {
      console.log(
        "Certificado HTTPS não configurado. O servidor HTTPS não será iniciado."
      );
    }
  }
  /**
   * Inicia o servidor Express.
   * @function
   * @name Server.start
   * @returns {void}
   */
  start() {
    // Inicia o servidor HTTP
    this.httpServer.listen(this.HTTP_PORT, () => {
      console.log(`Servidor de API está escutando na porta ${this.HTTP_PORT}`);
      // Verifica se o certificado HTTPS está configurado e inicia o servidor HTTPS
      if (!this.httpsServer) {
        this.setupHttpsServer();
        this.startHttpsServer();
      }
    });
    this.serverWeb.start();
  }
  /**
   * Inicia o servidor HTTPS se estiver configurado.
   * @function
   * @name Server.startHttpsServer
   * @returns {void}
   */
  private startHttpsServer(): void {
    if (this.httpsServer) {
      this.httpsServer.listen(this.HTTPS_PORT, () => {
        console.log(`Servidor HTTPS escutando na porta ${this.HTTPS_PORT}`);
      });
    }
  }
}
export default Server;
