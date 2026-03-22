"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      await login({ name, password });
      toast.success("Usuario logado com sucesso!");
      router.push("/");
    } catch (err) {
      toast.error("Erro ao fazer login!");
    }
  }

  return (
    <main className="flex w-full min-h-100 lg:min-h-220 justify-center items-center p-5">
      <form
        onSubmit={handleSubmit}
        className="lg:w-[30%] w-full flex flex-col items-center gap-3 border-2 rounded-3xl p-6"
      >
        <Label className="text-2xl font-semibold">Login</Label>
        <Label className="w-full flex justify-start">
          Faça login para ter acesso a novas funcionalidades!
        </Label>

        <FieldGroup className="gap-2 py-2">
          <Field>
            <FieldLabel>Usuario:</FieldLabel>
            <Input
              type="text"
              placeholder="Nome"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Senha:</FieldLabel>
            <Input
              type="password"
              placeholder="Senha"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </FieldGroup>

        {error && <p>{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          variant="outline"
          className="cursor-pointer"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
        <div className="flex items-center">
          <Label className="text-md">Não tem uma conta?</Label>
          <Button variant="link" className="cursor-pointer text-md" asChild>
            <Link href="/register">Registre-se</Link>
          </Button>
        </div>
      </form>
    </main>
  );
}
