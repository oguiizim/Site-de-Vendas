import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export interface JwtPayload {
  id: number;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function AuthToken(req: AuthRequest, res: Response, next: NextFunction) {
  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT secret nao configurado." });
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Token nao informado." });
  }
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token invalido." });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalido ou expirado." });
    }
    req.user = user as JwtPayload;
    next();
  });
}

export function RequireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acesso liberado apenas para admins" });
  }
  next();
}
