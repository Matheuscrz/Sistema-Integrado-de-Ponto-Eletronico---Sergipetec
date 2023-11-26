import { Comprovante } from "../class/Comprovante";
import database from "../config/Database";
import IProofController from "./IProofController";

class ProofController implements IProofController {
  constructor() {}
  /**
   * Obtém um comprovante correspondente a um registro específico.
   * @param registerId - O ID do registro.
   * @returns Uma promessa que resolve com o comprovante encontrado e o status da operação.
   */
  async getProofByRegisterId(
    registerId: number
  ): Promise<{ data: Comprovante | null; status: number }> {
    try {
      const queryResult = await database.query(
        "SELECT * FROM Comprovante WHERE registro_id = $1",
        [registerId]
      );
      if (queryResult.rows.length === 0) {
        return { data: null, status: 404 }; //Comprovante não encontrado
      }
      const proofData = queryResult.rows[0];
      const comprovante = new Comprovante(
        proofData.usuario_id,
        proofData.registro_id,
        proofData.data,
        proofData.hora,
        proofData.nomedoarquivo,
        proofData.arquivo
      );
      return { data: comprovante, status: 200 };
    } catch (error) {
      return { data: null, status: 500 };
    }
  }
  /**
   * Adiciona um novo comprovante ao sistema.
   * @param comprovante - O comprovante a ser adicionado.
   * @returns Uma promessa que resolve com o status da operação.
   */
  async addProof(comprovante: Comprovante): Promise<{ status: number }> {
    try {
      await database.query(
        "INSERT INTO Comprovante (usuario_id, registro_id, data, hora, nomedoarquivo, arquivo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [
          comprovante.getUsuarioId(),
          comprovante.getRegistroId(),
          comprovante.getData(),
          comprovante.getHora(),
          comprovante.getNomedoArquivo(),
          comprovante.getArquivo(),
        ]
      );
      return { status: 200 };
    } catch (error: any) {
      return { status: 500 };
    }
  }
}
export default ProofController;
