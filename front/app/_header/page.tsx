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
import { Search, Menu, ShoppingCart, CakeSlice } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex items-center border-b-2">
      <div className="w-full flex flex-col lg:flex-row items-center p-4 justify-center gap-5">
        <div className="flex flex-row gap-2 items-center">
          <CakeSlice />
          <h1 className="text-xl">Site de Vendas</h1>
        </div>
        <div className="w-full flex lg:w-[25%] items-center gap-3">
          <InputGroup className="max-w-full">
            <InputGroupInput placeholder="Pesquisar" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Button
            variant="outline"
            className="lg:hidden w-10 h-10 cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          >
            <Menu size={64} />
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
        </div>
        {open && (
          <div className="w-full lg:hidden">
            <ul className="flex flex-col gap-3 w-full">
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
                  <Link href="/profile">Perfil</Link>
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
