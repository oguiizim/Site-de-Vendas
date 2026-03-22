import crypto from "crypto";
import type { Request, Response } from "express";
import { Router } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import pool from "../postgres";
import { AuthToken } from "../middleware";
import type { AuthRequest } from "../middleware";

const router = Router();
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const webhookUrl = process.env.MERCADO_PAGO_WEBHOOK_URL;

const mercadoPagoClient = accessToken
  ? new MercadoPagoConfig({
      accessToken,
    })
  : null;

function mapOrderStatus(paymentStatus?: string) {
  if (paymentStatus === "approved") {
    return "recebido";
  }

  if (paymentStatus === "rejected" || paymentStatus === "cancelled") {
    return "pagamento_recusado";
  }

  return "aguardando_pagamento";
}

router.post("/orders", AuthToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const items = Array.isArray(req.body?.items) ? req.body.items : null;
  const payerEmail = String(req.body?.payer_email || "").trim();
  const payerDocument = String(req.body?.payer_document || "").trim();

  if (!mercadoPagoClient) {
    return res
      .status(500)
      .json({ message: "Mercado Pago nao configurado no servidor." });
  }

  if (!userId) {
    return res.status(401).json({ message: "Usuario nao autenticado." });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "O pedido precisa ter itens." });
  }

  if (!payerEmail || !payerDocument) {
    return res.status(400).json({
      message: "Email e CPF do pagador sao obrigatorios.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let totalAmount = 0;
    const normalizedItems: Array<{
      cakeId: number;
      cakeName: string;
      unitPrice: number;
      quantity: number;
      subtotal: number;
    }> = [];

    for (const item of items) {
      const cakeId = Number(item?.id);
      const quantity = Number(item?.quantity);

      if (!cakeId || Number.isNaN(cakeId) || !quantity || quantity <= 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Item do pedido invalido." });
      }

      const cakeResult = await client.query(
        "SELECT id, name, price, stock, avaliable FROM cakes WHERE id = $1",
        [cakeId],
      );

      if (cakeResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Produto nao encontrado." });
      }

      const cake = cakeResult.rows[0];

      if (!cake.avaliable) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ message: `${cake.name} nao esta disponivel.` });
      }

      if (cake.stock < quantity) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: `Estoque insuficiente para ${cake.name}.`,
        });
      }

      const unitPrice = Number(cake.price);
      const subtotal = unitPrice * quantity;

      totalAmount += subtotal;
      normalizedItems.push({
        cakeId: cake.id,
        cakeName: cake.name,
        unitPrice,
        quantity,
        subtotal,
      });
    }

    const orderResult = await client.query(
      `INSERT INTO orders
        (user_id, total_amount, status, payment_status, payer_email, payer_document)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, total_amount, status, payment_status, created_at`,
      [
        userId,
        totalAmount,
        "aguardando_pagamento",
        "pending",
        payerEmail,
        payerDocument,
      ],
    );

    const order = orderResult.rows[0];

    for (const item of normalizedItems) {
      await client.query(
        `INSERT INTO order_items
          (order_id, cake_id, cake_name, unit_price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order.id,
          item.cakeId,
          item.cakeName,
          item.unitPrice,
          item.quantity,
          item.subtotal,
        ],
      );

      await client.query(
        "UPDATE cakes SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.cakeId],
      );
    }

    const paymentClient = new Payment(mercadoPagoClient);
    const payment = await paymentClient.create({
      body: {
        transaction_amount: totalAmount,
        description: `Pedido #${order.id}`,
        payment_method_id: "pix",
        external_reference: String(order.id),
        notification_url: webhookUrl,
        payer: {
          email: payerEmail,
          identification: {
            type: "CPF",
            number: payerDocument,
          },
        },
      },
      requestOptions: {
        idempotencyKey: crypto.randomUUID(),
      },
    });

    const paymentStatus = payment.status || "pending";
    const orderStatus = mapOrderStatus(paymentStatus);
    const qrData = payment.point_of_interaction?.transaction_data;

    await client.query(
      `UPDATE orders
       SET status = $1,
           payment_status = $2,
           mercadopago_payment_id = $3,
           payment_ticket_url = $4,
           pix_qr_code = $5,
           pix_qr_code_base64 = $6
       WHERE id = $7`,
      [
        orderStatus,
        paymentStatus,
        payment.id ?? null,
        qrData?.ticket_url ?? null,
        qrData?.qr_code ?? null,
        qrData?.qr_code_base64 ?? null,
        order.id,
      ],
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Pedido criado com sucesso!",
      order: {
        ...order,
        status: orderStatus,
        payment_status: paymentStatus,
      },
      payment: {
        id: payment.id ?? 0,
        status: paymentStatus,
        ticket_url: qrData?.ticket_url,
        qr_code: qrData?.qr_code,
        qr_code_base64: qrData?.qr_code_base64,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Erro interno do servidor!" });
  } finally {
    client.release();
  }
});

router.get("/orders/me", AuthToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Usuario nao autenticado." });
  }

  try {
    const ordersResult = await pool.query(
      `SELECT id, total_amount, status, payment_status, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );

    const orders = [];

    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `SELECT id, cake_name, unit_price, quantity, subtotal
         FROM order_items
         WHERE order_id = $1
         ORDER BY id ASC`,
        [order.id],
      );

      orders.push({
        ...order,
        items: itemsResult.rows,
      });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor!" });
  }
});

router.post("/payments/webhook", async (req: Request, res: Response) => {
  const paymentId = Number(req.body?.data?.id || req.query["data.id"]);

  if (!mercadoPagoClient || !paymentId || Number.isNaN(paymentId)) {
    return res.status(200).json({ received: true });
  }

  try {
    const paymentClient = new Payment(mercadoPagoClient);
    const payment = await paymentClient.get({ id: paymentId });

    const paymentStatus = payment.status || "pending";
    const orderStatus = mapOrderStatus(paymentStatus);

    await pool.query(
      `UPDATE orders
       SET status = $1, payment_status = $2
       WHERE mercadopago_payment_id = $3`,
      [orderStatus, paymentStatus, paymentId],
    );

    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor!" });
  }
});

export default router;
