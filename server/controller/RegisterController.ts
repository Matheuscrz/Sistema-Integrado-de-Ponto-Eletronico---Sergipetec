import { Registro } from "../class/Registro";
import IRegisterController from "./IRegisterController";
import database from "../config/Database";

class RegisterController implements IRegisterController {
  constructor() {}
  /**
   * Obtém um registro por ID.
   * @param id - O ID do registro.
   * @returns Uma promessa que resolve com o registro encontrado e o status da operação.
   */
  async getRegisterById(
    id: number
  ): Promise<{ register: Registro | null; status: number }> {
    try {
      const query = "SELECT * FROM Registros WHERE id =$1";
      const result = await database.query(query, [id]);
      const registerData = result.rows[0];
      if (registerData) {
        return { register: registerData, status: 200 };
      } else {
        return { register: null, status: 404 };
      }
    } catch (error: any) {
      return { register: null, status: 500 };
    }
  }

  /**
   * Obtém registros por ID do usuário.
   * @param userId - O ID do usuário.
   * @returns Uma promessa que resolve com os registros encontrados e o status da operação.
   */
  async getRegisterByUserId(
    userId: number
  ): Promise<{ registers: Registro[]; status: number }> {
    try {
      const query =
        "SELECT * FROM Registros WHERE usuario_id = $1 ORDER BY data DESC";
      const result = await database.query(query, [userId]);
      const registerData = result.rows;
      if (registerData) {
        return { registers: registerData, status: 200 };
      } else {
        return { registers: [], status: 404 };
      }
    } catch (error: any) {
      return { registers: [], status: 500 };
    }
  }

  /**
   * Obtém um registro por ID de usuário e data.
   * @param userId - O ID do usuário.
   * @param date - A data do registro.
   * @returns Uma promessa que resolve com o registro encontrado e o status da operação.
   */
  async getRegisterByDate(
    userId: number,
    date: Date
  ): Promise<{ register: Registro | null; status: number }> {
    try {
      const query =
        "SELECT * FROM Registros WHERE usuario_id = $1 AND data = $2";
      const result = await database.query(query, [userId, date]);
      const registerData = result.rows[0];
      if (registerData) {
        return { register: registerData, status: 200 };
      } else {
        return { register: null, status: 404 };
      }
    } catch (error: any) {
      return { register: null, status: 500 };
    }
  }

  /**
   * Adiciona um novo registro.
   * @param register - O registro a ser adicionado.
   * @returns Uma promessa que resolve com o status da operação.
   */
  async addRegister(
    register: Registro
  ): Promise<{ status: number; id: number }> {
    try {
      const query = `
        INSERT INTO Registros (
          usuario_id, data, hora, localizacao, tipo_registro_id
        )
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id;
      `;
      const result = await database.query(query, [
        register.getUsuarioId(),
        register.getData(),
        register.getHora(),
        register.getLocalizacao(),
        register.getTipoRegistroId(),
      ]);
      const id = result.rows[0].id;
      return { status: 200, id };
    } catch (error: any) {
      return { status: 500, id: 0 };
    }
  }
  /**
   * Verifica o tipo de registro.
   * @param userId - O ID do usuário.
   * @param date - A data do registro.
   * @returns Uma promessa que resolve com o tipo de registro e o status da operação.
   */
  async verifyTypeRegister(
    userId: number,
    date: Date
  ): Promise<{ type: number | null; status: number }> {
    try {
      const query =
        "SELECT COUNT(*) as total_registros FROM Registros WHERE usuario_id = $1 AND data = $2";
      const result = await database.query(query, [userId, date]);

      const totalRegistros = parseInt(result.rows[0].total_registros);

      if (totalRegistros >= 0 && totalRegistros <= 3) {
        return { type: totalRegistros + 1, status: 200 };
      } else {
        return { type: null, status: 400 };
      }
    } catch (error) {
      return { type: null, status: 500 };
    }
  }
}

export default RegisterController;
