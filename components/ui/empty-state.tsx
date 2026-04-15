import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  eyebrow?: string;
  title: string;
  body: string;
  imageSrc?: string;
  imageAlt?: string;
  actionHref?: string;
  actionLabel?: string;
  secondaryAction?: ReactNode;
  compact?: boolean;
};

export function EmptyState({
  eyebrow,
  title,
  body,
  imageSrc,
  imageAlt = "Empty state illustration",
  actionHref,
  actionLabel,
  secondaryAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <div className={`rounded-[30px] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)] ${compact ? "p-6" : "p-6 md:p-10"}`}>
      {imageSrc ? (
        <div className="overflow-hidden rounded-[24px] bg-[var(--panel)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={imageAlt} className="h-auto w-full object-cover" />
        </div>
      ) : null}
      {eyebrow ? <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{eyebrow}</p> : null}
      <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">{body}</p>
      {actionHref || secondaryAction ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {actionHref && actionLabel ? (
            <Link href={actionHref}>
              <Button>{actionLabel}</Button>
            </Link>
          ) : null}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
