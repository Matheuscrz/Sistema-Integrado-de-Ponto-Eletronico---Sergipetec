import verifyToken from "../auth/VerifyToken";
import { Request, Response, NextFunction } from "express";

describe("Middleware verifyToken", () => {
  it("deve chamar next() se o token for válido", () => {
    const req = {
      headers: {
        authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiIwMTIzNDU2Nzg5MCIsImlhdCI6MTcwMTM1NjI0M30.KLIkfFRto5EvrWVEGjjyfDP05RO6dm5XgyrLgfDceEk",
      },
    } as Request;
    const res = { status: jest.fn(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((res.status as jest.Mock).mock.calls.length).toBe(0);
  });

  it("deve retornar um status 401 se o token não for fornecido", () => {
    const req = { headers: {} } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    verifyToken(req, res, next);

    expect((res.status as jest.Mock).mock.calls[0][0]).toBe(401);
    expect((res.json as jest.Mock).mock.calls[0][0]).toEqual({
      message: "Token não fornecido",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar um status 401 se o token for inválido", () => {
    const req = {
      headers: { authorization: "Bearer TOKEN_INVALIDO" },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    verifyToken(req, res, next);

    expect((res.status as jest.Mock).mock.calls[0][0]).toBe(401);
    expect((res.json as jest.Mock).mock.calls[0][0]).toEqual({
      message: "Token inválido",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
