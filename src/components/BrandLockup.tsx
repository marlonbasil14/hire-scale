import { cn } from "@/lib/utils";

/**
 * Lockups institucionais conforme brandguides:
 * - Gente e Gestão (Diretoria) — selo GG, azul institucional #1B57A6
 * - Gente e Remuneração (Gerência) — selo GR, azul-claro institucional #5A86BE
 * Tipografia Fraunces, itálico na última palavra ("assinatura").
 */

type Variante = "gestao" | "remuneracao";

const CONFIG: Record<
  Variante,
  { sigla: string; primeira: string; assinatura: string; cor: string; nome: string }
> = {
  gestao: {
    sigla: "GG",
    primeira: "Gente e",
    assinatura: "Gestão",
    cor: "#1B57A6",
    nome: "Gente e Gestão",
  },
  remuneracao: {
    sigla: "GR",
    primeira: "Gente e",
    assinatura: "Remuneração",
    cor: "#5A86BE",
    nome: "Gente e Remuneração",
  },
};

export function BrandSeal({
  variante = "gestao",
  reversa = false,
  className,
}: {
  variante?: Variante | undefined;
  reversa?: boolean | undefined;
  className?: string | undefined;
}) {
  const c = CONFIG[variante];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex aspect-square items-center justify-center rounded-full font-lockup font-bold leading-none",
        "size-[2.6em] text-[1.05em]",
        className,
      )}
      style={
        reversa
          ? { backgroundColor: "#ffffff", color: c.cor }
          : { backgroundColor: c.cor, color: "#ffffff" }
      }
    >
      {c.sigla}
    </span>
  );
}

export function BrandLockup({
  variante = "gestao",
  comAssinaturaCorporativa = true,
  reversa = false,
  className,
}: {
  variante?: Variante | undefined;
  comAssinaturaCorporativa?: boolean | undefined;
  reversa?: boolean | undefined;
  className?: string | undefined;
}) {
  const c = CONFIG[variante];
  const corTexto = reversa ? "#ffffff" : c.cor;

  return (
    <span
      className={cn("inline-flex items-center gap-3 text-[1.5rem] leading-none", className)}
      aria-label={`${c.nome} — Chlorum Solutions`}
    >
      <BrandSeal variante={variante} reversa={reversa} />
      <span className="flex flex-col items-start gap-[0.15em]">
        <span className="font-lockup font-semibold" style={{ color: corTexto }}>
          {c.primeira} <em className="italic">{c.assinatura}</em>
        </span>
        {comAssinaturaCorporativa ? (
          <span
            className="text-[0.34em] font-bold uppercase tracking-[0.22em]"
            style={{ color: reversa ? "rgba(255,255,255,0.85)" : "#6b7280" }}
          >
            Chlorum Solutions
          </span>
        ) : null}
      </span>
    </span>
  );
}

/** Linha "Gente e Gestão · em parceria com Gente e Remuneração". */
export function BrandParceria({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1", className)}>
      <span className="font-lockup font-semibold" style={{ color: CONFIG.gestao.cor }}>
        Gente e <em className="italic">Gestão</em>
      </span>
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground">em parceria com</span>
      <span className="font-lockup font-semibold" style={{ color: CONFIG.remuneracao.cor }}>
        Gente e <em className="italic">Remuneração</em>
      </span>
    </span>
  );
}
