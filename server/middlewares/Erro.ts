import { Request, Response, NextFunction } from "express";

/**
 * Classe que encapsula métodos para lidar com erros.
 * @class
 * @name Erro
 */
class Erro {
  /**
   * Middleware para lidar com erros.
   * @function
   * @name Erro.middleware
   * @param {any} err - O objeto de erro.
   * @param {Request} req - Objeto da requisição HTTP.
   * @param {Response} res - Objeto da resposta HTTP.
   * @param {NextFunction} next - Próxima função middleware na cadeia.
   */
  static middleware(err: any, req: Request, res: Response, next: NextFunction) {
    // Define o status da resposta com base no status da resposta HTTP ou 500 (Erro Interno do Servidor)
    const status = res.statusCode !== 200 ? res.statusCode : 500;
    // Obtém o tipo de erro do objeto de erro ou define como "RequestError" se não estiver presente
    const type = err.type || "RequestError";
    // Obtém a mensagem de erro do objeto de erro ou define como mensagem padrão se não estiver present
    const message = err.message || "Ocorreu um erro ao fazer a requisição";
    // Envia a resposta com o status e mensagem de erro
    res.status(status).json({ status, type, message });
  }
}
// Exporta a classe Erro
export default Erro;
