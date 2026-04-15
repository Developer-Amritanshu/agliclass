"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PublicFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/drivers")) {
    return null;
  }

  return (
    <footer className="border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,var(--panel))]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-6">
        <div>
          <p className="text-lg font-bold tracking-[-0.03em] text-[var(--foreground)]">AgliClass</p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--muted-foreground)]">
            A calmer way to buy and resell school books, built around exact school mapping, cleaner logistics, and clearer decisions for families.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
            <Link href="/buyer" className="transition hover:text-[var(--foreground)]">Buy kits</Link>
            <Link href="/sell" className="transition hover:text-[var(--foreground)]">Sell books</Link>
            <Link href="/contact" className="transition hover:text-[var(--foreground)]">Contact</Link>
            <Link href="/account" className="transition hover:text-[var(--foreground)]">Account</Link>
          </div>
        </div>
        <div className="text-sm text-[var(--muted-foreground)] md:text-right">
          <p>Built for families, schools, and hyperlocal reuse.</p>
          <p className="mt-3">
            Developed by{" "}
            <Link
              href="https://www.linkedin.com/in/amritanshu-rawat/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--foreground)] transition hover:text-[var(--accent)]"
            >
              Amritanshu
            </Link>{" "}
            and AI
          </p>
        </div>
      </div>
    </footer>
  );
}
