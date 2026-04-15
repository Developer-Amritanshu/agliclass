import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("surface-glass motion-enter rounded-[30px] border border-[var(--border)] p-6 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[var(--shadow-panel)]", className)}>{children}</div>;
}
