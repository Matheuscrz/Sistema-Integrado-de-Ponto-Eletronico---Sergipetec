import axios, { AxiosError, AxiosResponse } from "axios";
import { Cookies } from "react-cookie";

interface LoginResponse {
  token: string;
  userId: number;
  message: string;
}

class AuthService {
  private cookies: Cookies;

  constructor() {
    this.cookies = new Cookies();
  }

  async login(
    cpf: string,
    senha: string
  ): Promise<{
    sucess: boolean;
    error?: { status: number; message: string };
  }> {
    try {
      const API_IP = "192.168.0.180";
      const API_PORT = 3444;
      const response: AxiosResponse<LoginResponse> = await axios.post(
        `https://${API_IP}:${API_PORT}/login`,
        {
          cpf,
          senha,
        }
      );
      const token = response.data.token;
      const userId = response.data.userId;
      this.cookies.set("token", token, { path: "/" });
      this.cookies.set("userId", userId.toString(), { path: "/" });
      return { sucess: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        const status = axiosError.response?.status || 500;
        const responseData = axiosError.response?.data;

        const message = this.hasMessageProperty(responseData)
          ? responseData.message
          : "Erro desconhecido";
        return { sucess: false, error: { status, message } };
      } else {
        console.error("Erro ao fazer login: ", error);
        return {
          sucess: false,
          error: { status: 500, message: "Erro desconhecido" },
        };
      }
    }
  }
  isAuthenticated(): boolean {
    const token = this.cookies.get("token");
    return !!token;
  }
  getUserId(): number | undefined {
    const userId = this.cookies.get("userId");
    return userId ? parseInt(userId, 10) : undefined;
  }
  logout(): void {
    this.cookies.remove("token", { path: "/" });
    this.cookies.remove("userId", { path: "/" });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasMessageProperty(obj: any): obj is { message: string } {
    return obj && typeof obj === "object" && "message" in obj;
  }
}
const authService = new AuthService();
export default authService;
