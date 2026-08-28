# Position Navigator

# Painel de Pesagem de Cargos — Chlorum Solutions (People Intelligence)

## 1. Contexto e objetivo

Construa uma aplicação web para o time de Pessoas e Cultura da Chlorum Solutions

avaliar (“pesar”) cargos novos — que ainda não têm ocupante — usando um modelo

de pontos calibrado no método Hay Guide Chart-Profile já adotado pela empresa.

O usuário responde 8 perguntas (uma por fator de avaliação), a aplicação calcula

a pontuação, o grade (1 a 20) e a faixa salarial correspondente, e grava o

resultado em um histórico consultável.

Público: RH/Pessoas e Cultura e gestores de área. Tom: institucional, calmo,

preciso — nunca “gamificado” ou informal.

## 2. Identidade visual — Design System Chlorum Solutions

Aplique meu Design System da Chlorum Solutions como base de todo o visual

(cores, tipografia, espaçamento, raio, sombra, componentes). Não invente uma

paleta nova.

**Cor**

- Único acento de marca: azul `#2a4999` (hover `#223c7c`), usado em botões

  primários, links, estados ativos e ícones.

- Superfícies claras (`#ffffff` e cinza-azulado bem sutil `oklch(98% 0.003 265)`),

  nunca fundos coloridos atrás de conteúdo.

- Navy `#171d33` / `#202848` como única superfície escura (usar só em rodapés,

  toasts ou paineis invertidos — não como fundo geral).

- Estados semânticos (sucesso, aviso, erro) só para badges de status, nunca

  como decoração.

**Tipografia**

- Fonte única: Nunito (200–900, do Google Fonts).

- Títulos em peso extrabold (800), sentence case (nunca ALL CAPS, nunca Title

  Case).

- Corpo do texto em peso light (300) — esse contraste leve/negrito é a

  assinatura tipográfica da marca.

- CAIXA ALTA + letter-spacing é usada só em badges/eyebrows/microcopy, nunca em

  títulos ou botões.

- **Hierarquia do cabeçalho (herdada da suíte “People Intelligence”):**

  eyebrow em badge pill azul-claro com o texto “Chlorum Solutions · People

  Intelligence”, seguido do H1 “Painel de Pesagem de Cargos” no mesmo peso/

  escala extrabold usado nos demais produtos da suíte. Um parágrafo lead em

  peso light logo abaixo.

**Espaçamento, raio e sombra**

- Escala de 4px (4 a 128px).

- Cards: fundo branco, borda hairline `#e8ecf1`, raio 16px, sombra suave e

  azulada (nunca preto puro): `0 4px 12px hsl(220 45% 20% / 0.10)`.

- Botões e badges: raio “pill” (999px).

- Inputs/selects: raio 10px, borda 1.5px, anel de foco azul-claro

  (`0 0 0 3px #a9d1ef`).

**Componentes** (replicar exatamente o comportamento, não só a cor)

- Button: variantes primary/secondary/ghost, altura 44px (md), peso 700,

  hover escurece um tom, `scale(0.97)` ao clicar.

- Card: padding 24–32px, sombra `shadow-md`, borda hairline.

- Input/Select: label em uppercase pequeno (`text-label`), altura 44px, borda

  azul no foco.

- Badge: pill, fundo azul-claro `#f0f8fd`/`#d6ebf8`, texto azul-escuro,

  uppercase, letter-spacing.

## 3. Estrutura da aplicação

### Página 1 — Nova avaliação (`/`)

Fluxo em 3 etapas, sem navegação por URL entre elas (state local da página):

**Etapa 0 — Identificação do cargo (critérios sine qua non)**

Campos obrigatórios, sem os quais o botão “Iniciar avaliação” fica desabilitado:

- Nome do cargo (texto)

- Diretoria / área (texto)

- Reporta-se a — cargo (texto)

- Este cargo já tem ocupante? (select: “Não — é um cargo novo” / “Sim — já

  existe alguém na função”)

**Etapa 1 — Questionário (8 perguntas, uma por tela)**

Wizard com barra de progresso (8 segmentos, preenchidos em azul conforme

avança). Cada tela mostra:

- Nome do fator + subtítulo explicativo em linguagem simples (ver seção 5)

- Um slider (`input range`) com N posições discretas (o N varia por fator —

  ver tabela)

- Um painel abaixo do slider mostrando o nome e a descrição do nível

  selecionado, atualizado em tempo real

- Botões “Voltar” / “Próxima pergunta” — “Próxima” só habilita depois que o

  usuário interagir com o slider daquela pergunta (não aceitar o valor

  default sem interação)

- Na última pergunta, o botão vira “Ver resultado”

**Etapa 2 — Resultado**

- Medidor semicircular (gauge SVG), 20 segmentos coloridos em rampa de azul

  (claro → escuro conforme o grade sobe), com ponteiro apontando a posição do

  grade calculado dentro da escala 1–20

- Número grande com a pontuação total estimada

- Três badges: Grade / Faixa de pontos / Família de cargo

- Lista-resumo com as 8 respostas escolhidas

- Aviso (card azul-claro) explicando que é uma pré-pesagem calibrada

  estatisticamente, com precisão média de ~97,6%, e que casos-fronteira devem

  ser validados no processo oficial antes de comunicar banda salarial

- Botões “Nova avaliação” (reinicia o formulário) e “Salvar no histórico”

  (grava no Supabase — ver seção 4) — ao salvar, mostrar um toast de

  confirmação e oferecer “Ver no histórico”

### Página 2 — Histórico de avaliações (`/historico`)

- Tabela com: nome do cargo, diretoria/área, grade, pontos, família de cargo,

  status (novo/existente), data da avaliação

- Filtros por diretoria/área e por grade (faixa)

- Busca por nome do cargo

- Clicar em uma linha abre o detalhe (mesma visual da Etapa 2 do resultado,

  em modo somente leitura, incluindo as 8 respostas)

- Opção de excluir um registro (com confirmação em modal/dialog)

Adicione um item de navegação simples no topo (ou barra lateral leve) para

alternar entre “Nova avaliação” e “Histórico”.

## 4. Modelo de dados (Supabase)

Tabela `job_evaluations`:

| coluna | tipo | observação |

|---|---|---|

| id | uuid, pk, default gen_random_uuid() | |

| cargo_nome | text, not null | |

| diretoria_area | text, not null | |

| reporta_a | text, not null | |

| ja_ocupado | boolean, not null | true = “Sim”, false = “Não (cargo novo)” |

| respostas | jsonb, not null | array com os 8 índices selecionados + labels, na ordem dos fatores |

| pontos | numeric, not null | pontuação calculada |

| grade | int, not null | 1–20 |

| faixa_min | int, not null | |

| faixa_max | int, not null | |

| familia_cargo | text, not null | |

| criado_em | timestamptz, default now() | |

Não precisa de autenticação de usuário nesta primeira versão — a tabela pode

ser pública para leitura/escrita dentro do projeto (ambiente interno).

## 5. Lógica de cálculo (implementar exatamente como especificado)

O modelo é uma regressão log-linear calibrada nos cargos já avaliados pela

Chlorum (R² = 99,5%, erro médio ≈ 2,4% no modelo completo; esta versão

simplificada usa só os níveis-base de cada fator, erro médio ≈ 97,6% de

precisão).

```ts

const INTERCEPT = 3.9133;

type Fator = {

  key: string;

  grupo: "Know-how" | "Solução de problemas" | "Accountability";

  titulo: string;

  subtitulo: string;

  niveis: string[];      // nomes exibidos no slider

  descricoes: string[];  // texto explicativo de cada nível

  contribuicao: number[]; // valor log a somar, mesmo índice do nível

};

const FATORES: Fator[] = [

  {

    key: "conhecimento", grupo: "Know-how",

    titulo: "Conhecimento técnico exigido",

    subtitulo: "O quanto de conhecimento técnico, teórico ou especializado o cargo exige.",

    niveis: ["Básico","Introdutório","Processual","Avançado","Profissional","Especializado","Profissional abrangente","Autoridade"],

    descricoes: [

      "Tarefas simples, aprendidas rapidamente, com pouca ou nenhuma experiência prévia.",

      "Rotinas padronizadas e uso de equipamentos simples, aprendidos no dia a dia do trabalho.",

      "Aplicação prática de métodos e procedimentos específicos, com treinamento especializado.",

      "Domínio amplo de técnicas e processos, com alguma base teórica por trás.",

      "Conhecimento técnico ou científico consistente, normalmente com formação superior.",

      "Domínio profundo de uma área especializada, construído com anos de experiência e formação sólida.",

      "Visão ampla e acumulada de gestão de negócios, ou domínio muito profundo de uma especialidade.",

      "Referência reconhecida em sua área, capaz de romper paradigmas estabelecidos."

    ],

    contribuicao: [0.0,0.2286,0.4572,0.6858,0.9144,1.143,1.3716,1.6002]

  },

  {

    key: "gestao", grupo: "Know-how",

    titulo: "Abrangência de gestão",

    subtitulo: "O quanto o cargo integra e coordena atividades diferentes entre si.",

    niveis: ["Tarefa única","Específico","Relacionado","Diversificado","Abrangente","Total"],

    descricoes: [

      "Executa uma tarefa específica, sem responsabilidade sobre outras atividades.",

      "Realiza ou supervisiona atividades específicas, coordenando-se com colegas próximos.",

      "Integra atividades relacionadas entre si, exigindo coordenação com outras áreas.",

      "Integra atividades diferentes entre si, algumas críticas para os resultados do negócio.",

      "Lidera estrategicamente uma área de negócio importante ou uma função corporativa inteira.",

      "Lidera e integra estrategicamente toda a organização."

    ],

    contribuicao: [0.0,0.2271,0.4542,0.6813,0.9084,1.1355]

  },

  {

    key: "comunicacao", grupo: "Know-how",

    titulo: "Comunicação e influência",

    subtitulo: "O tipo de interação exigida com outras pessoas para realizar o trabalho.",

    niveis: ["Informar","Convencer","Mudar comportamento"],

    descricoes: [

      "Troca informações com outras pessoas de forma clara e cortês.",

      "Convence e apoia pessoas usando conhecimento técnico ou argumentos racionais.",

      "Influencia, desenvolve e motiva pessoas, mudando comportamentos e criando o ambiente certo."

    ],

    contribuicao: [0.0,0.0828,0.1656]

  },

  {

    key: "ambiente_pensar", grupo: "Solução de problemas",

    titulo: "Ambiente para pensar e decidir",

    subtitulo: "O quanto o raciocínio do cargo é guiado por regras detalhadas versus por princípios amplos.",

    niveis: ["Rotina restrita","Rotina","Semi-rotina","Padronizado","Claramente definido","Amplamente definido","Genericamente definido","Abstratamente definido"],

    descricoes: [

      "Segue regras e instruções bem detalhadas, com apoio constante por perto.",

      "Segue práticas padronizadas, com exemplos e apoio sempre disponíveis.",

      "Segue procedimentos bem definidos, com alguma variação e apoio disponível.",

      "Segue múltiplos padrões e precedentes distintos, com acesso a apoio quando necessário.",

      "Raciocina dentro de políticas claras e objetivos específicos.",

      "Raciocina dentro de políticas claras, mas com objetivos mais amplos.",

      "Raciocina dentro das políticas e objetivos gerais da organização.",

      "Raciocina a partir dos valores e da filosofia do negócio, sem regras específicas."

    ],

    contribuicao: [0.0,0.0411,0.0822,0.1233,0.1644,0.2055,0.2466,0.2877]

  },

  {

    key: "desafio", grupo: "Solução de problemas",

    titulo: "Tipo de problema enfrentado",

    subtitulo: "O quanto as situações do dia a dia exigem soluções novas versus já conhecidas.",

    niveis: ["Repetitivo","Padronizado","Variável","Adaptável","Inexplorado"],

    descricoes: [

      "Situações idênticas, resolvidas escolhendo entre alternativas já aprendidas.",

      "Situações parecidas, resolvidas comparando alternativas conhecidas.",

      "Situações diferentes entre si, que exigem julgamento dentro da própria área de conhecimento.",

      "Situações que exigem adaptar ou criar soluções novas, com raciocínio analítico e criativo.",

      "Situações totalmente novas, sem precedentes, que exigem soluções inéditas."

    ],

    contribuicao: [0.0,0.0393,0.0786,0.1179,0.1572]

  },

  {

    key: "autonomia", grupo: "Accountability",

    titulo: "Autonomia para agir",

    subtitulo: "O quanto o cargo age de forma independente versus sob supervisão direta.",

    niveis: ["Atentamente controlada","Controlada","Padronizada","Regulamentada","Claramente dirigida","Genericamente dirigida","Guiada / orientada","Estrategicamente guiada"],

    descricoes: [

      "Age sob instruções diretas e supervisão constante e próxima.",

      "Age seguindo rotinas estabelecidas, com supervisão próxima.",

      "Age dentro de práticas padronizadas, com o progresso sendo acompanhado.",

      "Age dentro de precedentes e políticas bem definidas, com revisão dos resultados.",

      "Age sob políticas amplas e direção gerencial constante.",

      "Age com liberdade, sob direção geral e objetivos amplos.",

      "Age com autonomia, orientado apenas por objetivos organizacionais amplos.",

      "Age com autonomia total, orientado apenas pelas grandes tendências do negócio."

    ],

    contribuicao: [0.0,0.1008,0.2016,0.3024,0.4032,0.504,0.6048,0.7056]

  },

  {

    key: "magnitude", grupo: "Accountability",

    titulo: "Tamanho do impacto financeiro",

    subtitulo: "A ordem de grandeza dos números (receita, custo, orçamento) sob influência direta do cargo.",

    niveis: ["Não quantificável","Muito pequeno","Pequeno","Médio","Grande","Muito grande"],

    descricoes: [

      "Impacto financeiro não é diretamente mensurável nesta função.",

      "Impacto financeiro muito pequeno (centenas de milhares a poucos milhões de reais).",

      "Impacto financeiro pequeno (poucos milhões a dezenas de milhões de reais).",

      "Impacto financeiro médio (dezenas a centenas de milhões de reais).",

      "Impacto financeiro grande (centenas de milhões a cerca de 1 bilhão de reais).",

      "Impacto financeiro muito grande (da ordem de 1 bilhão de reais ou mais)."

    ],

    contribuicao: [0.0,0.0675,0.135,0.2025,0.27,0.3375]

  },

  {

    key: "natureza", grupo: "Accountability",

    titulo: "Tipo de responsabilidade pelo resultado",

    subtitulo: "Como o cargo se relaciona com o resultado final: informa, apoia, divide ou controla.",

    niveis: ["Remoto","Contributório","Compartilhado","Primário","Auxiliar","Suporte","Operacional","Analítico","Orientador","Efetivo"],

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

      "Responde diretamente pelos resultados finais de uma área de negócio inteira."

    ],

    contribuicao: [0.0,0.0207,0.0414,0.0621,0.0828,0.1035,0.1242,0.1449,0.1656,0.1863]

  },

];

// Escala de grades (piso, ponto médio, teto, família de cargo)

const ESCALA_GRADES = [

  [1,115,123,131,"Operacional / auxiliar"],

  [2,132,142,151,"Operacional / auxiliar"],

  [3,152,163,174,"Operacional / auxiliar"],

  [4,175,187,199,"Técnico"],

  [5,200,215,229,"Técnico"],

  [6,230,247,263,"Técnico / analista jr."],

  [7,264,284,303,"Supervisão / analista"],

  [8,304,327,349,"Supervisão / analista"],

  [9,350,375,399,"Supervisão / analista sr."],

  [10,400,430,459,"Coordenação / especialista"],

  [11,460,494,527,"Coordenação / especialista"],

  [12,528,568,607,"Coordenação / especialista"],

  [13,608,654,699,"Gerência / consultoria"],

  [14,700,750,799,"Gerência / consultoria"],

  [15,800,860,919,"Gerência executiva"],

  [16,920,988,1055,"Diretoria"],

  [17,1056,1136,1215,"Diretoria"],

  [18,1216,1308,1399,"Diretoria"],

  [19,1400,1500,1609,"C-level"],

  [20,1610,1739,1878,"C-level"],

] as const;

// Cálculo:

// pontos = EXP( INTERCEPT + soma da contribuição do nível escolhido em cada um dos 8 fatores )

// grade = a linha da escala com o MAIOR piso que ainda seja <= pontos

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://hire-scale.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3dc8c53d-e538-4d57-a911-05a65c2c1b8a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
