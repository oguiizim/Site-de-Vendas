"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import { getMyOrders } from "@/api/order";
import type { UserOrder } from "@/api/types";

function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const isAdmin = user?.role === "admin" || user?.role === "vendor";

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center p-5 gap-5">
      <div className="w-full p-5 lg:w-[20%] border-2 rounded-2xl flex flex-col gap-5">
        <Label className="flex justify-center text-xl">Perfil de Usuario</Label>
        <div className="flex flex-row gap-2">
          <Label>Nome de usuário:</Label>
          <Label className="text-gray-500">{user?.name}</Label>
        </div>
        <div className="flex flex-row gap-2">
          <Label>Função:</Label>
          <Label className="text-gray-500">{user?.role}</Label>
        </div>
      </div>

      <div className="w-full p-5 lg:w-[40%] border-2 rounded-2xl flex flex-col gap-5">
        <Label className="flex justify-center text-xl">Pedidos anteriores</Label>

        {loadingOrders && (
          <Label className="text-gray-500">Carregando pedidos...</Label>
        )}

        {!loadingOrders && orders.length === 0 && (
          <Label className="text-gray-500">Voce ainda nao possui pedidos.</Label>
        )}

        {!loadingOrders &&
          orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-2xl p-4 flex flex-col gap-3"
            >
              <div className="flex flex-col gap-1">
                <Label>Pedido #{order.id}</Label>
                <Label className="text-gray-500">
                  Status: {order.status}
                </Label>
                <Label className="text-gray-500">
                  Pagamento: {order.payment_status}
                </Label>
                <Label className="text-gray-500">
                  Total: R$ {order.total_amount}
                </Label>
              </div>

              <div className="flex flex-col gap-2">
                {order.items.map((item) => (
                  <div key={item.id} className="border rounded-xl p-3">
                    <Label>{item.cake_name}</Label>
                    <Label className="text-gray-500">
                      Qtd: {item.quantity}
                    </Label>
                    <Label className="text-gray-500">
                      Subtotal: R$ {item.subtotal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {isAdmin && (
        <div className="w-full p-5 lg:w-[20%] border-2 rounded-2xl flex flex-col gap-5">
          <Label className="flex justify-center text-xl">
            Painel de Administrador
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">
              <Link href="/table/create">Criar produto</Link>
            </Button>
            <Button variant="outline">
              <Link href="/table/edit">Editar produto</Link>
            </Button>
            <Button variant="outline">
              <Link href="/table">Visualizar produtos</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
