import { API_URL } from "./client";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  UserOrder,
} from "./types";

function getToken() {
  const savedUser = localStorage.getItem("@vendas:user");

  if (!savedUser) {
    throw new Error("Voce precisa estar logado para finalizar a compra.");
  }

  const user = JSON.parse(savedUser);

  if (!user?.token) {
    throw new Error("Token nao encontrado.");
  }

  return user.token as string;
}

export async function createOrder(
  data: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  const token = getToken();

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const info = await res.json();

  if (!res.ok) {
    throw new Error(info.message || "Nao foi possivel finalizar a compra.");
  }

  return info;
}

export async function getMyOrders(): Promise<UserOrder[]> {
  const token = getToken();

  const res = await fetch(`${API_URL}/orders/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const info = await res.json();

  if (!res.ok) {
    throw new Error(info.message || "Nao foi possivel buscar os pedidos.");
  }

  return info.orders;
}
