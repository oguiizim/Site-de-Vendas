"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { editCake, getCakeById } from "@/api/cake";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function EditCakeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [avaliable, setAvaliable] = useState("true");
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";
  const cakeId = Number(searchParams.get("id"));

  useEffect(() => {
    async function loadCake() {
      if (!cakeId || Number.isNaN(cakeId)) {
        setError("ID do bolo invalido.");
        setPageLoading(false);
        return;
      }

      try {
        const cake = await getCakeById(cakeId);
        setName(cake.name);
        setPrice(String(cake.price));
        setWeight(String(cake.weight));
        setStock(String(cake.stock));
        setCategory(cake.category);
        setImageUrl(cake.image_url);
        setAvaliable(cake.avaliable ? "true" : "false");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nao foi possivel carregar o bolo.");
        }
      } finally {
        setPageLoading(false);
      }
    }

    if (!loading) {
      loadCake();
    }
  }, [cakeId, loading]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await editCake(cakeId, {
        name,
        price: Number(price),
        weight: Number(weight),
        stock: Number(stock),
        category,
        avaliable: avaliable === "true",
        image_url: imageUrl,
      });

      toast.success("Bolo atualizado com sucesso!");
      router.push("/table");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Nao foi possivel editar o bolo.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!loading && !isAdmin) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-5 gap-5">
        <div className="w-full p-5 lg:w-[20%] border-2 rounded-2xl flex flex-col gap-5">
          <Label className="flex justify-center text-xl">Acesso restrito</Label>
          <Label className="text-gray-500">
            Apenas administradores podem editar bolos.
          </Label>
        </div>
      </div>
    );
  }

  if (loading || pageLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-5">
        <Label>Carregando bolo...</Label>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-5 gap-5">
      <form
        onSubmit={handleSubmit}
        className="w-full p-5 lg:w-[20%] border-2 rounded-2xl flex flex-col gap-5"
      >
        <Label className="flex justify-center text-xl">Editar Bolo</Label>

        <div className="flex flex-col gap-2">
          <Label>Nome do bolo:</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Preco:</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Peso:</Label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Estoque:</Label>
          <Input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Categoria:</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>URL da imagem:</Label>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Disponivel:</Label>
          <Select value={avaliable} onValueChange={setAvaliable}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a disponibilidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Nao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <Label className="text-red-500">{error}</Label>}

        <div className="flex gap-2">
          <Button type="submit" variant="outline" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/table")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function EditCake() {
  return (
    <Suspense fallback={<div className="w-full flex flex-col items-center justify-center p-5" />}>
      <EditCakeContent />
    </Suspense>
  );
}
