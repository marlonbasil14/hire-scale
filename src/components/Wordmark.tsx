import { cn } from "@/lib/utils";

/**
 * Wordmark "People Intelligence" — tipografia serifada da wordmark
 * do projeto People Push Dashboard: "People" em bold, "Intelligence"
 * em bold itálico no azul da marca.
 */
export function Wordmark({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-wordmark whitespace-nowrap font-bold normal-case tracking-normal",
        className,
      )}
      {...props}
    >
      <span className="text-foreground">People</span>{" "}
      <span className="italic text-primary">Intelligence</span>
    </span>
  );
}
