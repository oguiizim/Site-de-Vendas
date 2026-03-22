import { Cakes, CartItem } from "./types";

const CART_KEY = "@vendas:cart";
const CART_UPDATED_EVENT = "cart-updated";

function notifyCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedCart = localStorage.getItem(CART_KEY);

  if (!savedCart) {
    return [];
  }

  try {
    return JSON.parse(savedCart) as CartItem[];
  } catch {
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

function saveCartItems(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  notifyCartUpdated();
}

export function addToCart(cake: Cakes): CartItem[] {
  const currentItems = getCartItems();
  const existingItem = currentItems.find((item) => item.id === cake.id);

  if (existingItem) {
    const updatedItems = currentItems.map((item) =>
      item.id === cake.id ? { ...item, quantity: item.quantity + 1 } : item,
    );

    saveCartItems(updatedItems);
    return updatedItems;
  }

  const newItems = [
    ...currentItems,
    {
      id: cake.id,
      name: cake.name,
      price: cake.price,
      image_url: cake.image_url,
      quantity: 1,
    },
  ];

  saveCartItems(newItems);
  return newItems;
}

export function updateCartItemQuantity(
  id: number,
  quantity: number,
): CartItem[] {
  const currentItems = getCartItems();

  if (quantity <= 0) {
    return removeFromCart(id);
  }

  const updatedItems = currentItems.map((item) =>
    item.id === id ? { ...item, quantity } : item,
  );

  saveCartItems(updatedItems);
  return updatedItems;
}

export function removeFromCart(id: number): CartItem[] {
  const currentItems = getCartItems();
  const updatedItems = currentItems.filter((item) => item.id !== id);

  saveCartItems(updatedItems);
  return updatedItems;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  notifyCartUpdated();
}

export function subscribeToCartUpdates(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(CART_UPDATED_EVENT, callback);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, callback);
  };
}
