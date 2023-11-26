import request from "supertest";
import express, { Request, Response } from "express";
import loggerMiddleware from "../middlewares/LoggerMiddleware";
import { describe } from "node:test";

describe("Logger Middleware", () => {
  const app = express();

  app.use(loggerMiddleware);

  app.get("/test", (req: Request, res: Response) => {
    res.status(200).json({ message: "Teste bem-sucedido" });
  });

  test("Devo registrar informações para rota /test", async () => {
    const response = await request(app).get("/test");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Teste bem-sucedido",
    });
  });
});
