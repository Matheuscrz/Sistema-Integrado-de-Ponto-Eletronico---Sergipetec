/**
 * Módulo para autenticação de usuários utilizando a estratégia "local" do Passport e geração de token JWT.
 * @module Authenticate
 */

import passport from "./Auth-config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Classe que encapsula métodos relacionados à autenticação de usuários.
 * @class
 * @name Authenticate
 */
class Authenticate {
  /**
   * Cria uma instância da classe Authenticate.
   * @constructor
   */
  constructor() {}

  /**
   * Middleware para autenticar um usuário utilizando a estratégia "local" do Passport.
   * @function
   * @name authenticateUser
   * @param {Request} req - Objeto da requisição HTTP.
   * @param {Response} res - Objeto da resposta HTTP.
   * @param {NextFunction} next - Próxima função middleware na cadeia.
   * @returns {Response} Retorna um token JWT e informações do usuário em caso de autenticação bem-sucedida,
   *                    ou uma resposta de erro em caso contrário.
   * @throws {Error} Lança um erro em caso de falha na geração do token JWT.
   */
  authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: Error, user: any, info: any) => {
        if (err) {
          return next(err); // Chama o middleware de erro
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }

        // Gera um token JWT com base no CPF do usuário
        const token = jwt.sign(
          { cpf: user.cpf },
          process.env.JWT_SECRET || "secret"
        );

        // Retorna a resposta com o token e informações do usuário
        return res.status(200).json({
          token,
          userId: user.userId,
          message: "Autenticação bem-sucedida",
        });
      }
    )(req, res, next);
  };
}
export default new Authenticate();
