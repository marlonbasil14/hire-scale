import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { ResultadoView } from "@/components/ResultadoView";
import { Badge, Button, Card, Field, Input, Select } from "@/components/chlorum";
import { supabase } from "@/integrations/supabase/client";
import { lerColaborador, type Colaborador } from "@/lib/colaborador";
import {
  FATORES,
  ROTULO_REFINAMENTO,
  SELECAO_PADRAO,
  calcularResultado,
  temRefinamento,
  type Refinamento,
  type Selecao,
} from "@/lib/pesagem";

export const Route = createFileRoute("/pesagem")({
  head: () => ({
    meta: [
      { title: "Etapas da pesagem de cargos — Chlorum Solutions" },
      {
        name: "description",
        content:
          "Percorra as três etapas da pré-pesagem: identificação do cargo, questionário de 8 fatores e resultado com grade de 1 a 20.",
      },
      { property: "og:title", content: "Etapas da pesagem de cargos — Chlorum Solutions" },
      {
        property: "og:description",
        content:
          "Identificação, questionário Hay Guide Chart-Profile e resultado com pontos, grade e família de cargo.",
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

const ETAPAS = [
  {
    titulo: "1 · Identificação do cargo",
    texto:
      "Informe nome do cargo, diretoria/área, a quem se reporta e se já existe ocupante. Todos são critérios sine qua non.",
  },
  {
    titulo: "2 · Questionário de 8 fatores",
    texto:
      "Responda um fator por tela, escolhendo o nível que melhor descreve o cargo e, quando útil, refinando entre abaixo, típica ou acima da faixa.",
  },
  {
    titulo: "3 · Resultado e histórico",
    texto:
      "Veja pontos, grade de 1 a 20 e família de cargo. Salve no histórico para consultar e comparar depois.",
  },
];

function NovaAvaliacao() {
  const navigate = useNavigate();
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [etapa, setEtapa] = useState<"identificacao" | "questionario" | "resultado">(
    "identificacao",
  );
  const [identificacao, setIdentificacao] = useState<Identificacao>(IDENTIFICACAO_VAZIA);
  const [pergunta, setPergunta] = useState(0);
  const [selecoes, setSelecoes] = useState<Selecao[]>(() =>
    FATORES.map(() => ({ ...SELECAO_PADRAO })),
  );
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    const c = lerColaborador();
    if (!c) {
      navigate({ to: "/", replace: true });
      return;
    }
    setColaborador(c);
  }, [navigate]);


  const identificacaoValida =
    identificacao.cargoNome.trim() !== "" &&
    identificacao.diretoriaArea.trim() !== "" &&
    identificacao.reportaA.trim() !== "" &&
    identificacao.jaOcupado !== "";

  const resultado = useMemo(() => calcularResultado(selecoes), [selecoes]);

  function reiniciar() {
    setIdentificacao(IDENTIFICACAO_VAZIA);
    setSelecoes(FATORES.map(() => ({ ...SELECAO_PADRAO })));
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
  const selecaoAtual = selecoes[pergunta] ?? SELECAO_PADRAO;
  const refinavel = temRefinamento(fator);

  function atualizarSelecao(selecao: Selecao) {
    setSelecoes((s) => s.map((v, i) => (i === pergunta ? selecao : v)));
  }

  const ultima = pergunta === FATORES.length - 1;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        titulo="Como funciona a pesagem"
        lead={
          colaborador
            ? `Olá, ${colaborador.nome.split(" ")[0]}. A pré-pesagem acontece em três etapas guiadas — leve cerca de cinco minutos por cargo.`
            : "A pré-pesagem acontece em três etapas guiadas — leve cerca de cinco minutos por cargo."
        }
      />

      <div className="grid gap-4 sm:grid-cols-3" data-nao-imprimir>
        {ETAPAS.map((e) => (
          <Card key={e.titulo} className="space-y-2">
            <p className="text-label text-primary">{e.titulo}</p>
            <p className="text-sm font-light leading-relaxed text-muted-foreground">
              {e.texto}
            </p>
          </Card>
        ))}
      </div>



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
            <div className="grid gap-3 sm:grid-cols-2">
              {fator.niveis.map((nivel, i) => {
                const ativo = selecaoAtual.indice === i;
                return (
                  <div
                    key={nivel}
                    className={`rounded-2xl border p-4 transition-[background-color,border-color] duration-200 ease-out ${
                      ativo
                        ? "border-primary bg-accent-soft"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <button
                      type="button"
                      aria-pressed={ativo}
                      className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring w-full rounded-lg text-left"
                      onClick={() =>
                        atualizarSelecao({ indice: i, refinamento: "tipica" })
                      }
                    >
                      <span className="text-eyebrow text-muted-foreground">
                        Nível {i + 1}
                      </span>
                      <span
                        className={`mt-1 block text-sm font-extrabold ${
                          ativo ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {nivel}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-xs font-light leading-relaxed text-muted-foreground">
                        {fator.descricoes[i]}
                      </span>
                    </button>

                    {ativo && refinavel && (
                      <div
                        className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-accent p-1"
                        role="group"
                        aria-label="Refinamento do nível"
                      >
                        {(["abaixo", "tipica", "acima"] as Refinamento[]).map((r) => (
                          <button
                            key={r}
                            type="button"
                            aria-pressed={selecaoAtual.refinamento === r}
                            onClick={() =>
                              atualizarSelecao({ indice: i, refinamento: r })
                            }
                            className={`focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring rounded-full px-2 py-1.5 text-[11px] font-bold transition-colors duration-150 ease-out ${
                              selecaoAtual.refinamento === r
                                ? "bg-primary text-primary-foreground"
                                : "text-accent-foreground hover:bg-card"
                            }`}
                          >
                            {ROTULO_REFINAMENTO[r]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-accent bg-accent-soft p-5">
              {selecaoAtual.indice < 0 ? (
                <p className="text-sm font-light text-accent-foreground/90">
                  Selecione o nível que melhor descreve o cargo para ver a descrição
                  completa.
                </p>
              ) : (
                <>
                  <p className="text-label text-accent-foreground/70">
                    Nível {selecaoAtual.indice + 1} de {fator.niveis.length}
                    {refinavel ? ` · ${ROTULO_REFINAMENTO[selecaoAtual.refinamento]}` : ""}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-accent-foreground">
                    {fator.niveis[selecaoAtual.indice]}
                  </p>
                  <p className="mt-2 text-sm font-light text-accent-foreground/90">
                    {fator.descricoes[selecaoAtual.indice]}
                  </p>
                </>
              )}
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
              disabled={selecaoAtual.indice < 0}
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
            textoFluido,
            salarioPiso: faixaSalarial.status === "ok" ? Number(faixaSalarial.piso_80) : null,
            salarioMediana:
              faixaSalarial.status === "ok" ? Number(faixaSalarial.mediana) : null,
            salarioTeto:
              faixaSalarial.status === "ok" ? Number(faixaSalarial.teto_120) : null,
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
