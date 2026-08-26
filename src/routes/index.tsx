import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { BrandLockup, BrandParceria } from "@/components/BrandLockup";
import { Wordmark } from "@/components/Wordmark";
import { Button, Field, Input } from "@/components/chlorum";
import { salvarColaborador } from "@/lib/colaborador";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel de Pesagem de Cargos — Gente e Gestão" },
      {
        name: "description",
        content:
          "Identifique-se para acessar o painel de pré-pesagem de cargos de Gente e Gestão: 8 fatores, pontuação, grade de 1 a 20 e família de cargo.",
      },
      { property: "og:title", content: "Painel de Pesagem de Cargos — Gente e Gestão" },
      {
        property: "og:description",
        content:
          "Avalie cargos novos pelo método Hay Guide Chart-Profile e obtenha grade, pontos e família de cargo.",
      },
    ],
  }),
  component: HeroPage,
});

function HeroPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");

  const valido =
    nome.trim().length > 2 && /.+@.+\..+/.test(email.trim()) && area.trim() !== "";

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido) return;
    salvarColaborador({
      nome: nome.trim(),
      email: email.trim(),
      area: area.trim(),
    });
    navigate({ to: "/pesagem" });
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="card-surface w-full max-w-xl px-6 py-10 text-center sm:px-12 sm:py-12">
        <div className="flex flex-col items-center gap-6">
          <BrandLockup variante="gestao" className="text-[1.7rem]" />
          <BrandParceria somenteParceiro className="text-sm" />

          <h1 className="leading-none">
            <Wordmark className="text-3xl sm:text-4xl" />
          </h1>

          <div className="space-y-3">
            <p className="text-base font-light leading-relaxed text-muted-foreground">
              Este é o painel de pesagem de cargos. Ele aplica o método Hay Guide
              Chart-Profile em oito fatores e entrega, em minutos, a pontuação
              estimada, a grade de 1 a 20 e a família de cargo correspondente.
            </p>
            <p className="text-sm font-light leading-relaxed text-muted-foreground/80">
              Identifique-se para começar. Em seguida você verá as etapas da
              pesagem e poderá salvar cada avaliação no histórico.
            </p>
          </div>

          <form onSubmit={entrar} className="w-full space-y-5 text-left">
            <Field label="Nome completo">
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Marlon Batista da Silva"
                autoComplete="name"
              />
            </Field>
            <Field label="E-mail corporativo">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@chlorum.com.br"
                autoComplete="email"
              />
            </Field>
            <Field label="Área / diretoria">
              <Input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Ex.: Pessoas e Cultura"
              />
            </Field>

            <Button type="submit" className="w-full justify-center" disabled={!valido}>
              Entrar
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </form>

          <p className="text-xs font-light text-muted-foreground/70">
            Uso interno Gente e Gestão · Os dados informados servem apenas para
            registrar quem realizou a pré-pesagem.
          </p>
        </div>
      </div>
    </div>
  );
}
