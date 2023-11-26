import { Usuario } from "../class/Usuario";

// Interface que descreve as operações do controle de usuários
interface IUserController {
  /**
   * Obtém um usuário por ID.
   * @param id - O ID do usuário.
   * @returns Uma promessa que resolve com o usuário encontrado e o status da operação.
   */
  getUserById(id: number): Promise<{ user: Usuario | null; status: number }>;
  /**
   * Obtém um usuário por CPF.
   * @param cpf - O CPF do usuário.
   * @returns Uma promessa que resolve com o usuário encontrado e o status da operação.
   */
  getUserByCPF(cpf: string): Promise<{ user: Usuario | null; status: number }>;
  /**
   * Adiciona um novo usuário.
   * @param user - O usuário a ser adicionado.
   * @returns Uma promessa que resolve com o status da operação.
   */
  addUser(user: Usuario): Promise<{ status: number }>;
  /**
   * Remove um usuário por ID.
   * @param id - O ID do usuário a ser removido.
   * @returns Uma promessa que resolve com o status da operação.
   */
  removeUser(id: number): Promise<{ status: number }>;
  /**
   * Atualiza as informações de um usuário.
   * @param user - O usuário com as informações atualizadas.
   * @returns Uma promessa que resolve com o status da operação.
   */
  updateUser(user: Usuario): Promise<{ status: number }>;
}
export default IUserController;
