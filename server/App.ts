import Server from "./config/Server";

/**
 * Classe principal que inicia o servidor.
 * Utiliza a classe Server para criar e iniciar o servidor.
 * @class
 * @name App
 */
export class App {
  private readonly server: Server;

  /**
   * Cria uma instância da classe App.
   * Inicializa a instância da classe Server.
   * @constructor
   */
  constructor() {
    this.server = new Server();
  }

  /**
   * Inicia o servidor utilizando o método start da instância da classe Server.
   * Exibe uma mensagem no console indicando que o servidor está rodando na porta especificada.
   * @function
   * @name App.startServer
   */
  startServer() {
    console.log("Iniciando o servidor...");
    this.server.start();
  }
}

const app = new App();
app.startServer();
