import axios from "axios";
import AuthService from "../service/AuthService";

const API_IP = "localhost";
const API_PORT = 3444;

const apiConfig = axios.create({
  baseURL: `https://${API_IP}:${API_PORT}`,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});
const getUserData = async () => {
  try {
    const userId = await AuthService.getUserId();
    const token = await AuthService.getToken();

    const response = await apiConfig.get(`/home`, {
      headers: {
        Authorization: `${token}`,
      },
      params: { userId },
    });
    if (response.status === 200) {
      return response.data.user;
    } else {
      console.error(`A requisição falhou com o status ${response.status}`);
      throw new Error(`A requisição falhou com o status ${response.status}`);
    }
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    throw error;
  }
};

export { getUserData };
