import { Cakes, CreateCakeData } from "./types";
import { API_URL } from "./client";

function getAdminSession() {
  const savedUser = localStorage.getItem("@vendas:user");

  if (!savedUser) {
    throw new Error("Voce precisa estar logado.");
  }

  const user = JSON.parse(savedUser);
  const token = user?.token;

  if (!token) {
    throw new Error("Token nao encontrado.");
  }

  if (user?.role !== "admin") {
    throw new Error("Apenas admins podem fazer essa acao.");
  }

  return { token };
}

export async function getCakes(): Promise<Cakes[]> {
  const res = await fetch(`${API_URL}/cakes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar bolos");
  }

  const info = await res.json();
  return info.cakes;
}

export async function createCakes(data: CreateCakeData) {
  const { token } = getAdminSession();

  const res = await fetch(`${API_URL}/cakes/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const info = await res.json();

  if (!res.ok) {
    throw new Error(info.message || "Nao foi possivel criar o bolo!");
  }

  return info;
}

export async function getCakeById(id: number): Promise<Cakes> {
  const cakes = await getCakes();
  const cake = cakes.find((item) => item.id === id);

  if (!cake) {
    throw new Error("Bolo nao encontrado.");
  }

  return cake;
}

export async function editCake(id: number, data: CreateCakeData) {
  const { token } = getAdminSession();

  const res = await fetch(`${API_URL}/cakes/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const info = await res.json();

  if (!res.ok) {
    throw new Error(info.message || "Nao foi possivel editar o bolo.");
  }

  return info;
}

export async function deleteCake(id: number) {
  const { token } = getAdminSession();

  const res = await fetch(`${API_URL}/cakes/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const info = await res.json();

  if (!res.ok) {
    throw new Error(info.message || "Nao foi possivel deletar o bolo.");
  }

  return info;
}
