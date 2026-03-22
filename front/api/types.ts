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

export type CreateOrderItem = {
  id: number;
  quantity: number;
};

export type CreateOrderRequest = {
  items: CreateOrderItem[];
  payer_email: string;
  payer_document: string;
};

export type CreateOrderResponse = {
  message: string;
  order: {
    id: number;
    user_id: number;
    total_amount: number;
    status: string;
    created_at: string;
  };
  payment: {
    id: number;
    status: string;
    ticket_url?: string;
    qr_code?: string;
    qr_code_base64?: string;
  };
};

export type UserOrderItem = {
  id: number;
  cake_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export type UserOrder = {
  id: number;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  items: UserOrderItem[];
};
