import { apiFetch } from "@/api/client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/api/types";

export function loginApi(data: LoginRequest) {
  return apiFetch<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(data),
    errorMessage: "Nao foi possivel fazer login.",
  });
}

export function registerApi(data: RegisterRequest) {
  return apiFetch<RegisterResponse>("/register", {
    method: "POST",
    body: JSON.stringify(data),
    errorMessage: "Nao foi possivel criar a conta.",
  });
}
