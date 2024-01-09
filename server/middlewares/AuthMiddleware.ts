import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {git status
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, "sua_chave_secreta");

    req["user"] = decoded;
    next();
  } catch (error) {
    console.error("Erro de autenticação:", error);
    res.status(401).json({ message: "Token inválido" });
  }
};
