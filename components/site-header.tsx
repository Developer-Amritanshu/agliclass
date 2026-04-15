import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, Sparkles, UserRound } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { getCurrentAppUser } from "@/lib/auth/user";

const navLinks = [
  { href: "/buyer", label: "Buy kits" },
  { href: "/sell", label: "Sell books" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const user = await getCurrentAppUser();
  const isDriver = user?.role === "driver";
  const accountHref = isDriver ? "/drivers" : "/account";
  const accountLabel = isDriver ? "Driver hub" : user ? "My account" : "Sign in";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_76%,transparent)] backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="min-w-0 flex items-center gap-3 transition hover:opacity-90">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-white shadow-[var(--shadow-panel)] md:h-11 md:w-11">
              <BookOpenCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold tracking-[-0.03em] text-[var(--foreground)] md:text-lg">AgliClass</p>
              <p className="hidden text-xs text-[var(--muted-foreground)] sm:block">Verified school books, designed with restraint.</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_82%,white)] p-1 md:flex">
            {!isDriver ? (
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <div className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--muted-foreground)]">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                Driver workspace
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <Link href={accountHref}>
              <Button variant="outline" className="gap-2 bg-[color-mix(in_srgb,var(--card)_80%,white)] px-3 sm:px-5">
                <UserRound className="h-4 w-4" />
                <span className="hidden sm:inline">{accountLabel}</span>
              </Button>
            </Link>
            {!isDriver ? (
              <Link href="/buyer">
                <Button className="gap-2 px-3 sm:px-5">
                  <span className="hidden sm:inline">Explore</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : null}
          </div>
        </div>

        {!isDriver ? (
          <div className="mt-4 flex items-center justify-between gap-3 md:hidden">
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_82%,white)] p-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="shrink-0 md:hidden">
              <ThemeToggle />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
