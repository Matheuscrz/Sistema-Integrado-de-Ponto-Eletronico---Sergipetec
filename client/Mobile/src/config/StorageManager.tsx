import AsyncStorage from "@react-native-async-storage/async-storage";
/**
 * Armazena o token de autenticação no AsyncStorage.
 * @param token - O token a ser armazenado.
 */
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.error("Ocorreu um erro inesperado", error);
  }
};
/**
 * Obtém o token de autenticação do AsyncStorage.
 * @returns Uma promessa que resolve com o token, ou null se não houver token.
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.error("Ocorreu um erro inesperado", error);
  }
};
/**
 * Armazena o ID do usuário no AsyncStorage.
 * @param userId - O ID do usuário a ser armazenado.
 */
export const storeUserId = async (userId: number) => {
  try {
    await AsyncStorage.setItem("user_id", userId.toString());
  } catch (error) {
    console.error("Ocorreu um erro inesperado", error);
  }
};
/**
 * Obtém o ID do usuário do AsyncStorage.
 * @returns us Uma promessa que resolve com o ID do usuário, ou null se não houver ID.
 */
export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem("user_id");
    return userId;
  } catch (error) {
    console.error("Ocorreu um erro inesperado", error);
  }
};
/**
 * Armazena o ID do registro no AsyncStorage.
 * @param registroId - O ID do usuário a ser armazenado.
 */
export const storeRegisterId = async (registroId: number) => {
  try {
    await AsyncStorage.setItem("register_id", registroId.toString());
  } catch (error) {
    console.error("Ocorreu um erro inesperado", error);
  }
};
/**
 * Obtém o ID do registro do AsyncStorage.
 * @returns us Uma promessa que resolve com o ID do usuário, ou null se não houver ID.
 */
export const getRegisterId = async () => {
  try {
    const registerId = await AsyncStorage.getItem("register_id");
    return registerId;
  } catch (error) {
    console.error("Ocorreu um erro inesperado", error);
  }
};
/**
 * Remove um item do AsyncStorage.
 * @param key - A chave do item a ser removido.
 */
export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Ocorreu um erro inesperado", error);
  }
};
