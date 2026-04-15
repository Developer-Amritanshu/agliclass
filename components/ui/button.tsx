import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium leading-none transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:shrink-0",
        variant === "primary" &&
          "bg-[var(--foreground)] px-5 text-white shadow-[var(--shadow-panel)] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--foreground)_88%,white)]",
        variant === "secondary" &&
          "bg-[var(--panel-strong)] px-5 text-[var(--foreground)] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--panel-strong)_72%,white)]",
        variant === "ghost" && "px-3 text-[var(--muted-foreground)] hover:bg-[var(--panel)] hover:text-[var(--foreground)]",
        variant === "outline" &&
          "border border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_78%,transparent)] px-5 text-[var(--foreground)] hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--foreground)_14%,var(--border))] hover:bg-[var(--card)]",
        variant === "danger" &&
          "bg-[color-mix(in_srgb,var(--warn)_88%,#8d3f00)] px-5 text-white shadow-[var(--shadow-panel)] hover:-translate-y-0.5 hover:bg-[var(--warn)]",
        size === "sm" && "h-9 text-sm",
        size === "md" && "h-11 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <Spinner className="h-4 w-4 motion-pop shrink-0" /> : null}
      <span className={cn("inline-flex items-center gap-2 transition-transform duration-200", loading && "translate-x-[1px]")}>{children}</span>
    </button>
  );
}
