import { BrandParceria } from "@/components/BrandLockup";
import { Badge } from "@/components/chlorum";
import { Wordmark } from "@/components/Wordmark";

export function PageHeader({
  titulo,
  lead,
}: {
  titulo: string;
  lead: string;
}) {
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge className="gap-1.5">
          Gente e Gestão ·<Wordmark className="text-[13px]" />
        </Badge>
        <BrandParceria somenteParceiro className="text-xs" />
      </div>
      <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">{titulo}</h1>
      <p className="max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
        {lead}
      </p>
    </header>
  );
}
