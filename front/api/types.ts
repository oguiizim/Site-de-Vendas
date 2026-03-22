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

export type Cakes = {
  id: number;
  name: string;
  price: number;
  weight: number;
  stock: number;
  category: string;
  avaliable: boolean;
  image_url: string;
};

export type CreateCakeData = {
  name: string;
  price: number;
  weight: number;
  stock: number;
  category: string;
  avaliable: boolean;
  image_url: string;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};
