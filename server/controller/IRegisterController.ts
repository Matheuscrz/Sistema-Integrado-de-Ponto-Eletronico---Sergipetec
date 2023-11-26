import { Registro } from "../class/Registro";

interface IRegisterController {
  /**
   * Obtém um registro pelo seu ID.
   * @param id - O ID do registro.
   * @returns Um objeto contendo o registro e o status da requisição.
   */
  getRegisterById(
    id: number
  ): Promise<{ register: Registro | null; status: number }>;
  /**
   * Obtém todos os registros de um usuário, ordenados do mais recente para o mais antigo.
   * @param userId - O ID do usuário.
   * @returns Um array de registros correspondentes ao usuário e o status da requisição.
   */
  getRegisterByUserId(
    userId: number
  ): Promise<{ registers: Registro[]; status: number }>;
  /**
   * Obtém um registro de um usuário em uma data específica.
   * @param userId - O ID do usuário.
   * @param date - A data do registro.
   * @returns O registro correspondente ao usuário na data especificada e o status da requisição.
   */
  getRegisterByDate(
    userId: number,
    date: Date
  ): Promise<{ register: Registro | null; status: number }>;
  /**
   * Adiciona um novo registro ao sistema.
   * @param register - O registro a ser adicionado.
   * @returns O status da requisição.
   */
  addRegister(register: Registro): Promise<{ status: number; id: number }>;
  /**
   * Verifica o tipo de registro de um usuário em uma data específica.
   * @param userId - O ID do usuário.
   * @param date - A data do registro.
   * @returns O tipo de registro correspondente ao usuário na data especificada e o status da requisição.
   */
  verifyTypeRegister(
    userId: number,
    date: Date
  ): Promise<{ type: number | null; status: number }>;
}
export default IRegisterController;
