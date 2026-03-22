"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCake, getCakes } from "@/api/cake";
import type { Cakes } from "@/api/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function Table() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [cakes, setCakes] = useState<Cakes[]>([]);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function loadCakes() {
      try {
        const data = await getCakes();
        setCakes(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nao foi possivel buscar os bolos.");
        }
      } finally {
        setPageLoading(false);
      }
    }

    loadCakes();
  }, []);

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      await deleteCake(id);
      setCakes((current) => current.filter((cake) => cake.id !== id));
      toast.success("Bolo deletado com sucesso!");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Nao foi possivel deletar o bolo.");
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (!loading && !isAdmin) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-5 gap-5">
        <div className="w-full p-5 lg:w-[30%] border-2 rounded-2xl flex flex-col gap-5">
          <Label className="flex justify-center text-xl">Acesso restrito</Label>
          <Label className="text-gray-500">
            Apenas administradores podem acessar esta tabela.
          </Label>
        </div>
      </div>
    );
  }

  if (loading || pageLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-5">
        <Label>Carregando bolos...</Label>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-5 gap-5">
      <div className="w-full max-w-7xl border-2 rounded-2xl p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Label className="text-xl">Tabela de Bolos</Label>
          <Button variant="outline" asChild>
            <Link href="/table/create">Criar bolo</Link>
          </Button>
        </div>

        {error && <Label className="text-red-500">{error}</Label>}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Preço</th>
                <th className="p-3 text-left">Peso</th>
                <th className="p-3 text-left">Estoque</th>
                <th className="p-3 text-left">Categoria</th>
                <th className="p-3 text-left">Disponível</th>
                <th className="p-3 text-left">Imagem</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cakes.map((cake) => (
                <tr key={cake.id} className="border-b">
                  <td className="p-3">{cake.id}</td>
                  <td className="p-3">{cake.name}</td>
                  <td className="p-3">{cake.price}</td>
                  <td className="p-3">{cake.weight}</td>
                  <td className="p-3">{cake.stock}</td>
                  <td className="p-3">{cake.category}</td>
                  <td className="p-3">{cake.avaliable ? "Sim" : "Nao"}</td>
                  <td className="p-3">{cake.image_url}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/table/edit?id=${cake.id}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={deletingId === cake.id}
                        onClick={() => handleDelete(cake.id)}
                      >
                        {deletingId === cake.id ? "Deletando..." : "Deletar"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
