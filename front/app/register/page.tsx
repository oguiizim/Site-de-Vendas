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

function Register() {
  const router = useRouter();
  const { register, loading } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setCPassword] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (name == null || password == null || confirm == null) {
      setError("Todos os campos devem ser preenchidos!");
    }

    if (password != confirm) {
      setError("As senhas não coincidem!");
    }

    try {
      await register({ name, password, key });
      toast.success("Usuario criado com sucesso!");
      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao fazer o registro.");
      }
    }
  }

  return (
    <main className="flex w-full min-h-100 lg:min-h-220 justify-center items-center p-5">
      <form
        onSubmit={handleSubmit}
        className="lg:w-[30%] w-full flex flex-col items-center gap-3 border-2 rounded-3xl p-6"
      >
        <Label className="text-2xl font-semibold">Registrar</Label>
        <Label className="w-full flex justify-start">Crie sua conta!</Label>

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
          <Field>
            <FieldLabel>Confirme sua senha:</FieldLabel>
            <Input
              type="password"
              placeholder="Confirme sua senha"
              className="w-full"
              value={confirm}
              onChange={(e) => setCPassword(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Chave de administrador:</FieldLabel>
            <Input
              type="password"
              placeholder="Chave de segurança"
              className="w-full"
              value={key}
              onChange={(e) => setKey(e.target.value)}
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
          {loading ? "Criando..." : "Criar conta"}
        </Button>
        <div className="flex items-center">
          <Label className="text-md">Ja tem uma conta?</Label>
          <Button variant="link" className="cursor-pointer text-md" asChild>
            <Link href="/login">Faça login</Link>
          </Button>
        </div>
      </form>
    </main>
  );
}

export default Register;
