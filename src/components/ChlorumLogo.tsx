import { cn } from "@/lib/utils";

/**
 * Lockup "CHLORUM SOLUTIONS" com o ponto azul alinhado sobre o "O".
 */
export function ChlorumLogo({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <span className="flex items-end text-[24px] font-extrabold uppercase leading-none tracking-[0.14em] text-foreground">
        CHL
        <span className="relative inline-flex flex-col items-center leading-none">
          <span className="absolute -top-[0.42em] size-[0.16em] rounded-full bg-primary" />
          <span>O</span>
        </span>
        RUM
      </span>
      <span className="mt-1.5 text-[9px] font-bold uppercase leading-none tracking-[0.42em] text-muted-foreground">
        Solutions
      </span>
    </div>
  );
}
