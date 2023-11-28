import axios from "axios";
import { storeToken, storeUserId } from "../config/StorageManager";

interface AuthResult {
  token?: string;
  userId?: number;
  error?: string;
}

// Constantes globais para o endereço IP e porta da API
const API_IP = "192.168.0.241";
const API_PORT = 3001;

/**
 * Autentica um usuário no sistema.
 * @param {string} cpf - O CPF do usuário.
 * @param {string} senha - A senha do usuário.
 * @returns Uma promessa que resolve com o resultado da autenticação.
 * - Se a autenticação for bem-sucedida, retorna um objeto com token e userId.
 * - Se houver um erro, retorna um objeto com a mensagem de erro.
 */
async function authenticateUser(
  cpf: string,
  senha: string
): Promise<AuthResult> {
  try {
    const response = await axios.post(`http://${API_IP}:${API_PORT}/login`, {
      cpf,
      senha,
    });

    if (response.data.token && response.data.userId) {
      storeToken(response.data.token);
      storeUserId(response.data.userId);
      return {
        token: response.data.token,
        userId: response.data.userId,
      };
    } else {
      return {
        error: response.data.message || "Ocorreu um erro ao fazer a requisição",
      };
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      return { error: error.response.data.message };
    } else {
      return {
        error: error.message || "Ocorreu um erro ao fazer a requisição",
      };
    }
  }
}

export default authenticateUser;
