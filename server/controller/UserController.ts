import { Usuario } from "../class/Usuario";
import IUserController from "./IUserController";
import database from "../config/Database";

/**
 * Controller responsável por gerenciar usuários no sistema.
 */
export class UserController implements IUserController {
  constructor() {}
  /**
   * Obtém um usuário pelo seu CPF.
   * @param cpf - O CPF do usuário.
   * @returns Um objeto contendo o usuário e o status da requisição.
   */
  async getUserById(
    id: number
  ): Promise<{ user: Usuario | null; status: number }> {
    try {
      const query = "SELECT * FROM Usuario WHERE id =$1";
      const result = await database.query(query, [id]);
      const userData = result.rows[0];
      if (userData) {
        return { user: userData, status: 200 };
      } else {
        return { user: null, status: 404 };
      }
    } catch (error: any) {
      return { user: null, status: 500 };
    }
  }
  /**
   * Obtém um usuário pelo seu CPF.
   * @param cpf - O CPF do usuário.
   * @returns Um objeto contendo o usuário e o status da requisição.
   */
  async getUserByCPF(
    cpf: string
  ): Promise<{ user: Usuario | null; status: number }> {
    try {
      const query = "SELECT * FROM Usuario WHERE cpf = $1";
      const result = await database.query(query, [cpf]);
      const userData = result.rows[0];
      if (userData) {
        return { user: userData, status: 200 };
      } else {
        return { user: null, status: 404 };
      }
    } catch (error: any) {
      return { user: null, status: 500 };
    }
  }
  /**
   * Registra um novo usuário no sistema.
   * @param user - O usuário a ser registrado.
   * @returns Um objeto contendo o status da requisição.
   */
  async addUser(user: Usuario): Promise<{ status: number }> {
    try {
      const query = `
        INSERT INTO Usuario (
          nome, cpf, pin, senha_hash, setor,
          horario_entrada, intervalo_ini, intervalo_fim, horario_saida,
          carga_horaria, perfil_acesso_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;

      await database.query(query, [
        user.nome,
        user.cpf,
        user.pin,
        user.senha,
        user.setor,
        user.horarioEntrada,
        user.intervalo_ini,
        user.intervalo_fim,
        user.horarioSaida,
        user.cargaHoraria,
        user.perfilAcessoId,
      ]);
      return { status: 200 };
    } catch (error: any) {
      return { status: 500 };
    }
  }
  /**
   * Remove um usuário do sistema se ele não possuir registros.
   * @param id - O ID do usuário a ser removido.
   * @returns Um objeto contendo o status da requisição.
   */
  async removeUser(id: number): Promise<{ status: number }> {
    try {
      //Verifica se o usuário possui registro no servidor.
      const registros = await this.getRegistrosByUserId(id);
      if (registros.length > 0) {
        return { status: 400 };
      }
      const query = "DELETE FROM Usuario WHERE id = $1";
      await database.query(query, [id]);
      return { status: 200 };
    } catch (error: any) {
      return { status: 500 };
    }
  }
  /**
   * Atualiza os dados de um usuário no sistema.
   * @param user - O usuário com os dados atualizados.
   * @returns Um objeto contendo o status da requisição.
   */
  async updateUser(user: Usuario): Promise<{ status: number }> {
    try {
      const userId = await this.getUserIdByCPF(user.getCPF());
      if (!userId) {
        return { status: 404 }; // Usuário não encontrado
      }
      const {
        nome,
        setor,
        horarioEntrada,
        intervalo_ini,
        intervalo_fim,
        horarioSaida,
        cargaHoraria,
        perfilAcessoId,
      } = user;

      const query = `
        UPDATE Usuario SET
          nome = $2,
          setor = $3,
          horario_entrada = $4,
          intervalo_ini = $5,
          intervalo_fim = $6,
          horario_saida = $7,
          carga_horaria = $8,
          perfil_acesso_id = $9
        WHERE id = $1
      `;

      await database.query(query, [
        userId,
        nome,
        setor,
        horarioEntrada,
        intervalo_ini,
        intervalo_fim,
        horarioSaida,
        cargaHoraria,
        perfilAcessoId,
      ]);
      return { status: 200 };
    } catch (error: any) {
      return { status: 500 };
    }
  }
  /**
   * Obtém os registros de um usuário pelo seu ID.
   * @param id - O ID do usuário.
   * @returns Um array de registros correspondentes ao usuário.
   */
  async getRegistrosByUserId(id: number) {
    const query = "SELECT * FROM Registros WHERE usuario_id = $1";
    const result = await database.query(query, [id]);
    return result.rows;
  }
  /**
   * Obtém o ID de um usuário a partir do CPF.
   * @param cpf - O CPF do usuário.
   * @returns O ID do usuário correspondente ou null se não encontrado.
   */
  async getUserIdByCPF(cpf: string): Promise<number | null> {
    try {
      const query = "SELECT id FROM Usuario WHERE cpf = $1";
      const result = await database.query(query, [cpf]);
      const userData = result.rows[0];

      if (userData) {
        return userData.id;
      } else {
        return null; // Usuário não encontrado
      }
    } catch (error) {
      return null; // Erro interno do servidor
    }
  }
}
