import Server from "./config/Server";
import ServerWeb from "./config/ServerWeb";
/**
 * Classe principal que inicia o servidor.
 * Utiliza a classe Server para criar e iniciar o servidor.
 * @class
 * @name App
 */
export class App {
  private readonly server: Server;
  private readonly serverWeb: ServerWeb;
  /**
   * Cria uma instância da classe App.
   * Inicializa a instância da classe Server.
   * @constructor
   */
  constructor() {
    this.serverWeb = new ServerWeb();
    this.server = new Server(this.serverWeb);
  }
  /**
   * Inicia o servidor utilizando o método start da instância da classe Server.
   * Exibe uma mensagem no console indicando que o servidor está rodando na porta especificada.
   * @function
   * @name App.startServer
   */
  startServer() {
    this.server.start();
  }
}
const app = new App();
app.startServer();
