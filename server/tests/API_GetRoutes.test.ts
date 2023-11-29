import request from "supertest";
import express, { Application } from "express";
import GetRoutes from "../router/api/Get.routes";

describe("GetRoutes", () => {
  let app: Application;

  beforeAll(() => {
    const getRoutes = new GetRoutes();
    app = express();
    app.use(express.json());
    app.use(getRoutes.getRouter());
  });

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiIwMTIzNDU2Nzg5MCIsImlhdCI6MTY5ODMyMTU1M30.o_aAyIuH6GGMFriQp-dZFBMJ4YqdC-_Fu2L6y76GbFs";

  const userId = 2;

  it("Retorna os dados do usuário para /home", async () => {
    const response = await request(app)
      .get(`/home?userId=${userId}`)
      .set("Authorization", `${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
  });

  it("Retorna o histórico do usuário para /historico", async () => {
    const response = await request(app)
      .get(`/historico?userId=${userId}`)
      .set("Authorization", `${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.registers).toBeDefined();
  });

  it("Retorna 404 para /home quando o usuário não é encontrado", async () => {
    const nonExistentUserId = 999;
    const response = await request(app)
      .get(`/home?userId=${nonExistentUserId}`)
      .set("Authorization", `${authToken}`);

    expect(response.status).toBe(404);
  });

  it("Retorna 404 para /historico quando o usuário não tem registros", async () => {
    const nonExistentUserId = 999;
    const response = await request(app)
      .get(`/historico?userId=${nonExistentUserId}`)
      .set("Authorization", `${authToken}`);

    expect(response.status).toBe(404);
  });
});
