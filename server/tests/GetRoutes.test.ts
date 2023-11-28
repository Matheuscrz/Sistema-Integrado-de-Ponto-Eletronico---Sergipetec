import request from "supertest";
import express, { Application } from "express";
import GetRoutes from "../router/api/Get.routes";

describe("GetRoutes", () => {
  let app: Application;

  beforeAll(() => {
    const getRoutes = new GetRoutes();
    app = express();
    app.use("/mobile/get", getRoutes.getRouter());
  });

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiIwMTIzNDU2Nzg5MCIsImlhdCI6MTY5ODMyMTU1M30.o_aAyIuH6GGMFriQp-dZFBMJ4YqdC-_Fu2L6y76GbFs";

  it("Retorna os dados do usuário para /home/:userId", async () => {
    const response = await request(app)
      .get("/mobile/get/home/2")
      .set("Authorization", `${authToken}`);
    expect(response.status).toBe(200);
  });
  it("Retorna o histórico do usuário para /historico/:userId", async () => {
    const response = await request(app)
      .get("/mobile/get/historico/2")
      .set("Authorization", `${authToken}`);
    expect(response.status).toBe(200);
  });
});
