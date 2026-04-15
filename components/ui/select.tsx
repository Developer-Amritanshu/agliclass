import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-12 w-full cursor-pointer rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 pr-10 text-sm leading-none text-[var(--foreground)] outline-none transition-all duration-200 hover:-translate-y-[1px] hover:border-[color-mix(in_srgb,var(--accent)_28%,var(--border))] hover:bg-[var(--card)] focus:border-[var(--accent)] focus:bg-[var(--card)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--ring)_18%,transparent)] disabled:cursor-not-allowed disabled:opacity-60",
        props.className,
      )}
    />
  );
}
