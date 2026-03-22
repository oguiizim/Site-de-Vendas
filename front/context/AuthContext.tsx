"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { loginApi, registerApi } from "@/api/auth";
import type { LoginResponse } from "@/api/types";

type User = {
  id?: number;
  name: string;
  role?: string;
  token?: string;
};

type LoginData = {
  name: string;
  password: string;
};

type RegisterData = {
  name: string;
  password: string;
  key: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const savedUser = localStorage.getItem("@vendas:user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    localStorage.removeItem("@vendas:user");
    return null;
  }
}

function normalizeUser(data: LoginResponse): User {
  return {
    id: data.user.id,
    name: data.user.username,
    role: data.user.role,
    token: data.token,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser) {
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  async function login({ name, password }: LoginData) {
    if (!name || !password) {
      throw new Error("Nome e senha sao obrigatorios.");
    }

    setLoading(true);

    try {
      const data = await loginApi({
        username: name,
        password,
      });
      const authenticatedUser = normalizeUser(data);

      setUser(authenticatedUser);
      localStorage.setItem("@vendas:user", JSON.stringify(authenticatedUser));
    } finally {
      setLoading(false);
    }
  }

  async function register({ name, password, key }: RegisterData) {
    if (!name || !password || !key) {
      throw new Error("Nome, senha e key sao obrigatorios.");
    }

    setLoading(true);

    try {
      await registerApi({
        username: name,
        password,
        key,
      });

      const createdUser: User = {
        name,
      };

      setUser(createdUser);
      localStorage.setItem("@vendas:user", JSON.stringify(createdUser));
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("@vendas:user");
    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider.");
  }

  return context;
}
