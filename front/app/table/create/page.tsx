"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCakes } from "@/api/cake";
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

function CreateCake() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [avaliable, setAvaliable] = useState("true");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      name == null ||
      price == null ||
      weight == null ||
      stock == null ||
      category == null ||
      avaliable == null ||
      imageUrl == null
    ) {
      toast.error("Preencha todos os campos!");
    }
    try {
      await createCakes({
        name,
        price: Number(price),
        weight: Number(weight),
        stock: Number(stock),
        category,
        avaliable: avaliable === "true",
        image_url: imageUrl,
      });

      toast.success("Bolo criado com sucesso!");
      router.push("/table");
    } catch (err) {
      toast.error("Nao foi possivel criar o bolo.");
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-5 gap-5">
        <div className="w-full p-5 lg:w-[20%] border-2 rounded-2xl flex flex-col gap-5">
          <Label className="flex justify-center text-xl">Acesso restrito</Label>
          <Label className="text-gray-500">
            Apenas administradores podem criar bolos.
          </Label>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-5 gap-5">
      <form
        onSubmit={handleSubmit}
        className="w-full p-5 lg:w-[20%] border-2 rounded-2xl flex flex-col gap-5"
      >
        <Label className="flex justify-center text-xl">Criar Bolo</Label>

        <div className="flex flex-col gap-2">
          <Label>Nome do bolo:</Label>
          <Input
            placeholder="Bolo de chocolate"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Preço (R$):</Label>
          <Input
            placeholder="10.99"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Peso (G):</Label>
          <Input
            placeholder="500"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Estoque:</Label>
          <Input
            placeholder="150"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Categoria:</Label>
          <Input
            placeholder="Bolos"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>URL da imagem:</Label>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/cakes/chocolate.jpg"
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

        <Button type="submit" variant="outline" disabled={loading}>
          {loading ? "Criando..." : "Criar bolo"}
        </Button>
      </form>
    </div>
  );
}

export default CreateCake;
