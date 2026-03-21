import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

interface JwtPayload {
  id: number;
  role?: string;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function AuthToken(req: AuthRequest, res: Response, next: NextFunction) {
  if (!jwtSecret) {
    throw new Error("Jwt Secret are unavaliable!");
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new Error("Auth Header are undefined!");
  }
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401);
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403);
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
