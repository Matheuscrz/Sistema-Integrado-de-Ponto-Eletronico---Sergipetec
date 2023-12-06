import axios from "axios";
import { getToken, getUserId, storeRegisterId } from "./StorageManager";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

// Constantes globais para o endereço IP e porta da rota
const API_IP = "192.168.0.180";
const API_PORT = 3001;

// Criação do objeto axios com as constantes globais
const apiConfig = axios.create({
  baseURL: `http://${API_IP}:${API_PORT}`,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});

/**
 * Obtém os dados do usuário a partir da API.
 * @returns Uma promessa que resolve com os dados do usuário.
 * @throws Em caso de erro ao obter os dados.
 */
const getUserData = async () => {
  try {
    const token = await getToken();
    const userId = await getUserId();

    // Utilização das constantes globais
    const response = await apiConfig.get(`/home`, {
      headers: {
        Authorization: `${token}`,
      },
      params: { userId },
    });

    return response.data.user;
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    throw error;
  }
};

/**
 * Registra um ponto para o usuário.
 * @param {Date} date - A data do registro.
 * @param {string} time - A hora do registro.
 * @param {string} location - A localização do registro.
 * @returns Uma promessa que resolve com a resposta da API.
 * @throws Em caso de erro ao registrar o ponto.
 */
const registerPoint = async (date: Date, time: string, location: string) => {
  try {
    const token = await getToken();
    const userId = await getUserId();

    // Utilização das constantes globais
    const response = await apiConfig.post(
      "/registrar-ponto",
      {
        userId,
        date,
        time,
        location,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (response.status === 200) {
      storeRegisterId(response.data.registroId);
    }
    return response;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Faz o download do comprovante.
 * @returns Uma promessa que resolve com o status e a mensagem do download.
 * @throws Em caso de erro durante o download.
 */
const downloadReceipt = async (id: number) => {
  try {
    const token = await getToken();
    const fileName = "Comprovante.pdf";

    // Utilização das constantes globais
    const response = await FileSystem.downloadAsync(
      `http://${API_IP}:${API_PORT}/download-comprovante/${id}`,
      FileSystem.documentDirectory + fileName,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (response.status === 200) {
      const saveArquivo = save(
        response.uri,
        fileName,
        response.headers["Content-Type"]
      );

      if ((await saveArquivo).status === 200) {
        return { status: 200, message: "Arquivo salvo com sucesso" };
      } else if ((await saveArquivo).status === 400) {
        return { status: 400, message: "Permissão negada" };
      } else {
        return {
          status: 500,
          message: "Ocorreu um erro ao salvar o arquivo",
        };
      }
    } else {
      return {
        status: 500,
        message: "Ocorreu um erro ao efetuar o download",
      };
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Salva o arquivo no sistema de arquivos.
 * @param {any} uri - O URI do arquivo.
 * @param {any} filename - O nome do arquivo.
 * @param {any} mimetype - O tipo de conteúdo do arquivo.
 * @returns Uma promessa que resolve com o status e a mensagem do salvamento.
 * @throws Em caso de erro ao salvar o arquivo.
 */
const save = async (uri: any, filename: any, mimetype: any) => {
  try {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const saveUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimetype
        );

        await FileSystem.writeAsStringAsync(saveUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        return { status: 200, message: "Arquivo salvo com sucesso" };
      } else {
        return { status: 400, message: "Permissão negada" };
      }
    } else {
      return { status: 400, message: "Ocorreu um erro interno" };
    }
  } catch (erro) {
    return { status: 500, message: "Ocorreu um erro ao salvar arquivo." };
  }
};

/**
 * Obtém os dados de registro a partir da API.
 * @returns Uma promessa que resolve com uma lista de registros.
 * @throws Em caso de erro ao obter os dados.
 */
const getRegisters = async () => {
  try {
    const token = await getToken();
    const userId = await getUserId();
    // Utilização das constantes globais
    const response = await apiConfig.get(`/historico`, {
      headers: {
        Authorization: `${token}`,
      },
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao obter registros do usuário:", error);
    throw error;
  }
};

export { apiConfig, getUserData, registerPoint, downloadReceipt, getRegisters };
