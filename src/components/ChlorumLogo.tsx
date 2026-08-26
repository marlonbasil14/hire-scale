import { cn } from "@/lib/utils";

import chlorumLogo from "@/assets/chlorum-logo.png.asset.json";

/**
 * Logo oficial "CHLORUM SOLUTIONS".
 */
export function ChlorumLogo({ className }: { className?: string }) {
  return (
    <img
      src={chlorumLogo.url}
      alt="Chlorum Solutions"
      className={cn("h-14 w-auto select-none", className)}
      draggable={false}
    />
  );
}
