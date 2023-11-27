import express, { Request, Response, Router } from "express";
import { UserController } from "../../controller/UserController";
import ProofController from "../../controller/ProofController";
import RegisterController from "../../controller/RegisterController";
import { Registro } from "../../class/Registro";
import verifyToken from "../../auth/verifyToken";

/**
 * Interface que define a estrutura da resposta do histórico.
 * @interface
 * @name HistoryResponse
 */
interface HistoryResponse {
  registers: Registro[];
  status: number;
}

/**
 * Classe que define rotas específicas para obtenção de dados do usuário, histórico e download de comprovantes.
 * Utiliza os controladores UserController, ProofController e RegisterController.
 * @class
 * @name GetRoutes
 */
class GetRoutes {
  private readonly router: Router;

  /**
   * Cria uma instância da classe GetRoutes.
   * Configura as rotas para obter dados do usuário, histórico e download de comprovantes.
   * Utiliza os controladores UserController, ProofController e RegisterController.
   * @constructor
   */
  constructor() {
    this.router = express.Router();
    this.configureRoutes();
  }

  /**
   * Configura as rotas para obter dados do usuário, histórico e download de comprovantes.
   * @private
   * @function
   * @name GetRoutes.configureRoutes
   */
  private configureRoutes() {
    // Rota protegida que retorna os dados do usuário
    this.router.get(
      "/home/:userId",
      verifyToken,
      async (req: Request, res: Response) => {
        try {
          const userID = parseInt(req.params.userId);

          if (userID) {
            const user = new UserController();
            const userData = await user.getUserById(userID);

            if (userData.user) {
              res.json(userData);
            } else {
              res.status(404).json({ message: "Usuário não encontrado" });
            }
          } else {
            res.status(401).json({ message: "Não autorizado" });
          }
        } catch (error: any) {
          const status = res.statusCode !== 200 ? res.statusCode : 500;
          const type = error.type || "RequestError";
          const message =
            error.message || "Ocorreu um erro ao fazer a requisição";

          res.status(status).json({ status, type, message });
        }
      }
    );

    // Rota para fazer o download do comprovante
    this.router.get(
      "/download-comprovante/:id",
      verifyToken,
      async (req: Request, res: Response) => {
        try {
          const registerId = parseInt(req.params.id);

          if (!registerId || isNaN(registerId)) {
            return res
              .status(400)
              .json({ message: "ID do comprovante inválido" });
          }

          const proofController = new ProofController();
          const proofResult = await proofController.getProofByRegisterId(
            registerId
          );

          if (proofResult.status === 404) {
            return res
              .status(404)
              .json({ message: "Comprovante não encontrado" });
          }

          if (proofResult.status === 500) {
            return res
              .status(500)
              .json({ message: "Erro ao buscar comprovante" });
          }

          const proofData = proofResult.data;

          if (!proofData || !proofData.arquivo) {
            return res
              .status(500)
              .json({ message: "Erro ao obter o conteúdo do comprovante" });
          }

          // Prepara o comprovante para download
          const fileName = proofData.nomedoarquivo;
          const fileContent = proofData.arquivo;

          // Configura o cabeçalho da resposta para indicar o tipo de conteúdo
          res.setHeader(
            "Content-Disposition",
            `attachment; filename=${fileName}`
          );
          res.setHeader("Content-Type", "application/pdf");

          // Envie o conteúdo do comprovante como uma resposta
          res.send(fileContent);
        } catch (error) {
          // Em caso de erro, você pode responder com um código de status 500 ou tratá-lo de outra forma, conforme necessário
          res
            .status(500)
            .json({ message: "Erro ao fazer o download do comprovante" });
        }
      }
    );

    // Rota protegida que retorna lista de registros
    this.router.get(
      "/historico/:userId",
      verifyToken,
      async (req: Request, res: Response) => {
        try {
          const userID = parseInt(req.params.userId);
          if (userID) {
            const register = new RegisterController();
            const historyData = await register.getRegisterByUserId(userID);

            if (historyData.status === 200) {
              const responseData = historyData as HistoryResponse;
              res.json(responseData);
            } else if (historyData.status === 404) {
              res.status(404).json({ message: "Nenhum registro encontrado" });
            } else {
              res.status(500).json({ message: "Erro ao obter histórico" });
            }
          } else {
            res.status(401).json({ message: "Não autorizado" });
          }
        } catch (error: any) {
          const status = res.statusCode !== 200 ? res.statusCode : 500;
          const type = error.type || "RequestError";
          const message =
            error.message || "Ocorreu um erro ao fazer a requisição";
          res.status(status).json({ status, type, message });
        }
      }
    );
  }

  /**
   * Retorna o roteador configurado com as rotas definidas.
   * @function
   * @name GetRoutes.getRouter
   * @returns {Router} O roteador configurado com as rotas definidas.
   */
  getRouter() {
    return this.router;
  }
}

export default GetRoutes;
