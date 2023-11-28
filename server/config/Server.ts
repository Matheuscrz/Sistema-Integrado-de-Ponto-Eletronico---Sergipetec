import ServerApi from "./ServerApi";
import ServerWeb from "./ServerWeb";

/**
 * Classe que representa o servidor, composta por componentes ServerApi e ServerWeb.
 * @class
 * @name Server
 */
class Server {
  // Declaração de membros privados e somente leitura para as instâncias de ServerApi e ServerWeb
  private readonly serverApi: ServerApi;
  private readonly serverWeb: ServerWeb;

  /**
   * Construtor da classe Server.
   * Inicializa instâncias de ServerApi e ServerWeb.
   * @constructor
   */
  constructor() {
    // Inicializa uma instância de ServerApi e atribui à propriedade serverApi
    this.serverApi = new ServerApi();
    // Inicializa uma instância de ServerWeb e atribui à propriedade serverWeb
    this.serverWeb = new ServerWeb();
  }

  /**
   * Inicia o servidor, ativando os componentes ServerWeb e ServerApi.
   * @function
   * @name Server.start
   */
  start() {
    // Chama o método start() da instância serverWeb
    this.serverWeb.start();
    // Chama o método start() da instância serverApi
    this.serverApi.start();
  }
}

export default Server;
