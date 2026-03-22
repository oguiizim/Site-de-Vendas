import { API_URL } from "@/api/client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/api/types";

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const info = await res.json();

  if (!res.ok) {
    throw new Error(info.message || "Nao foi possivel fazer login.");
  }

  return info;
}

export async function registerApi(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const info = await res.json();

  if (!res.ok) {
    throw new Error(info.message || "Nao foi possivel criar a conta.");
  }

  return info;
}
