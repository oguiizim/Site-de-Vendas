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
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const profileLabel = !loading && user ? `Perfil: ${user.name}` : "Perfil";

  return (
    <div className="w-full flex items-center border-b-2">
      <div className="w-full flex flex-col lg:flex-row items-center p-4 justify-center gap-5">
        <div className="flex flex-row gap-2 items-center">
          <CakeSlice />
          <h1 className="text-xl">Site de Vendas</h1>
        </div>
        <div className="w-full flex lg:w-[35%] items-center gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/");
            }}
          >
            <InputGroup className="max-w-full">
              <InputGroupInput placeholder="Pesquisar" />
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

              <SheetFooter>
                <Button type="submit">Finalizar Compras</Button>
                <SheetClose asChild>
                  <Button variant="outline">Fechar</Button>
                </SheetClose>
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

                    <SheetFooter>
                      <Button type="submit">Finalizar Compras</Button>
                      <SheetClose asChild>
                        <Button variant="outline">Fechar</Button>
                      </SheetClose>
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
