CREATE TABLE public.tabela_salarial (
  grade integer PRIMARY KEY,
  nivel_nome text NOT NULL,
  piso_80 numeric,
  p90 numeric,
  mediana numeric NOT NULL,
  p110 numeric,
  teto_120 numeric,
  tabela_origem text NOT NULL DEFAULT 'Corporativo 2026',
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tabela_salarial TO anon;
GRANT SELECT ON public.tabela_salarial TO authenticated;
GRANT ALL ON public.tabela_salarial TO service_role;

ALTER TABLE public.tabela_salarial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura publica da tabela salarial"
ON public.tabela_salarial FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.tabela_salarial (grade, nivel_nome, piso_80, p90, mediana, p110, teto_120) VALUES
(1,  'Aprendiz',               null,      null,      1621.00,   null,      null),
(2,  'Auxiliar I',             1657.32,   1864.49,   2071.66,   2278.82,   2485.99),
(3,  'Oper / Aux III',         2071.66,   2330.61,   2589.57,   2848.53,   3107.48),
(4,  'Oper I',                 2589.57,   2913.27,   3236.96,   3560.66,   3884.35),
(5,  'Técn I | Oper II',       3236.96,   3641.58,   4046.20,   4450.82,   4855.44),
(6,  'Técn II | Anl (JR)',     4046.20,   4551.98,   5057.75,   5563.53,   6069.30),
(7,  'Técn III | Anl (PL,JR)', 5057.75,   5689.97,   6322.19,   6954.41,   7586.63),
(8,  'Anl (SR, PL)',           6322.19,   7112.47,   7902.74,   8693.01,   9483.29),
(9,  'Superv | Anl (SR)',      7902.74,   8890.58,   9878.42,   10866.27,  11854.11),
(10, 'Coord. | Espec.',        9878.42,   11113.23,  12348.03,  13582.83,  14817.64),
(11, 'Coord. | Espec.',        12348.03,  13891.53,  15435.04,  16978.54,  18522.05),
(12, 'Coord. | Espec.',        15435.04,  17364.42,  19293.80,  21223.18,  23152.56),
(13, 'Gte. | Consult',         19293.80,  21705.52,  24117.25,  26528.97,  28940.70),
(14, 'Gte. | Consult',         24117.25,  27131.90,  30146.56,  33161.22,  36175.87),
(15, 'Gte (Executivo, Geral)', 30146.56,  33914.88,  37683.20,  41451.52,  45219.84),
(16, 'Diretor',                37683.20,  42393.60,  47104.00,  51814.40,  56524.80),
(17, 'Diretor',                47104.00,  52992.00,  58880.00,  64768.00,  70656.00),
(18, 'Diretor Executivo',      58880.00,  66240.00,  73600.00,  80960.00,  88320.00),
(19, 'C. Level',               73600.00,  82800.00,  92000.00,  101200.00, 110400.00),
(20, 'C. Level',               92000.00,  103500.00, 115000.00, 126500.00, 138000.00),
(21, 'C. Level',               115000.00, 129375.00, 143750.00, 158125.00, 172500.00),
(22, 'C. Level',               143750.00, 161718.75, 179687.50, 197656.25, 215625.00);

ALTER TABLE public.job_evaluations
  ADD COLUMN salario_piso numeric,
  ADD COLUMN salario_mediana numeric,
  ADD COLUMN salario_teto numeric,
  ADD COLUMN requer_confirmacao_executiva boolean NOT NULL DEFAULT false,
  ADD COLUMN texto_fluido text NOT NULL DEFAULT '';