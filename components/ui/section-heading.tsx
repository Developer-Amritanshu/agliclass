import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow: string;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-3">
        <Badge tone="accent">{eyebrow}</Badge>
        <div className="space-y-2">
          <h2 className="font-display text-3xl tracking-tight text-[var(--foreground)] md:text-4xl">
            {title}
          </h2>
          <p className="text-base leading-7 text-[var(--muted-foreground)]">{body}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
