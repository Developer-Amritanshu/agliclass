import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warn";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "motion-pop inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase leading-none transition-transform duration-200 hover:-translate-y-[1px] [&_svg]:shrink-0",
        tone === "neutral" && "bg-[var(--panel-strong)] text-[var(--muted-foreground)]",
        tone === "accent" && "bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent-strong)]",
        tone === "success" && "bg-[color-mix(in_srgb,var(--success)_16%,transparent)] text-[var(--success)]",
        tone === "warn" && "bg-[color-mix(in_srgb,var(--warn)_18%,transparent)] text-[var(--warn)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
