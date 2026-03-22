"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  clearCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
} from "@/api/cart";
import { createOrder } from "@/api/order";
import type { CartItem } from "@/api/types";

function PartPage() {
  const [items, setItems] = useState<CartItem[]>(() => getCartItems());
  const [submitting, setSubmitting] = useState(false);
  const [payerEmail, setPayerEmail] = useState("");
  const [payerDocument, setPayerDocument] = useState("");

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  function handleIncrease(id: number, quantity: number) {
    setItems(updateCartItemQuantity(id, quantity + 1));
  }

  function handleDecrease(id: number, quantity: number) {
    setItems(updateCartItemQuantity(id, quantity - 1));
  }

  function handleRemove(id: number) {
    setItems(removeFromCart(id));
  }

  function handleClearCart() {
    clearCart();
    setItems([]);
  }

  async function handleFinishOrder() {
    try {
      setSubmitting(true);

      const payload = {
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        payer_email: payerEmail,
        payer_document: payerDocument,
      };

      const response = await createOrder(payload);
      clearCart();
      setItems([]);
      toast.success("Pedido realizado com sucesso!");

      if (response.payment.ticket_url) {
        window.location.href = response.payment.ticket_url;
        return;
      }

      toast.error("Pix gerado sem URL de pagamento.");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Nao foi possivel finalizar a compra.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-5 gap-5">
        <div className="w-full p-5 lg:w-[30%] border-2 rounded-2xl flex flex-col gap-5">
          <Label className="flex justify-center text-xl">
            Carrinho vazio
          </Label>
          <Label className="text-gray-500">
            Adicione produtos na pagina principal para visualiza-los aqui.
          </Label>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center px-4 py-6 lg:px-8">
      <section className="w-full max-w-6xl border-2 rounded-2xl p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Label className="text-2xl font-semibold">Carrinho</Label>
          <Button variant="outline" onClick={handleClearCart}>
            Limpar carrinho
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="border-2 rounded-2xl p-4 flex flex-col gap-4 md:flex-row md:items-center"
              >
                <div className="w-full h-40 md:w-36 md:h-36 rounded-xl overflow-hidden border bg-muted/30">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <Label className="text-lg font-semibold">{item.name}</Label>
                  <Label>Preco unitario: R$ {item.price}</Label>
                  <Label>Subtotal: R$ {item.price * item.quantity}</Label>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleDecrease(item.id, item.quantity)}
                    >
                      -
                    </Button>
                    <Label>{item.quantity}</Label>
                    <Button
                      variant="outline"
                      onClick={() => handleIncrease(item.id, item.quantity)}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remover
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <aside className="border-2 rounded-2xl p-5 flex flex-col gap-4 h-fit">
            <Label className="text-xl font-semibold">Resumo</Label>
            <Label>Total de itens: {items.length}</Label>
            <Label className="text-lg">Total: R$ {total}</Label>
            <div className="flex flex-col gap-2">
              <Label>Email para pagamento</Label>
              <Input
                type="email"
                value={payerEmail}
                onChange={(e) => setPayerEmail(e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>CPF do pagador</Label>
              <Input
                value={payerDocument}
                onChange={(e) => setPayerDocument(e.target.value)}
                placeholder="00000000000"
              />
            </div>
            <Button
              variant="outline"
              disabled={submitting}
              onClick={handleFinishOrder}
            >
              {submitting ? "Finalizando..." : "Finalizar compra"}
            </Button>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default PartPage;
