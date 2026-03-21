import type { Request, Response } from "express";
import { Router } from "express";
import pool from "../postgres";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const router = Router();
const jwtSecret = process.env.JWT_SECRET;
const adminSecret = process.env.SECRET_KEY || "uZX8cJonCmwzhlnxPuJ3zX";
const rounds = Number(process.env.ROUNDS) || 10;
if (!jwtSecret) {
  throw new Error("Jwt Secret não encontrado no .env");
}

// Register route
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, key } = req.body;
  let role = "user";
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Usuario ou senha são necessários!" });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: "Senha deve ter 6 caracteres ou mais!",
    });
  }
  if (key === adminSecret) {
    role = "admin";
  }
  const exist = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  if (exist.rowCount != 0) {
    return res.status(409).json({ message: "Usuario ja existe" });
  }

  const hashPassword = await bcrypt.hash(password, rounds);

  try {
    await pool.query(
      `INSERT INTO users (username, password, role) VALUES ($1, $2, $3)`,
      [username, hashPassword, role],
    );
    res.status(201).json({ message: "Usuario criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor!" });
  }
});

// Login Route
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Dados são necessários!" });
    }
    const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "Usuario invalido!" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Senha invalida!" });
    }
    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: "1d",
    });

    const resUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      created_at: user.created_at,
    };

    res.status(200).json({
      token: token,
      user: resUser,

      message: "Login realizado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor!" });
  }
});

export default router;
