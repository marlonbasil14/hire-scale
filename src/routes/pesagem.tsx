import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCcw, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Hero } from "@/components/Hero";
import { ResultadoView } from "@/components/ResultadoView";
import { Badge, Button, Card, Field, Input, Select } from "@/components/chlorum";
import { supabase } from "@/integrations/supabase/client";
import { FATORES, calcularResultado } from "@/lib/pesagem";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel de Pesagem de Cargos — Chlorum Solutions" },
      {
        name: "description",
        content:
          "Pré-pesagem de cargos novos da Chlorum Solutions: 8 fatores, pontuação, grade de 1 a 20 e família de cargo.",
      },
      { property: "og:title", content: "Painel de Pesagem de Cargos — Chlorum Solutions" },
      {
        property: "og:description",
        content:
          "Avalie cargos novos pelo método Hay Guide Chart-Profile e obtenha grade, pontos e família de cargo.",
      },
    ],
  }),
  component: NovaAvaliacao,
});

type Identificacao = {
  cargoNome: string;
  diretoriaArea: string;
  reportaA: string;
  jaOcupado: "" | "nao" | "sim";
};

const IDENTIFICACAO_VAZIA: Identificacao = {
  cargoNome: "",
  diretoriaArea: "",
  reportaA: "",
  jaOcupado: "",
};

function NovaAvaliacao() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState<"identificacao" | "questionario" | "resultado">(
    "identificacao",
  );
  const [identificacao, setIdentificacao] = useState<Identificacao>(IDENTIFICACAO_VAZIA);
  const [pergunta, setPergunta] = useState(0);
  const [indices, setIndices] = useState<number[]>(() => FATORES.map(() => 0));
  const [tocados, setTocados] = useState<boolean[]>(() => FATORES.map(() => false));
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const identificacaoValida =
    identificacao.cargoNome.trim() !== "" &&
    identificacao.diretoriaArea.trim() !== "" &&
    identificacao.reportaA.trim() !== "" &&
    identificacao.jaOcupado !== "";

  const resultado = useMemo(() => calcularResultado(indices), [indices]);

  function reiniciar() {
    setIdentificacao(IDENTIFICACAO_VAZIA);
    setIndices(FATORES.map(() => 0));
    setTocados(FATORES.map(() => false));
    setPergunta(0);
    setSalvo(false);
    setEtapa("identificacao");
  }

  async function salvar() {
    setSalvando(true);
    const { error } = await supabase.from("job_evaluations").insert({
      cargo_nome: identificacao.cargoNome.trim(),
      diretoria_area: identificacao.diretoriaArea.trim(),
      reporta_a: identificacao.reportaA.trim(),
      ja_ocupado: identificacao.jaOcupado === "sim",
      respostas: resultado.respostas,
      pontos: Number(resultado.pontos.toFixed(2)),
      grade: resultado.grade,
      faixa_min: resultado.faixaMin,
      faixa_max: resultado.faixaMax,
      familia_cargo: resultado.familiaCargo,
    });
    setSalvando(false);

    if (error) {
      toast.error("Não foi possível salvar a avaliação.", {
        description: error.message,
      });
      return;
    }

    setSalvo(true);
    toast.success("Avaliação salva no histórico.", {
      action: {
        label: "Ver no histórico",
        onClick: () => navigate({ to: "/historico" }),
      },
    });
  }

  const fator = FATORES[pergunta]!;
  const indiceAtual = indices[pergunta] ?? 0;
  const ultima = pergunta === FATORES.length - 1;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <Hero />

      {etapa === "identificacao" && (
        <Card className="space-y-6">
          <div className="space-y-2">
            <Badge>Etapa 1 de 3 · Identificação</Badge>
            <h2 className="text-xl">Identificação do cargo</h2>
            <p className="text-sm text-muted-foreground">
              Todos os campos abaixo são critérios sine qua non para iniciar a
              avaliação.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nome do cargo">
              <Input
                value={identificacao.cargoNome}
                onChange={(e) =>
                  setIdentificacao((s) => ({ ...s, cargoNome: e.target.value }))
                }
                placeholder="Ex.: Analista de dados sênior"
              />
            </Field>
            <Field label="Diretoria / área">
              <Input
                value={identificacao.diretoriaArea}
                onChange={(e) =>
                  setIdentificacao((s) => ({ ...s, diretoriaArea: e.target.value }))
                }
                placeholder="Ex.: Diretoria de Operações"
              />
            </Field>
            <Field label="Reporta-se a — cargo">
              <Input
                value={identificacao.reportaA}
                onChange={(e) =>
                  setIdentificacao((s) => ({ ...s, reportaA: e.target.value }))
                }
                placeholder="Ex.: Gerente de Planejamento"
              />
            </Field>
            <Field label="Este cargo já tem ocupante?">
              <Select
                value={identificacao.jaOcupado}
                onChange={(e) =>
                  setIdentificacao((s) => ({
                    ...s,
                    jaOcupado: e.target.value as Identificacao["jaOcupado"],
                  }))
                }
              >
                <option value="">Selecione</option>
                <option value="nao">Não — é um cargo novo</option>
                <option value="sim">Sim — já existe alguém na função</option>
              </Select>
            </Field>
          </div>

          <div className="flex justify-end">
            <Button
              disabled={!identificacaoValida}
              onClick={() => setEtapa("questionario")}
            >
              Iniciar avaliação
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </Card>
      )}

      {etapa === "questionario" && (
        <Card className="space-y-7">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge>{fator.grupo}</Badge>
              <span className="text-label">
                Pergunta {pergunta + 1} de {FATORES.length}
              </span>
            </div>
            <div className="flex gap-1.5" aria-hidden>
              {FATORES.map((f, i) => (
                <span
                  key={f.key}
                  className={`h-1.5 flex-1 rounded-full ${
                    i <= pergunta ? "bg-primary" : "bg-accent"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl">{fator.titulo}</h2>
            <p className="text-sm text-muted-foreground">{fator.subtitulo}</p>
          </div>

          <div className="space-y-4">
            <input
              type="range"
              className="range-brand"
              min={0}
              max={fator.niveis.length - 1}
              step={1}
              value={indiceAtual}
              aria-label={fator.titulo}
              onChange={(e) => {
                const valor = Number(e.target.value);
                setIndices((s) => s.map((v, i) => (i === pergunta ? valor : v)));
                setTocados((s) => s.map((v, i) => (i === pergunta ? true : v)));
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{fator.niveis[0]}</span>
              <span>{fator.niveis[fator.niveis.length - 1]}</span>
            </div>

            <div className="rounded-2xl border border-accent bg-accent-soft p-5">
              <p className="text-label text-accent-foreground/70">
                Nível {indiceAtual + 1} de {fator.niveis.length}
              </p>
              <p className="mt-1 text-lg font-extrabold text-accent-foreground">
                {fator.niveis[indiceAtual]}
              </p>
              <p className="mt-2 text-sm text-accent-foreground/90">
                {fator.descricoes[indiceAtual]}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                if (pergunta === 0) setEtapa("identificacao");
                else setPergunta((p) => p - 1);
              }}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Voltar
            </Button>
            <Button
              disabled={!tocados[pergunta]}
              onClick={() => {
                if (ultima) setEtapa("resultado");
                else setPergunta((p) => p + 1);
              }}
            >
              {ultima ? "Ver resultado" : "Próxima pergunta"}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </Card>
      )}

      {etapa === "resultado" && (
        <ResultadoView
          data={{
            cargoNome: identificacao.cargoNome,
            diretoriaArea: identificacao.diretoriaArea,
            reportaA: identificacao.reportaA,
            jaOcupado: identificacao.jaOcupado === "sim",
            ...resultado,
          }}
        >
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={reiniciar}>
              <RotateCcw className="size-4" aria-hidden />
              Nova avaliação
            </Button>
            <Button onClick={salvar} disabled={salvando || salvo}>
              <Save className="size-4" aria-hidden />
              {salvo ? "Salvo no histórico" : salvando ? "Salvando…" : "Salvar no histórico"}
            </Button>
          </div>
        </ResultadoView>
      )}
    </div>
  );
}
