import request from "supertest";
import express, { Express } from "express";
import PostRoutes from "../router/api/Post.routes";

describe("PostRoutes", () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    const postRoutes = new PostRoutes();
    app.use("/", postRoutes.getRouter());
  });

  describe("POST /login", () => {
    it("Autentica um usuário", async () => {
      const response = await request(app).post("/login").send({
        cpf: "01234567890",
        senha: "1234",
      });

      expect(response.status).toBe(200);
    });

    it("Lida com erros de autenticação", async () => {
      const response = await request(app).post("/login").send({
        cpf: "usuario_invalido",
        senha: "senha_invalida",
      });

      expect(response.status).toBe(401);
    });
  });

  describe("POST /registrar-ponto", () => {
    it("Registra um ponto", async () => {
      const validToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiIwMTIzNDU2Nzg5MCIsImlhdCI6MTY5ODMyMTU1M30.o_aAyIuH6GGMFriQp-dZFBMJ4YqdC-_Fu2L6y76GbFs";
      const response = await request(app)
        .post("/registrar-ponto")
        .set("Authorization", `${validToken}`)
        .send({
          userId: "2",
          date: "2023-12-01",
          time: "12:00:00",
          location: "Local de registro",
        });

      expect(response.status).toBe(200);
    });

    it("Lida com erros durante o registro", async () => {
      const invalidToken = "token_invalido";
      const response = await request(app)
        .post("/registrar-ponto")
        .set("Authorization", invalidToken)
        .send({
          userId: "usuario_invalido",
          date: "data_invalida",
          time: "hora_invalida",
          location: "Local de registro",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "Token inválido. Talvez tenha expirado."
      );
    });
  });
});
