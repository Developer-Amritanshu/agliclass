export function PageLoading({ title = "Loading", body = "Preparing your page." }: { title?: string; body?: string }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
      <div className="rounded-[34px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-panel)] motion-enter">
        <div className="h-3 w-28 rounded-full shimmer-surface" />
        <div className="mt-4 h-12 w-2/3 rounded-[18px] shimmer-surface" />
        <div className="mt-4 h-4 w-full rounded-full shimmer-surface" />
        <div className="mt-2 h-4 w-4/5 rounded-full shimmer-surface" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="h-36 rounded-[24px] shimmer-surface" />
          <div className="h-36 rounded-[24px] shimmer-surface" />
          <div className="h-36 rounded-[24px] shimmer-surface" />
        </div>
        <p className="mt-8 text-sm text-[var(--muted-foreground)]">{title} · {body}</p>
      </div>
    </main>
  );
}
