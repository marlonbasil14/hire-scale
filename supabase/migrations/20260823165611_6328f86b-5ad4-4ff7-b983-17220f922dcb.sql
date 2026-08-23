CREATE TABLE public.job_evaluations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cargo_nome text NOT NULL,
  diretoria_area text NOT NULL,
  reporta_a text NOT NULL,
  ja_ocupado boolean NOT NULL,
  respostas jsonb NOT NULL,
  pontos numeric NOT NULL,
  grade int NOT NULL,
  faixa_min int NOT NULL,
  faixa_max int NOT NULL,
  familia_cargo text NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_evaluations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_evaluations TO authenticated;
GRANT ALL ON public.job_evaluations TO service_role;

ALTER TABLE public.job_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura publica das avaliacoes" ON public.job_evaluations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Insercao publica das avaliacoes" ON public.job_evaluations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Exclusao publica das avaliacoes" ON public.job_evaluations FOR DELETE TO anon, authenticated USING (true);
