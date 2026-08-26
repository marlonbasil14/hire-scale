import { cn } from "@/lib/utils";

import wordmark from "@/assets/people-intelligence.png.asset.json";

/**
 * Wordmark oficial "People Intelligence".
 * A altura acompanha o font-size do contexto (1em), preservando a proporção.
 */
export function Wordmark({
  className,
  ...props
}: Omit<React.ComponentProps<"img">, "src" | "alt">) {
  return (
    <img
      src={wordmark.url}
      alt="People Intelligence"
      className={cn("inline-block h-[1.25em] w-auto select-none align-middle", className)}
      draggable={false}
      {...props}
    />
  );
}
