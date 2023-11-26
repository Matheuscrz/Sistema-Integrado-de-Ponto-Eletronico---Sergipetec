import { getToken } from "../config/StorageManager";

export const checkAuthentication = async () => {
  try {
    const userToken = getToken();
    return Boolean(userToken);
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return false;
  }
};
