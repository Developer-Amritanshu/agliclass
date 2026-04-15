import { AlertCircle, CheckCircle2, Info, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const toneMap = {
  success: {
    icon: CheckCircle2,
    className: "border-[color-mix(in_srgb,var(--success)_35%,var(--border))] bg-[color-mix(in_srgb,var(--success)_10%,var(--panel))] text-[var(--foreground)]",
  },
  error: {
    icon: AlertCircle,
    className: "border-[color-mix(in_srgb,var(--warn)_45%,var(--border))] bg-[color-mix(in_srgb,var(--warn)_12%,var(--panel))] text-[var(--foreground)]",
  },
  info: {
    icon: Info,
    className: "border-[var(--border)] bg-[var(--panel)] text-[var(--foreground)]",
  },
  pending: {
    icon: Sparkles,
    className: "border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--panel))] text-[var(--foreground)]",
  },
} as const;

export function StatusBanner({
  tone,
  title,
  body,
  className,
}: {
  tone: keyof typeof toneMap;
  title: string;
  body?: string;
  className?: string;
}) {
  const config = toneMap[tone];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-[24px] border px-4 py-4 shadow-[var(--shadow-soft)] transition-all duration-200", config.className, className)}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 rounded-full bg-[var(--card)] p-2 shadow-sm transition-transform duration-200">
          <Icon className="h-4 w-4 shrink-0" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[-0.01em]">{title}</p>
          {body ? <p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">{body}</p> : null}
        </div>
      </div>
    </div>
  );
}
