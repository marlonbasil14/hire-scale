import { Check, Copy, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge, Button, Card } from "@/components/chlorum";
import { GaugeGrade } from "@/components/GaugeGrade";
import { FATORES, type Resposta } from "@/lib/pesagem";

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
};

export function ResultadoView({
  data,
  children,
}: {
  data: ResultadoViewData;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-6 print-resultado">
      <Card className="text-center">
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
