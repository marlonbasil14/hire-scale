import { Wordmark } from "@/components/Wordmark";

export function Hero() {
  return (
    <section className="flex flex-col items-center text-center">
      <div className="card-surface w-full max-w-xl px-6 py-10 sm:px-10 sm:py-12">
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center leading-none">
            <span className="text-[22px] font-extrabold tracking-[0.08em] text-foreground">
              CHL{" "}
              <span className="relative inline-block">
                O
                <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />
              </span>{" "}
              RUM
            </span>
            <span className="text-[9px] font-bold tracking-[0.28em] text-muted-foreground">
              SOLUTIONS
            </span>
          </div>

          <Wordmark className="text-2xl sm:text-3xl" />

          <div className="space-y-3">
            <p className="text-base font-light leading-relaxed text-muted-foreground">
              Avalie cargos novos com consistência e agilidade. O painel aplica o
              método Hay Guide Chart-Profile em oito fatores e entrega, em
              minutos, a pontuação estimada, a grade de 1 a 20 e a família de
              cargo correspondente.
            </p>
            <p className="text-sm font-light leading-relaxed text-muted-foreground/80">
              Preencha a identificação do cargo e responda ao questionário para
              gerar a pré-pesagem. Os resultados podem ser salvos no histórico
              para consulta e comparação futura.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
