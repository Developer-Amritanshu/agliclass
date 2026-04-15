import Link from "next/link";
import { BookOpenCheck, Boxes, ClipboardList, House, ImagePlus, MapPinned, Menu, PackageSearch, School, Truck } from "lucide-react";

import { AdminLogoutButton } from "@/components/dashboard/admin-logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/admin", label: "Overview", icon: House },
  { href: "/admin/schools", label: "Schools", icon: School },
  { href: "/admin/submissions", label: "Seller queue", icon: ImagePlus },
  { href: "/admin/inventory", label: "Inventory", icon: PackageSearch },
  { href: "/admin/kits", label: "Kits", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/tasks", label: "Tasks", icon: Truck },
];

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 md:grid-cols-[300px_1fr] md:px-6">
        <aside className="rounded-[34px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-panel)] md:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-white">
              <BookOpenCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-extrabold tracking-[-0.04em] text-[var(--foreground)] md:text-xl">AgliClass Ops</p>
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">Premium workflow for seasonal operations</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3 md:block">
            <div className="md:hidden inline-flex items-center gap-2 rounded-full bg-[var(--panel)] px-3 py-2 text-sm font-medium text-[var(--foreground)]">
              <Menu className="h-4 w-4" />
              Admin navigation
            </div>
            <ThemeToggle />
          </div>
          <nav className="mt-6 grid grid-cols-2 gap-2 md:mt-8 md:grid-cols-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--panel)] hover:text-[var(--foreground)]"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 rounded-[26px] bg-[var(--panel)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-white">
                <MapPinned className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">Active clusters</p>
                <p className="text-xs text-[var(--muted-foreground)]">Dehradun core + Haldwani pilot</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <AdminLogoutButton />
          </div>
        </aside>
        <main className="space-y-6">
          <div className="rounded-[34px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-panel)] md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Internal operations</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">{subtitle}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
