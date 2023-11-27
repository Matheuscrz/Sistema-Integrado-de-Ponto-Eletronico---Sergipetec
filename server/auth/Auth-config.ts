/**
 * Módulo Passport para autenticação de usuários.
 * Utiliza a estratégia de autenticação local do Passport com senha criptografada usando bcrypt.
 * Também fornece funções para serialização e deserialização de usuários.
 * @module Passport
 */

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import pool from "../config/Database";

/**
 * Configura a estratégia de autenticação local do Passport.
 * @function
 * @name passport.use
 * @param {object} options - Opções de configuração da estratégia local.
 * @param {string} options.usernameField - Campo no corpo da requisição que contém o CPF.
 * @param {string} options.passwordField - Campo no corpo da requisição que contém a senha.
 * @param {function} verify - Função de verificação de autenticação.
 * @async
 * @throws {Error} Lança um erro em caso de falha na execução da consulta SQL ou na comparação de senha.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "cpf",
      passwordField: "senha",
    },
    async (cpf, senha, done) => {
      try {
        // Consulta o banco de dados para encontrar o usuário com o CPF fornecido
        const user = await pool.query("SELECT * FROM Usuario WHERE cpf = $1", [
          cpf,
        ]);

        // Se o usuário não for encontrado, retorna um erro indicando isso
        if (user.rows.length === 0) {
          return done(null, false, { message: "Usuário não encontrado" });
        }

        // Obtém a senha criptografada do usuário no banco de dados
        const hashedSenha = user.rows[0].senha_hash;

        // Compara a senha fornecida com a senha criptografada no banco de dados
        const senhaCorreta = await bcrypt.compare(senha, hashedSenha);

        // Se a senha estiver incorreta, retorna um erro indicando isso
        if (!senhaCorreta) {
          return done(null, false, { message: "Senha incorreta" });
        }

        // Se a autenticação for bem-sucedida, retorna as informações do usuário autenticado
        const userId = user.rows[0].id;
        return done(null, { userId, cpf });
      } catch (error) {
        // Em caso de erro, repassa o erro para o Passport
        return done(error);
      }
    }
  )
);

/**
 * Função para serializar o usuário para armazenamento na sessão.
 * @function
 * @name passport.serializeUser
 * @param {object} user - Objeto contendo as informações do usuário.
 * @param {number} user.userId - Identificador único do usuário.
 * @param {function} done - Função de callback para indicar o término da serialização.
 */
passport.serializeUser((user: any, done) => {
  // Serializa o usuário para um identificador único
  done(null, user.userId);
});

/**
 * Função para deserializar o usuário a partir do identificador único.
 * @function
 * @name passport.deserializeUser
 * @param {number} userId - Identificador único do usuário.
 * @param {function} done - Função de callback para indicar o término da deserialização.
 * @async
 * @throws {Error} Lança um erro em caso de falha na execução da consulta SQL.
 */
passport.deserializeUser(async (userId: number, done) => {
  try {
    // Consulta o banco de dados para obter informações do usuário com o identificador único
    const user = await pool.query("SELECT * FROM Usuario WHERE id = $1", [
      userId,
    ]);

    // Se o usuário não for encontrado, retorna um erro indicando isso
    if (user.rows.length === 0) {
      return done(null, false);
    }

    // Retorna o usuário deserializado
    return done(null, { userId, cpf: user.rows[0].cpf });
  } catch (error) {
    // Em caso de erro, repassa o erro para o Passport
    return done(error);
  }
});

export default passport;
