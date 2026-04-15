import Link from "next/link";

import { AdminLoginForm } from "@/components/forms/admin-login-form";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12 md:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[1fr_0.92fr]">
        <section className="rounded-[34px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-panel)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Admin access</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-extrabold leading-[0.94] tracking-[-0.05em] text-[var(--foreground)]">Sign in to the AgliClass operations workspace.</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-foreground)]">This area is only for internal school onboarding, seller pickup review, pricing approval, and order operations.</p>
          <Link href="/" className="mt-8 inline-flex text-sm font-semibold text-[var(--accent)]">Return to website</Link>
        </section>
        <section className="rounded-[34px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-panel)]">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">Admin login</h2>
          <AdminLoginForm />
        </section>
      </div>
    </main>
  );
}
