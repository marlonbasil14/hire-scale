import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { ResultadoView } from "@/components/ResultadoView";
import { Badge, Button, Card, Field, Input, Select } from "@/components/chlorum";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Resposta } from "@/lib/pesagem";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico de avaliações de cargos — Chlorum Solutions" },
      {
        name: "description",
        content:
          "Consulte, filtre e revise todas as pré-pesagens de cargos já registradas pelo time de Pessoas e Cultura.",
      },
      {
        property: "og:title",
        content: "Histórico de avaliações de cargos — Chlorum Solutions",
      },
      {
        property: "og:description",
        content:
          "Todas as pesagens registradas, com grade, pontos, família de cargo e respostas detalhadas.",
      },
    ],
  }),
  component: Historico,
});

type Avaliacao = {
  id: string;
  cargo_nome: string;
  diretoria_area: string;
  reporta_a: string;
  ja_ocupado: boolean;
  respostas: Resposta[];
  pontos: number;
  grade: number;
  faixa_min: number;
  faixa_max: number;
  familia_cargo: string;
  criado_em: string;
};

const FAIXAS_GRADE = [
  { valor: "", label: "Todos os grades" },
  { valor: "1-5", label: "Grade 1 a 5" },
  { valor: "6-10", label: "Grade 6 a 10" },
  { valor: "11-15", label: "Grade 11 a 15" },
  { valor: "16-20", label: "Grade 16 a 20" },
];

function Historico() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [area, setArea] = useState("");
  const [faixa, setFaixa] = useState("");
  const [detalhe, setDetalhe] = useState<Avaliacao | null>(null);
  const [paraExcluir, setParaExcluir] = useState<Avaliacao | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["job_evaluations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_evaluations")
        .select("*")
        .order("criado_em", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Avaliacao[];
    },
  });

  const areas = useMemo(
    () => Array.from(new Set((data ?? []).map((a) => a.diretoria_area))).sort(),
    [data],
  );

  const filtradas = useMemo(() => {
    const [min, max] = faixa ? faixa.split("-").map(Number) : [0, 99];
    return (data ?? []).filter(
      (a) =>
        a.cargo_nome.toLowerCase().includes(busca.trim().toLowerCase()) &&
        (area === "" || a.diretoria_area === area) &&
        a.grade >= (min ?? 0) &&
        a.grade <= (max ?? 99),
    );
  }, [data, busca, area, faixa]);

  async function excluir(avaliacao: Avaliacao) {
    const { error } = await supabase
      .from("job_evaluations")
      .delete()
      .eq("id", avaliacao.id);
    if (error) {
      toast.error("Não foi possível excluir o registro.", {
        description: error.message,
      });
      return;
    }
    toast.success("Registro excluído do histórico.");
    if (detalhe?.id === avaliacao.id) setDetalhe(null);
    await queryClient.invalidateQueries({ queryKey: ["job_evaluations"] });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        titulo="Histórico de avaliações"
        lead="Todas as pré-pesagens registradas pelo time de Pessoas e Cultura, com pontuação, grade e família de cargo."
      />

      {detalhe ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge>Somente leitura</Badge>
            <Button variant="secondary" onClick={() => setDetalhe(null)}>
              <X className="size-4" aria-hidden />
              Voltar ao histórico
            </Button>
          </div>
          <ResultadoView
            data={{
              cargoNome: detalhe.cargo_nome,
              diretoriaArea: detalhe.diretoria_area,
              reportaA: detalhe.reporta_a,
              jaOcupado: detalhe.ja_ocupado,
              pontos: Number(detalhe.pontos),
              grade: detalhe.grade,
              faixaMin: detalhe.faixa_min,
              faixaMax: detalhe.faixa_max,
              familiaCargo: detalhe.familia_cargo,
              respostas: detalhe.respostas ?? [],
            }}
          >
            <div className="flex justify-end">
              <Button variant="danger" onClick={() => setParaExcluir(detalhe)}>
                <Trash2 className="size-4" aria-hidden />
                Excluir registro
              </Button>
            </div>
          </ResultadoView>
        </div>
      ) : (
        <>
          <Card className="grid gap-5 sm:grid-cols-3">
            <Field label="Buscar por nome do cargo">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  className="pl-9"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Ex.: analista"
                />
              </div>
            </Field>
            <Field label="Diretoria / área">
              <Select value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="">Todas as áreas</option>
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Faixa de grade">
              <Select value={faixa} onChange={(e) => setFaixa(e.target.value)}>
                {FAIXAS_GRADE.map((f) => (
                  <option key={f.valor} value={f.valor}>
                    {f.label}
                  </option>
                ))}
              </Select>
            </Field>
          </Card>

          <Card className="p-0 sm:p-0">
            {isLoading ? (
              <p className="p-8 text-sm text-muted-foreground">Carregando avaliações…</p>
            ) : error ? (
              <p className="p-8 text-sm text-destructive">
                Não foi possível carregar o histórico.
              </p>
            ) : filtradas.length === 0 ? (
              <p className="p-8 text-sm text-muted-foreground">
                Nenhuma avaliação encontrada com os filtros atuais.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[840px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {[
                        "Cargo",
                        "Diretoria / área",
                        "Grade",
                        "Pontos",
                        "Família de cargo",
                        "Status",
                        "Data",
                        "",
                      ].map((h) => (
                        <th key={h} className="text-label px-4 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtradas.map((a) => (
                      <tr
                        key={a.id}
                        onClick={() => setDetalhe(a)}
                        className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-secondary"
                      >
                        <td className="px-4 py-3 font-bold">{a.cargo_nome}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {a.diretoria_area}
                        </td>
                        <td className="px-4 py-3">
                          <Badge>Grade {a.grade}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          {Math.round(Number(a.pontos)).toLocaleString("pt-BR")}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {a.familia_cargo}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-eyebrow rounded-full px-2.5 py-1 ${
                              a.ja_ocupado
                                ? "bg-warning/15 text-warning"
                                : "bg-success/15 text-success"
                            }`}
                          >
                            {a.ja_ocupado ? "Existente" : "Novo"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(a.criado_em).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            aria-label={`Excluir avaliação de ${a.cargo_nome}`}
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setParaExcluir(a);
                            }}
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      <AlertDialog
        open={paraExcluir !== null}
        onOpenChange={(aberto) => !aberto && setParaExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir esta avaliação?</AlertDialogTitle>
            <AlertDialogDescription>
              O registro de “{paraExcluir?.cargo_nome}” será removido do histórico de
              forma permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (paraExcluir) void excluir(paraExcluir);
                setParaExcluir(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
