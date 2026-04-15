import Image from "next/image";
import { CreditCard, MapPin, ShieldCheck, Truck } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { SiteHeader } from "@/components/site-header";
import { getCurrentAppUser } from "@/lib/auth/user";
import { getConfigurationError, getKit } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ kit?: string }> }) {
  const configurationError = getConfigurationError();

  if (configurationError) {
    return (
      <div>
        <SiteHeader />
        <DatabaseRequiredNotice message={configurationError} />
      </div>
    );
  }

  const user = await getCurrentAppUser();
  const params = await searchParams;

  if (!user) {
    redirect(`/account?next=/buyer/checkout${params.kit ? `?kit=${params.kit}` : ""}`);
  }

  if (user.role !== "parent") {
    redirect("/drivers");
  }

  const kit = params.kit ? await getKit(params.kit) : null;

  if (!kit) {
    notFound();
  }

  const total = kit.price + 30 + 60;

  return (
    <div className="relative overflow-hidden">
      <SiteHeader />
      <div className="editorial-orb editorial-orb--warm absolute left-0 top-28 -z-10 h-72 w-72" />
      <div className="editorial-orb editorial-orb--cool absolute right-0 top-64 -z-10 h-80 w-80" />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <section className="editorial-frame rounded-[38px] p-8 md:p-10">
            <span className="eyebrow">Checkout</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">Confirm your order</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)]">
              A quieter checkout with the important details left visible: the verified kit, the delivery path, and the final amount before you place the order.
            </p>
            <CheckoutForm user={{ id: user.id, fullName: user.full_name, email: user.email, phone: user.phone, role: user.role }} kit={kit} />
          </section>

          <div className="grid gap-6">
            <section className="editorial-frame overflow-hidden rounded-[36px] p-4">
              <div className="relative overflow-hidden rounded-[28px] bg-[var(--panel)]">
                <Image src="/images/hero-books.svg" alt="Curated books prepared for checkout" width={1400} height={1000} className="h-auto w-full object-cover" />
              </div>
            </section>
            <section className="editorial-frame rounded-[36px] p-8">
              <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">Order summary</h2>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm text-[var(--muted-foreground)]"><span>Kit value</span><span>{formatCurrency(kit.price)}</span></div>
                <div className="flex justify-between text-sm text-[var(--muted-foreground)]"><span>Packaging</span><span>{formatCurrency(30)}</span></div>
                <div className="flex justify-between text-sm text-[var(--muted-foreground)]"><span>Delivery</span><span>{formatCurrency(60)}</span></div>
                <div className="editorial-divider" />
                <div className="flex justify-between text-base font-semibold text-[var(--foreground)]"><span>Total payable</span><span>{formatCurrency(total)}</span></div>
              </div>
            </section>

            <section className="editorial-frame rounded-[36px] p-8 space-y-4">
              <div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-5 w-5 text-[var(--accent)]" /><div><h3 className="font-semibold text-[var(--foreground)]">Verified before dispatch</h3><p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">Your order is checked before it leaves the AgliClass team.</p></div></div>
              <div className="flex items-start gap-3"><Truck className="mt-1 h-5 w-5 text-[var(--accent)]" /><div><h3 className="font-semibold text-[var(--foreground)]">Delivery routing</h3><p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">We batch nearby deliveries to keep costs lower and timing smoother.</p></div></div>
              <div className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 text-[var(--accent)]" /><div><h3 className="font-semibold text-[var(--foreground)]">Address review</h3><p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">If something looks unclear, our team checks with you before dispatch.</p></div></div>
              <div className="flex items-start gap-3"><CreditCard className="mt-1 h-5 w-5 text-[var(--accent)]" /><div><h3 className="font-semibold text-[var(--foreground)]">Flexible payments</h3><p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">Choose booking amount, full payment, or cash on delivery.</p></div></div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

