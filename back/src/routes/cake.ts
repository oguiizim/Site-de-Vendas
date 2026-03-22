import type { Request, Response } from "express";
import { Router } from "express";
import pool from "../postgres";
import { AuthToken, RequireAdmin } from "../middleware";

const router = Router();

router.get("/cakes", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM cakes ORDER BY created_at DESC`,
    );
    return res.status(200).json({ cakes: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor!" });
  }
});

router.post(
  "/cakes/create",
  AuthToken,
  RequireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { name, price, stock, weight, category, avaliable, image_url } =
        req.body;
      if (
        name == null ||
        price == null ||
        stock == null ||
        weight == null ||
        category == null ||
        avaliable == null ||
        image_url == null
      ) {
        return res.status(400).json({ message: "Faltam informações!" });
      }

      const exists = await pool.query("SELECT 1 FROM cakes WHERE name = $1", [
        name,
      ]);
      if (exists.rowCount != 0) {
        return res.status(409).json({ message: "Nome de bolo já existe." });
      }

      await pool.query(
        `INSERT INTO cakes (name, price, stock, weight, category, avaliable, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [name, price, stock, weight, category, avaliable, image_url],
      );

      return res.status(201).json({ message: "Bolo criado com sucesso." });
    } catch (error) {
      return res.status(500).json({ message: "Erro interno no servidor!" });
    }
  },
);

router.put(
  "/cakes/edit/:id",
  AuthToken,
  RequireAdmin,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido." });
      }

      const { name, price, stock, weight, category, avaliable, image_url } =
        req.body;

      const selectResult = await pool.query(
        `SELECT * FROM cakes WHERE id = $1`,
        [id],
      );
      if (selectResult.rowCount === 0) {
        return res.status(404).json({ message: "Bolo não encontrado." });
      }

      const cake = selectResult.rows[0];

      if (name != null && name !== cake.name) {
        const taken = await pool.query(
          `SELECT 1 FROM cakes WHERE name = $1 AND id <> $2`,
          [name, id],
        );
        if (taken.rowCount != 0) {
          return res
            .status(409)
            .json({ message: "Nome de bolo já está em uso." });
        }
      }

      const updatedName = name ?? cake.name;
      const updatedPrice = price ?? cake.price;
      const updatedStock = stock ?? cake.stock;
      const updatedWeight = weight ?? cake.weight;
      const updatedCategory = category ?? cake.category;
      const updatedAvaliable = avaliable ?? cake.avaliable;
      const updatedUrl = image_url ?? cake.image_url;

      await pool.query(
        `UPDATE cakes SET name = $1, price = $2, stock = $3, weight = $4, category = $5, avaliable = $6, image_url = $7 WHERE id = $8`,
        [
          updatedName,
          updatedPrice,
          updatedStock,
          updatedWeight,
          updatedCategory,
          updatedAvaliable,
          updatedUrl,
          id,
        ],
      );

      return res.status(200).json({ message: "Bolo atualizado com sucesso." });
    } catch (error) {
      return res.status(500).json({ message: "Erro interno no servidor!" });
    }
  },
);

router.delete(
  "/cakes/delete/:id",
  AuthToken,
  RequireAdmin,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID inválido." });
      }

      await pool.query(`DELETE FROM cakes WHERE id = $1`, [id]);

      return res.status(200).json({ message: "Bolo deletado com sucesso!" });
    } catch (error) {
      return res.status(404).json({ message: "Erro interno no servidor!" });
    }
  },
);

export default router;
