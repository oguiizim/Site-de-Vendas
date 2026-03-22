"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";

function Profile() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin" || user?.role === "vendor";

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

      {isAdmin && (
        <div className="w-full p-5 lg:w-[20%] border-2 rounded-2xl flex flex-col gap-5">
          <Label className="flex justify-center text-xl">
            Painel de Administrador
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">Criar produto</Button>
            <Button variant="outline">Editar produto</Button>
            <Button variant="outline">Visualizar produtos</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
