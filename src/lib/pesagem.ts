export const INTERCEPT = 3.9133;

export type Grupo = "Know-how" | "Solução de problemas" | "Accountability";

export type Fator = {
  key: string;
  grupo: Grupo;
  titulo: string;
  subtitulo: string;
  niveis: string[];
  descricoes: string[];
  contribuicao: number[];
};

export const FATORES: Fator[] = [
  {
    key: "conhecimento",
    grupo: "Know-how",
    titulo: "Conhecimento técnico exigido",
    subtitulo:
      "O quanto de conhecimento técnico, teórico ou especializado o cargo exige.",
    niveis: [
      "Básico",
      "Introdutório",
      "Processual",
      "Avançado",
      "Profissional",
      "Especializado",
      "Profissional abrangente",
      "Autoridade",
    ],
    descricoes: [
      "Tarefas simples, aprendidas rapidamente, com pouca ou nenhuma experiência prévia.",
      "Rotinas padronizadas e uso de equipamentos simples, aprendidos no dia a dia do trabalho.",
      "Aplicação prática de métodos e procedimentos específicos, com treinamento especializado.",
      "Domínio amplo de técnicas e processos, com alguma base teórica por trás.",
      "Conhecimento técnico ou científico consistente, normalmente com formação superior.",
      "Domínio profundo de uma área especializada, construído com anos de experiência e formação sólida.",
      "Visão ampla e acumulada de gestão de negócios, ou domínio muito profundo de uma especialidade.",
      "Referência reconhecida em sua área, capaz de romper paradigmas estabelecidos.",
    ],
    contribuicao: [0.0, 0.2286, 0.4572, 0.6858, 0.9144, 1.143, 1.3716, 1.6002],
  },
  {
    key: "gestao",
    grupo: "Know-how",
    titulo: "Abrangência de gestão",
    subtitulo: "O quanto o cargo integra e coordena atividades diferentes entre si.",
    niveis: [
      "Tarefa única",
      "Específico",
      "Relacionado",
      "Diversificado",
      "Abrangente",
      "Total",
    ],
    descricoes: [
      "Executa uma tarefa específica, sem responsabilidade sobre outras atividades.",
      "Realiza ou supervisiona atividades específicas, coordenando-se com colegas próximos.",
      "Integra atividades relacionadas entre si, exigindo coordenação com outras áreas.",
      "Integra atividades diferentes entre si, algumas críticas para os resultados do negócio.",
      "Lidera estrategicamente uma área de negócio importante ou uma função corporativa inteira.",
      "Lidera e integra estrategicamente toda a organização.",
    ],
    contribuicao: [0.0, 0.2271, 0.4542, 0.6813, 0.9084, 1.1355],
  },
  {
    key: "comunicacao",
    grupo: "Know-how",
    titulo: "Comunicação e influência",
    subtitulo: "O tipo de interação exigida com outras pessoas para realizar o trabalho.",
    niveis: ["Informar", "Convencer", "Mudar comportamento"],
    descricoes: [
      "Troca informações com outras pessoas de forma clara e cortês.",
      "Convence e apoia pessoas usando conhecimento técnico ou argumentos racionais.",
      "Influencia, desenvolve e motiva pessoas, mudando comportamentos e criando o ambiente certo.",
    ],
    contribuicao: [0.0, 0.0828, 0.1656],
  },
  {
    key: "ambiente_pensar",
    grupo: "Solução de problemas",
    titulo: "Ambiente para pensar e decidir",
    subtitulo:
      "O quanto o raciocínio do cargo é guiado por regras detalhadas versus por princípios amplos.",
    niveis: [
      "Rotina restrita",
      "Rotina",
      "Semi-rotina",
      "Padronizado",
      "Claramente definido",
      "Amplamente definido",
      "Genericamente definido",
      "Abstratamente definido",
    ],
    descricoes: [
      "Segue regras e instruções bem detalhadas, com apoio constante por perto.",
      "Segue práticas padronizadas, com exemplos e apoio sempre disponíveis.",
      "Segue procedimentos bem definidos, com alguma variação e apoio disponível.",
      "Segue múltiplos padrões e precedentes distintos, com acesso a apoio quando necessário.",
      "Raciocina dentro de políticas claras e objetivos específicos.",
      "Raciocina dentro de políticas claras, mas com objetivos mais amplos.",
      "Raciocina dentro das políticas e objetivos gerais da organização.",
      "Raciocina a partir dos valores e da filosofia do negócio, sem regras específicas.",
    ],
    contribuicao: [0.0, 0.0411, 0.0822, 0.1233, 0.1644, 0.2055, 0.2466, 0.2877],
  },
  {
    key: "desafio",
    grupo: "Solução de problemas",
    titulo: "Tipo de problema enfrentado",
    subtitulo:
      "O quanto as situações do dia a dia exigem soluções novas versus já conhecidas.",
    niveis: ["Repetitivo", "Padronizado", "Variável", "Adaptável", "Inexplorado"],
    descricoes: [
      "Situações idênticas, resolvidas escolhendo entre alternativas já aprendidas.",
      "Situações parecidas, resolvidas comparando alternativas conhecidas.",
      "Situações diferentes entre si, que exigem julgamento dentro da própria área de conhecimento.",
      "Situações que exigem adaptar ou criar soluções novas, com raciocínio analítico e criativo.",
      "Situações totalmente novas, sem precedentes, que exigem soluções inéditas.",
    ],
    contribuicao: [0.0, 0.0393, 0.0786, 0.1179, 0.1572],
  },
  {
    key: "autonomia",
    grupo: "Accountability",
    titulo: "Autonomia para agir",
    subtitulo: "O quanto o cargo age de forma independente versus sob supervisão direta.",
    niveis: [
      "Atentamente controlada",
      "Controlada",
      "Padronizada",
      "Regulamentada",
      "Claramente dirigida",
      "Genericamente dirigida",
      "Guiada / orientada",
      "Estrategicamente guiada",
    ],
    descricoes: [
      "Age sob instruções diretas e supervisão constante e próxima.",
      "Age seguindo rotinas estabelecidas, com supervisão próxima.",
      "Age dentro de práticas padronizadas, com o progresso sendo acompanhado.",
      "Age dentro de precedentes e políticas bem definidas, com revisão dos resultados.",
      "Age sob políticas amplas e direção gerencial constante.",
      "Age com liberdade, sob direção geral e objetivos amplos.",
      "Age com autonomia, orientado apenas por objetivos organizacionais amplos.",
      "Age com autonomia total, orientado apenas pelas grandes tendências do negócio.",
    ],
    contribuicao: [0.0, 0.1008, 0.2016, 0.3024, 0.4032, 0.504, 0.6048, 0.7056],
  },
  {
    key: "magnitude",
    grupo: "Accountability",
    titulo: "Tamanho do impacto financeiro",
    subtitulo:
      "A ordem de grandeza dos números (receita, custo, orçamento) sob influência direta do cargo.",
    niveis: [
      "Não quantificável",
      "Muito pequeno",
      "Pequeno",
      "Médio",
      "Grande",
      "Muito grande",
    ],
    descricoes: [
      "Impacto financeiro não é diretamente mensurável nesta função.",
      "Impacto financeiro muito pequeno (centenas de milhares a poucos milhões de reais).",
      "Impacto financeiro pequeno (poucos milhões a dezenas de milhões de reais).",
      "Impacto financeiro médio (dezenas a centenas de milhões de reais).",
      "Impacto financeiro grande (centenas de milhões a cerca de 1 bilhão de reais).",
      "Impacto financeiro muito grande (da ordem de 1 bilhão de reais ou mais).",
    ],
    contribuicao: [0.0, 0.0675, 0.135, 0.2025, 0.27, 0.3375],
  },
  {
    key: "natureza",
    grupo: "Accountability",
    titulo: "Tipo de responsabilidade pelo resultado",
    subtitulo:
      "Como o cargo se relaciona com o resultado final: informa, apoia, divide ou controla.",
    niveis: [
      "Remoto",
      "Contributório",
      "Compartilhado",
      "Primário",
      "Auxiliar",
      "Suporte",
      "Operacional",
      "Analítico",
      "Orientador",
      "Efetivo",
    ],
    descricoes: [
      "Fornece informações ou serviços para que outros alcancem seus próprios resultados.",
      "Contribui com apoio consultivo ou analítico para que outros atinjam os resultados.",
      "Divide com outras áreas ou pessoas o controle final sobre um resultado.",
      "Controla diretamente o impacto final sobre o resultado, dentro de sua autonomia de ação.",
      "Apoia tecnicamente para que a área entregue seus resultados.",
      "Dá suporte especializado consistente para os resultados de uma área.",
      "Responde diretamente por resultados operacionais do seu time ou processo.",
      "Responde por análises e recomendações que orientam decisões importantes.",
      "Orienta decisões estratégicas de uma área relevante do negócio.",
      "Responde diretamente pelos resultados finais de uma área de negócio inteira.",
    ],
    contribuicao: [
      0.0, 0.0207, 0.0414, 0.0621, 0.0828, 0.1035, 0.1242, 0.1449, 0.1656, 0.1863,
    ],
  },
];

export const ESCALA_GRADES = [
  [1, 115, 123, 131, "Operacional / auxiliar"],
  [2, 132, 142, 151, "Operacional / auxiliar"],
  [3, 152, 163, 174, "Operacional / auxiliar"],
  [4, 175, 187, 199, "Técnico"],
  [5, 200, 215, 229, "Técnico"],
  [6, 230, 247, 263, "Técnico / analista jr."],
  [7, 264, 284, 303, "Supervisão / analista"],
  [8, 304, 327, 349, "Supervisão / analista"],
  [9, 350, 375, 399, "Supervisão / analista sr."],
  [10, 400, 430, 459, "Coordenação / especialista"],
  [11, 460, 494, 527, "Coordenação / especialista"],
  [12, 528, 568, 607, "Coordenação / especialista"],
  [13, 608, 654, 699, "Gerência / consultoria"],
  [14, 700, 750, 799, "Gerência / consultoria"],
  [15, 800, 860, 919, "Gerência executiva"],
  [16, 920, 988, 1055, "Diretoria"],
  [17, 1056, 1136, 1215, "Diretoria"],
  [18, 1216, 1308, 1399, "Diretoria"],
  [19, 1400, 1500, 1609, "C-level"],
  [20, 1610, 1739, 1878, "C-level"],
] as const;

export type Refinamento = "abaixo" | "tipica" | "acima";

export type Selecao = {
  indice: number;
  refinamento: Refinamento;
};

export const SELECAO_PADRAO: Selecao = { indice: -1, refinamento: "tipica" };

/** "Comunicação e influência" tem apenas 3 níveis, sem refinamento. */
export function temRefinamento(fator: Fator) {
  return fator.key !== "comunicacao";
}

export const ROTULO_REFINAMENTO: Record<Refinamento, string> = {
  abaixo: "− Abaixo da faixa",
  tipica: "Faixa típica",
  acima: "+ Acima da faixa",
};

export function sufixoCodigo(refinamento: Refinamento) {
  return refinamento === "abaixo" ? "-" : refinamento === "acima" ? "+" : "";
}

export function codigoNivel(fator: Fator, indice: number, refinamento: Refinamento) {
  const sufixo = temRefinamento(fator) ? sufixoCodigo(refinamento) : "";
  return `${fator.key}.${indice + 1}${sufixo}`;
}

export function nomeNivel(fator: Fator, indice: number, refinamento: Refinamento) {
  const base = fator.niveis[indice] ?? "";
  if (!temRefinamento(fator) || refinamento === "tipica") return base;
  return `${base} — ${refinamento === "abaixo" ? "abaixo da faixa" : "acima da faixa"}`;
}

/**
 * Contribuição do nível escolhido, já incluindo o refinamento −/padrão/+:
 * o refinamento move um terço do passo do fator na direção do nível vizinho.
 */
export function contribuicaoNivel(
  fator: Fator,
  indice: number,
  refinamento: Refinamento,
) {
  const base = fator.contribuicao[indice] ?? 0;
  if (!temRefinamento(fator) || refinamento === "tipica") return base;

  const anterior = fator.contribuicao[indice - 1];
  const proximo = fator.contribuicao[indice + 1];
  const passoAbaixo =
    anterior !== undefined ? base - anterior : proximo !== undefined ? proximo - base : 0;
  const passoAcima =
    proximo !== undefined ? proximo - base : anterior !== undefined ? base - anterior : 0;

  return refinamento === "abaixo" ? base - passoAbaixo / 3 : base + passoAcima / 3;
}

export type Resposta = {
  fatorKey: string;
  /** compatibilidade com registros antigos do histórico */
  key: string;
  fator: string;
  codigo: string;
  nome: string;
  nivel: string;
  indice: number;
  refinamento: Refinamento;
  contribuicao: number;
};

export type Resultado = {
  pontos: number;
  grade: number;
  faixaMin: number;
  faixaMax: number;
  familiaCargo: string;
  respostas: Resposta[];
};

export function calcularResultado(selecoes: Selecao[]): Resultado {
  const respostas: Resposta[] = FATORES.map((fator, i) => {
    const selecao = selecoes[i] ?? SELECAO_PADRAO;
    const indice = Math.max(0, selecao.indice);
    const refinamento = temRefinamento(fator) ? selecao.refinamento : "tipica";
    return {
      fatorKey: fator.key,
      key: fator.key,
      fator: fator.titulo,
      codigo: codigoNivel(fator, indice, refinamento),
      nome: nomeNivel(fator, indice, refinamento),
      nivel: fator.niveis[indice] ?? "",
      indice,
      refinamento,
      contribuicao: contribuicaoNivel(fator, indice, refinamento),
    };
  });

  const soma = respostas.reduce((acc, r) => acc + r.contribuicao, 0);
  const pontos = Math.exp(INTERCEPT + soma);

  let linha: (typeof ESCALA_GRADES)[number] = ESCALA_GRADES[0];
  for (const candidata of ESCALA_GRADES) {
    if (candidata[1] <= pontos) linha = candidata;
  }

  return {
    pontos,
    grade: linha[0],
    faixaMin: linha[1],
    faixaMax: linha[3],
    familiaCargo: linha[4],
    respostas,
  };
}

