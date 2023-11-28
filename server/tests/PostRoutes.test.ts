import request from "supertest";
import express, { Express } from "express";
import PostRoutes from "../router/api/Post.routes";

describe("PostRoutes", () => {
  let app: Express;

  beforeAll(() => {
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
      const response = await request(app)
        .post("/registrar-ponto")
        .set(
          "Authorization",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiIwMTIzNDU2Nzg5MCIsImlhdCI6MTY5ODMyNDQzM30.y3ZNKyaNIQbMwV2faTJrteIZxAwDqsCWBFJtaP-tSaM"
        )
        .send({
          userId: "2",
          date: "2023-11-23",
          time: "12:00:00",
          location: "Local de registro",
        });

      expect(response.status).toBe(200);
    });

    it("Lida com erros durante o registro", async () => {
      const response = await request(app)
        .post("/registrar-ponto")
        .set(
          "Authorization",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiIwMTIzNDU2Nzg5MCIsImlhdCI6MTY5ODMyNDQzM30.y3ZNKyaNIQbMwV2faTJrteIZxAwDqsCWBFJtaP-tSaM"
        )
        .send({
          userId: "usuario_invalido",
          date: "data_invalida",
          time: "hora_invalida",
          location: "Local de registro",
        });

      expect(response.status).toBe(500);
    });
  });
});
