// Importando as dependências necessárias
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

/**
 * Função middleware para verificar a validade de um token JWT.
 * @function
 * @name verifyToken
 * @param {Request} req - Objeto da requisição HTTP.
 * @param {Response} res - Objeto da resposta HTTP.
 * @param {NextFunction} next - Próxima função middleware na cadeia.
 * @returns {Response|void} Retorna um erro de autenticação ou chama a próxima função middleware.
 */
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Obtendo o token do cabeçalho da requisição
  const token = req.headers.authorization;

  // Verificando se o token está presente na requisição
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  // Verificando a validade do token
  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
    if (err) {
      // Se o token for inválido, retorna um erro de autenticação
      return res
        .status(401)
        .json({ message: "Token inválido. Talvez tenha expirado." });
    }

    // Se o token for válido, chama a próxima função middleware
    next();
  });
};
export default verifyToken;
