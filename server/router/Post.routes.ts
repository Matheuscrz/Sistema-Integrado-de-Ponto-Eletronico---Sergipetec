import express, { Request, Response, Router } from "express";
import { UserController } from "../controller/UserController";
import RegisterController from "../controller/RegisterController";
import authenticate from "../auth/authenticate";
import verifyToken from "../auth/verifyToken";
import { Registro } from "../class/Registro";
import ProofController from "../controller/ProofController";
import { Comprovante } from "../class/Comprovante";
import { PDF } from "../class/PDF";

/**
 * Classe que define rotas para autenticação de usuários, registro de pontos e download de comprovantes.
 * Utiliza os controladores Authenticate, VerifyToken, RegisterController, ProofController e UserController.
 * @class
 * @name PostRoutes
 */
class PostRoutes {
  private readonly router: Router;
  /**
   * Cria uma instância da classe PostRoutes.
   * Configura as rotas para autenticação de usuários, registro de pontos e download de comprovantes.
   * Utiliza os controladores Authenticate, VerifyToken, RegisterController, ProofController e UserController.
   * @constructor
   */
  constructor() {
    this.router = express.Router();
    this.configureRoutes();
  }
  /**
   * Configura as rotas para autenticação de usuários, registro de pontos e download de comprovantes.
   * @private
   * @function
   * @name PostRoutes.configureRoutes
   */
  private configureRoutes() {
    // Rota para autenticar um usuário
    this.router.post("/login", authenticate.authenticateUser);

    // Rota para registrar um ponto
    this.router.post(
      "/registrar-ponto",
      verifyToken, // Middleware para verificar o token JWT
      async (req: Request, res: Response) => {
        try {
          // Extrai dados da requisição
          const { userId, date, time, location } = req.body;
          // Cria instâncias de controladores necessários
          const controller = new RegisterController();
          const proofController = new ProofController();
          // Verificando o tipo de registro
          const verifyResult = await controller.verifyTypeRegister(
            parseInt(userId),
            date
          );

          if (verifyResult.status === 200) {
            const typeRegister = verifyResult.type;

            if (typeRegister !== null) {
              // Cria um novo registro
              const registro = new Registro(
                parseInt(userId),
                date,
                time,
                location,
                typeRegister
              );
              // Adicionando o registro ao banco de dados
              const addResult = await controller.addRegister(registro);

              if (addResult.status === 200 && addResult.id !== undefined) {
                // Obtém informações do usuário
                const user = new UserController();
                const userData = await user.getUserById(parseInt(userId));

                if (userData && userData.user) {
                  const userName = userData.user.nome;
                  const userCPF = userData.user.cpf;
                  const token = req.headers.authorization || "";
                  // Cria um PDF para o comprovante
                  const pdf = new PDF(
                    addResult.id,
                    parseInt(userId),
                    userName,
                    userCPF,
                    date,
                    time,
                    token
                  );

                  const { pdfBytes, fileName } = await pdf.createComprovate();
                  // Cria uma instância do Comprovante
                  const comprovante = new Comprovante(
                    parseInt(userId),
                    addResult.id,
                    date,
                    time,
                    fileName,
                    pdfBytes
                  );
                  // Adiciona o comprovante ao banco de dados
                  const addComprovanteResult = await proofController.addProof(
                    comprovante
                  );

                  if (addComprovanteResult.status === 200) {
                    // Responde com sucesso
                    res.status(200).json({
                      message: "Registro bem-sucedido",
                      registroId: addResult.id,
                    });
                  } else {
                    // Responde com erro ao adicionar comprovante
                    res
                      .status(500)
                      .json({ message: "Erro ao adicionar comprovante." });
                  }
                } else {
                  // Responde com erro ao adicionar registro
                  res
                    .status(500)
                    .json({ message: "Erro ao adicionar registro" });
                }
              } else {
                // Responde com erro ao fazer requisição de registro
                res.status(500).json({ message: "Erro ao fazer requisição" });
              }
            } else {
              // Responde com erro ao fazer requisição de registro (tipo inválido)
              res.status(500).json({ message: "Erro ao fazer requisição" });
            }
          } else if (verifyResult.status === 400) {
            res
              .status(400)
              .json({ message: "Limite de registros diários atingido." });
          } else {
            // Responde com erro ao fazer requisição (verificação de tipo de registro)
            res.status(500).json({ message: "Erro ao fazer requisição" });
          }
        } catch (error) {
          // Responde com erro ao fazer a requisição (exceção)
          res.status(500).json({ message: "Erro ao fazer a requisição" });
        }
      }
    );
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
