/**
 * Módulo para lidar com conexões com o banco de dados PostgreSQL utilizando o módulo 'pg'.
 * @module Database
 */

// Importando a classe Pool do módulo 'pg' para lidar com conexões com o PostgreSQL
import { Pool } from "pg";

/**
 * Classe que encapsula métodos para executar consultas no banco de dados PostgreSQL.
 * @class
 * @name Database
 */
class Database {
  private pool: Pool;

  /**
   * Cria uma instância da classe Database.
   * Configura a conexão com o banco de dados PostgreSQL utilizando o módulo 'pg'.
   * @constructor
   */
  constructor() {
    this.pool = new Pool({
      user: "postgres",
      host: "localhost", // Servidor Local para desenvolvimento
      database: "Sistema de Ponto",
      password: process.env.DATABASE_PASSWORD, // Lendo de uma variável de ambiente
      port: 5432,
    });
  }

  /**
   * Executa uma consulta no banco de dados.
   * @function
   * @name Database.query
   * @param {string} text - A string da consulta SQL.
   * @param {any[]} [params=[]] - Parâmetros opcionais a serem inseridos na consulta.
   * @returns {Promise} Uma promessa que resolve com o resultado da consulta.
   * @throws {Error} Lança um erro em caso de falha na execução da consulta.
   */
  async query(text: string, params: any[] = []) {
    const client = await this.pool.connect();
    try {
      // Executa a consulta no banco de dados
      const result = await client.query(text, params);
      return result;
    } finally {
      // Libera o cliente de volta para o pool após a execução da consulta
      client.release();
    }
  }
}

// Cria uma instância da classe Database
const database = new Database();

export default database;
