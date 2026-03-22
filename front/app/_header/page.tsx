"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Search,
  Menu,
  ShoppingCart,
  CakeSlice,
  LogOut,
  LogIn,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getCartItems,
  subscribeToCartUpdates,
  updateCartItemQuantity,
} from "@/api/cart";
import type { CartItem } from "@/api/types";

function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getCartItems());
  const { user, loading, logout } = useAuth();
  const query = searchParams.get("q") || "";

  const profileLabel = !loading && user ? `Perfil: ${user.name}` : "Perfil";

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    return subscribeToCartUpdates(() => {
      setCartItems(getCartItems());
    });
  }, []);

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = String(formData.get("search") || "");
    router.push(`/?q=${encodeURIComponent(value)}`);
  }

  function handleIncrease(id: number, quantity: number) {
    setCartItems(updateCartItemQuantity(id, quantity + 1));
  }

  function handleDecrease(id: number, quantity: number) {
    setCartItems(updateCartItemQuantity(id, quantity - 1));
  }

  return (
    <div className="w-full flex items-center border-b-2">
      <div className="w-full flex flex-col lg:flex-row items-center p-4 justify-center gap-5">
        <div className="flex flex-row gap-2 items-center">
          <CakeSlice />
          <h1 className="text-xl">Site de Vendas</h1>
        </div>
        <div className="w-full flex lg:w-[35%] items-center gap-3">
          <form onSubmit={handleSearchSubmit}>
            <InputGroup className="max-w-full">
              <InputGroupInput
                key={query}
                name="search"
                placeholder="Pesquisar"
                defaultValue={query}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </form>
          <Button
            variant="outline"
            className="lg:hidden w-10 h-10 cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          >
            <Menu size={64} />
          </Button>
          <Button variant="outline" className="hidden lg:flex" asChild>
            <Link href="/profile">{profileLabel}</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="destructive"
                className="lg:flex gap-3 items-center cursor-pointer hidden"
              >
                <ShoppingCart />
                Carrinho
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Carrinho de Compras</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-3 px-4">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Seu carrinho esta vazio.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-xl p-3 flex flex-col gap-1"
                    >
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Preco: R$ {item.price}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantidade: {item.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Subtotal: R$ {item.price * item.quantity}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecrease(item.id, item.quantity)}
                        >
                          -
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncrease(item.id, item.quantity)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <SheetFooter>
                <div className="w-full flex flex-col gap-2">
                  <p className="text-sm">Total: R$ {cartTotal}</p>
                  <Button asChild>
                    <Link href="/cart">Finalizar Compras</Link>
                  </Button>
                  <SheetClose asChild>
                    <Button variant="outline">Fechar</Button>
                  </SheetClose>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          {user ? (
            <Button
              variant="outline"
              className="hidden lg:flex gap-2 items-center cursor-pointer"
              onClick={() => {
                logout();
              }}
            >
              <LogOut />
              Sair
            </Button>
          ) : (
            <Button
              variant="outline"
              className="hidden lg:flex gap-2 items-center cursor-pointer"
              asChild
            >
              <Link href="/login">
                <LogIn />
                Entrar
              </Link>
            </Button>
          )}
        </div>

        {open && (
          <div className="w-full lg:hidden">
            <ul className="flex flex-col justify-center gap-3 w-full">
              <li className="w-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full flex gap-3 items-center cursor-pointer"
                    >
                      <ShoppingCart />
                      Carrinho
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Carrinho de Compras</SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col gap-3 px-4">
                      {cartItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Seu carrinho esta vazio.
                        </p>
                      ) : (
                        cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="border rounded-xl p-3 flex flex-col gap-1"
                          >
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Preco: R$ {item.price}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantidade: {item.quantity}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Subtotal: R$ {item.price * item.quantity}
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDecrease(item.id, item.quantity)
                                }
                              >
                                -
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleIncrease(item.id, item.quantity)
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <SheetFooter>
                      <div className="w-full flex flex-col gap-2">
                        <p className="text-sm">Total: R$ {cartTotal}</p>
                        <Button asChild>
                          <Link href="/cart">Finalizar Compras</Link>
                        </Button>
                        <SheetClose asChild>
                          <Button variant="outline">Fechar</Button>
                        </SheetClose>
                      </div>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </li>
              <li>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/profile">{profileLabel}</Link>
                </Button>
              </li>
              <li className="flex w-full justify-center">
                {user ? (
                  <Button
                    variant="outline"
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => {
                      logout();
                    }}
                  >
                    <LogOut />
                    Sair
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="flex gap-2 items-center cursor-pointer"
                    asChild
                  >
                    <Link href="/login">
                      <LogIn />
                      Entrar
                    </Link>
                  </Button>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
