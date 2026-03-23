"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getCakes } from "@/api/cake";
import { addToCart } from "@/api/cart";
import type { Cakes } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function HomeContent() {
  const searchParams = useSearchParams();
  const [cakes, setCakes] = useState<Cakes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchTerm(query);
  }, [searchParams]);

  const categories = useMemo(() => {
    return [...new Set(cakes.map((cake) => cake.category))];
  }, [cakes]);

  const filteredCakes = useMemo(() => {
    return cakes.filter((cake) => {
      const matchesName = cake.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || cake.category === selectedCategory;

      return matchesName && matchesCategory;
    });
  }, [cakes, searchTerm, selectedCategory]);

  function handleAddToCart(cake: Cakes) {
    addToCart(cake);
    toast.success("Produto adicionado ao carrinho!");
  }

  return (
    <main className="w-full flex justify-center px-4 py-6 lg:px-8">
      <section className="w-full max-w-7xl border-2 rounded-2xl p-4 lg:p-6">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[240px_1fr]">
          <aside className="border-2 rounded-2xl p-5 flex flex-col gap-5 lg:min-h-[70vh]">
            <Label className="text-2xl font-semibold">Filtros</Label>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-500">Buscar produto</Label>
              <Input
                placeholder="Ex: bolo de chocolate"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-sm text-gray-500">Categorias</Label>
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setSelectedCategory("all")}
              >
                Todas
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className="justify-start"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-2 rounded-2xl p-4 flex flex-col gap-4"
                  >
                    <Skeleton className="w-full h-48 rounded-xl" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-2/5" />
                    </div>
                    <Skeleton className="h-8 w-full mt-auto rounded-lg" />
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="h-full min-h-[40vh] flex items-center justify-center border-2 rounded-2xl">
                <Label className="text-red-500">{error}</Label>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredCakes.map((cake) => (
                  <article
                    key={cake.id}
                    className="border-2 rounded-2xl p-4 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-foreground/30"
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

                    <Button
                      variant="outline"
                      className="mt-auto transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-foreground hover:text-background"
                      onClick={() => handleAddToCart(cake)}
                    >
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

export default function Home() {
  return (
    <Suspense fallback={<main className="w-full flex justify-center px-4 py-6 lg:px-8" />}>
      <HomeContent />
    </Suspense>
  );
}
