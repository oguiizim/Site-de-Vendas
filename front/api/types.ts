export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  key: string;
};

export type AuthUser = {
  id?: number;
  username: string;
  role?: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
  message?: string;
};

export type RegisterResponse = {
  message: string;
};
