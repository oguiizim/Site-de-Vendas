"use client";

import { useEffect, useState } from "react";
import { getCakes } from "@/api/cake";
import type { Cakes } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  const [cakes, setCakes] = useState<Cakes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCakes() {
      try {
        const data = await getCakes();
        setCakes(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nao foi possivel carregar os produtos.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadCakes();
  }, []);

  return (
    <main className="w-full flex justify-center px-4 py-6 lg:px-8">
      <section className="w-full max-w-7xl border-2 rounded-2xl p-4 lg:p-6">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[240px_1fr]">
          <aside className="border-2 rounded-2xl p-5 flex flex-col gap-5 lg:min-h-[70vh]">
            <Label className="text-2xl font-semibold">Filtros</Label>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Buscar produto</Label>
              <Input placeholder="Ex: bolo de chocolate" />
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-sm text-gray-500">Categorias</Label>
              <Button variant="outline" className="justify-start">
                Tradicionais
              </Button>
              <Button variant="outline" className="justify-start">
                Festivos
              </Button>
              <Button variant="outline" className="justify-start">
                Premium
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-sm text-gray-500">Disponibilidade</Label>
              <Button variant="outline" className="justify-start">
                Disponivel hoje
              </Button>
              <Button variant="outline" className="justify-start">
                Sob encomenda
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-sm text-gray-500">Faixa de preco</Label>
              <Button variant="outline" className="justify-start">
                Ate R$ 50
              </Button>
              <Button variant="outline" className="justify-start">
                R$ 50 a R$ 100
              </Button>
              <Button variant="outline" className="justify-start">
                Acima de R$ 100
              </Button>
            </div>
          </aside>

          <div className="border-2 rounded-2xl p-5 lg:p-6 min-h-[70vh]">
            <div className="flex flex-col gap-2 mb-6">
              <Label className="text-2xl font-semibold">Nossos Produtos</Label>
              <Label className="text-gray-500">
                Tudo na mesma pagina, com rolagem simples.
              </Label>
            </div>

            {loading && (
              <div className="h-full min-h-[40vh] flex items-center justify-center border-2 rounded-2xl">
                <Label>Carregando produtos...</Label>
              </div>
            )}

            {!loading && error && (
              <div className="h-full min-h-[40vh] flex items-center justify-center border-2 rounded-2xl">
                <Label className="text-red-500">{error}</Label>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {cakes.map((cake) => (
                  <article
                    key={cake.id}
                    className="border-2 rounded-2xl p-4 flex flex-col gap-4"
                  >
                    <div className="w-full h-48 rounded-xl overflow-hidden border bg-muted/30">
                      <Image
                        src={cake.image_url}
                        width={200}
                        height={200}
                        alt={cake.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label className="text-lg font-semibold">
                        {cake.name}
                      </Label>
                      <Label className="text-gray-500">{cake.category}</Label>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label>Preco: R$ {cake.price}</Label>
                      <Label>Peso: {cake.weight} g</Label>
                      <Label>Estoque: {cake.stock}</Label>
                      <Label>
                        Disponivel: {cake.avaliable ? "Sim" : "Nao"}
                      </Label>
                    </div>

                    <Button variant="outline" className="mt-auto">
                      Adicionar ao carrinho
                    </Button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
