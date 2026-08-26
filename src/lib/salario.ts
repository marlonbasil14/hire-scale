export type TabelaSalarialRow = {
  grade: number;
  nivel_nome: string;
  piso_80: number | null;
  p90: number | null;
  mediana: number;
  p110: number | null;
  teto_120: number | null;
  tabela_origem: string;
};

export type FaixaSalarial =
  | ({ status: "ok" } & TabelaSalarialRow)
  | { status: "requer_confirmacao"; mensagem: string }
  | { status: "nao_encontrado" };

export function formatarReal(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function buscarFaixaSalarial(
  grade: number,
  tabela: TabelaSalarialRow[],
): FaixaSalarial {
  // Grades 19 e 20 (C-Level) exigem confirmação manual: a Tabela Salarial 2026
  // tem 4 sub-grades executivos (19–22) contra 2 do modelo de pesagem (19–20).
  if (grade === 19 || grade === 20) {
    return {
      status: "requer_confirmacao",
      mensagem:
        "Cargo na faixa C-Level. A Tabela Salarial 2026 tem 4 sub-grades " +
        "executivos (19 a 22) — confirme com a Diretoria de Gente e Gestão " +
        "qual sub-grade se aplica antes de comunicar a faixa salarial.",
    };
  }

  const row = tabela.find((r) => r.grade === grade);
  if (!row) return { status: "nao_encontrado" };
  return { status: "ok", ...row };
}

export function gerarTextoFluido(input: {
  cargoNome: string;
  diretoriaArea: string;
  jaOcupado: boolean;
  pontos: number;
  grade: number;
  faixaMin: number;
  faixaMax: number;
  familiaCargo: string;
  faixaSalarial: FaixaSalarial;
}) {
  const situacao = input.jaOcupado ? "cargo já ocupado" : "cargo novo, sem ocupante";

  let paragrafoSalarial: string;
  if (input.faixaSalarial.status === "ok") {
    const f = input.faixaSalarial;
    paragrafoSalarial =
      `Segundo a Tabela Salarial Chlorum 2026 (Corporativo), o Grade ${input.grade} ` +
      `prevê salário-base mensal com piso de ${formatarReal(Number(f.piso_80 ?? f.mediana))} (80% da mediana), ` +
      `mediana de ${formatarReal(Number(f.mediana))} e teto de ${formatarReal(Number(f.teto_120 ?? f.mediana))} ` +
      `(120% da mediana).`;
  } else if (input.faixaSalarial.status === "requer_confirmacao") {
    paragrafoSalarial = input.faixaSalarial.mensagem;
  } else {
    paragrafoSalarial =
      "Faixa salarial não localizada na Tabela Salarial 2026 para este grade.";
  }

  return (
    `O cargo de ${input.cargoNome} (${input.diretoriaArea}), avaliado como ${situacao}, ` +
    `foi pré-pesado em ${Math.round(input.pontos).toLocaleString("pt-BR")} pontos, ` +
    `posicionando-se no Grade ${input.grade} da estrutura de cargos da Chlorum ` +
    `(faixa de ${input.faixaMin}–${input.faixaMax} pontos), correspondente ao nível ` +
    `${input.familiaCargo}. ${paragrafoSalarial} ` +
    `Este é um resultado de pré-pesagem — cargos-fronteira entre grades devem ser ` +
    `validados no processo oficial antes de qualquer comunicação de banda salarial.`
  );
}
