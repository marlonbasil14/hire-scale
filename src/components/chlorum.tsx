import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary:
          "bg-secondary text-accent-foreground border border-border hover:bg-accent",
        ghost: "text-primary hover:bg-secondary",
        danger: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("card-surface p-6 sm:p-8", className)} {...props} />;
}

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-eyebrow inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

const fieldControl =
  "h-11 w-full rounded-[10px] border-[1.5px] border-input bg-surface px-3 text-sm font-light text-foreground transition-shadow placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:shadow-[0_0_0_3px_var(--color-ring)]";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-label block">{label}</span>
      {children}
    </label>
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(fieldControl, className)} {...props} />;
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(fieldControl, "pr-8", className)} {...props} />;
}
