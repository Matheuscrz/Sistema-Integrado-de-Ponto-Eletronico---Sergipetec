import { Comprovante } from "../class/Comprovante";
/**
 * Interface que descreve as operações do controle de comprovantes.
 */
interface IComprovanteController {
  getProofByRegisterId(
    registerId: number
  ): Promise<{ data: Comprovante | null; status: number }>;
  /**
   * Adiciona um novo comprovante ao sistema.
   * @param comprovante - O comprovante a ser adicionado.
   * @returns Uma promessa que resolve com o status da operação.
   */
  addProof(comprovante: Comprovante): Promise<{ status: number }>;
}

export default IComprovanteController;
