import { Check, Copy, FileDown, Info } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Badge, Button, Card } from "@/components/chlorum";
import { GaugeGrade } from "@/components/GaugeGrade";
import { FATORES, type Resposta } from "@/lib/pesagem";
import { formatarReal } from "@/lib/salario";

export type ResultadoViewData = {
  cargoNome: string;
  diretoriaArea: string;
  reportaA: string;
  jaOcupado: boolean;
  pontos: number;
  grade: number;
  faixaMin: number;
  faixaMax: number;
  familiaCargo: string;
  respostas: Resposta[];
  textoFluido?: string | undefined;
  salarioPiso?: number | null;
  salarioMediana?: number | null;
  salarioTeto?: number | null;
};

export function ResultadoView({
  data,
  children,
}: {
  data: ResultadoViewData;
  children?: React.ReactNode;
}) {
  const [copiado, setCopiado] = useState(false);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const quadroRef = useRef<HTMLDivElement>(null);

  async function gerarPdf() {
    const alvo = quadroRef.current;
    if (!alvo) return;
    setGerandoPdf(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(alvo, {
        scale: 2,
        backgroundColor: "#ffffff",
        ignoreElements: (el) => el.hasAttribute("data-nao-imprimir"),
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const margem = 32;
      const larguraUtil = pdf.internal.pageSize.getWidth() - margem * 2;
      const altura = (canvas.height / canvas.width) * larguraUtil;
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        margem,
        margem,
        larguraUtil,
        altura,
      );
      const nome = data.cargoNome.trim().replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase();
      pdf.save(`pre-pesagem-${nome || "cargo"}.pdf`);
      toast.success("PDF gerado com sucesso.");
    } catch {
      toast.error("Não foi possível gerar o PDF.");
    } finally {
      setGerandoPdf(false);
    }
  }

  async function copiar() {
    if (!data.textoFluido) return;
    try {
      await navigator.clipboard.writeText(data.textoFluido);
      setCopiado(true);
      toast.success("Texto copiado para a área de transferência.");
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o texto.");
    }
  }

  return (
    <div className="space-y-6 print-resultado">
      <Card className="text-center" ref={quadroRef}>
        <Badge>Resultado da pré-pesagem</Badge>
        <h2 className="mt-4 text-2xl sm:text-3xl">{data.cargoNome}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {data.diretoriaArea} · reporta-se a {data.reportaA} ·{" "}
          {data.jaOcupado ? "cargo já ocupado" : "cargo novo"}
        </p>

        <div className="mt-6 flex justify-center">
          <GaugeGrade grade={data.grade} />
        </div>

        <div className="mt-2">
          <p className="text-label">Pontuação total estimada</p>
          <p className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl">
            {Math.round(data.pontos).toLocaleString("pt-BR")}
            <span className="ml-2 align-baseline text-lg font-bold text-muted-foreground">
              pts
            </span>
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Badge>Grade {data.grade}</Badge>
          <Badge>
            Faixa {data.faixaMin}–{data.faixaMax} pontos
          </Badge>
          <Badge>{data.familiaCargo}</Badge>
        </div>

        {data.textoFluido ? (
          <div className="mt-6 rounded-2xl border border-border bg-secondary p-5 text-left">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-label">Resumo em texto corrido</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => void copiar()}
                data-nao-imprimir
              >
                {copiado ? (
                  <Check className="size-4" aria-hidden />
                ) : (
                  <Copy className="size-4" aria-hidden />
                )}
                {copiado ? "Copiado" : "Copiar texto"}
              </Button>
            </div>
            <p className="mt-3 text-sm font-light leading-relaxed text-foreground">
              {data.textoFluido}
            </p>
            {data.salarioMediana != null ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Salário-base mensal · piso {formatarReal(Number(data.salarioPiso ?? 0))} ·
                mediana {formatarReal(Number(data.salarioMediana))} · teto{" "}
                {formatarReal(Number(data.salarioTeto ?? 0))}
              </p>
            ) : null}
          </div>
        ) : null}
      </Card>

      <Card>
        <h3 className="text-lg">Respostas informadas</h3>
        <ul className="mt-4 divide-y divide-border">
          {data.respostas.map((resposta, i) => (
            <li
              key={resposta.key}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
            >
              <div>
                <p className="text-sm font-bold">{resposta.fator}</p>
                <p className="text-xs text-muted-foreground">
                  {FATORES[i]?.grupo}
                </p>
              </div>
              <p className="text-sm text-accent-foreground">
                {resposta.nome ?? resposta.nivel}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <div className="rounded-2xl border border-accent bg-accent-soft p-6">
        <div className="flex gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-bold text-accent-foreground">
              Esta é uma pré-pesagem calibrada estatisticamente
            </p>
            <p className="text-sm text-accent-foreground/90">
              O modelo simplificado tem precisão média de aproximadamente 97,6% em
              relação à pesagem completa. Casos-fronteira entre grades devem ser
              validados no processo oficial de avaliação antes de comunicar qualquer
              banda salarial ao gestor ou ao candidato.
            </p>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
