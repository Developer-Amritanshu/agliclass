import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 text-sm leading-none text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[color-mix(in_srgb,var(--muted-foreground)_76%,transparent)] hover:-translate-y-[1px] hover:border-[color-mix(in_srgb,var(--accent)_28%,var(--border))] hover:bg-[var(--card)] focus:border-[var(--accent)] focus:bg-[var(--card)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--ring)_18%,transparent)] disabled:cursor-not-allowed disabled:opacity-60",
        props.className,
      )}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[color-mix(in_srgb,var(--muted-foreground)_76%,transparent)] hover:-translate-y-[1px] hover:border-[color-mix(in_srgb,var(--accent)_28%,var(--border))] hover:bg-[var(--card)] focus:border-[var(--accent)] focus:bg-[var(--card)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--ring)_18%,transparent)] disabled:cursor-not-allowed disabled:opacity-60",
        props.className,
      )}
    />
  );
}
