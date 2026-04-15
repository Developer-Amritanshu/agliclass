import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

export function DatabaseRequiredNotice({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <Card>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--panel-strong)] text-[var(--accent-strong)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-[var(--foreground)]">We are preparing this area</h1>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{message}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
