import { CircleCheckBig, Clock3, Package, Truck } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { DatabaseRequiredNotice } from "@/components/database-required-notice";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCurrentAppUser } from "@/lib/auth/user";
import { getConfigurationError, getOrderForUser } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

const milestones = [
  { key: "confirmed", label: "Order confirmed", icon: CircleCheckBig },
  { key: "packed", label: "Packed", icon: Package },
  { key: "out_for_delivery", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Clock3 },
];

export const dynamic = "force-dynamic";

export default async function OrderStatusPage({ params }: { params: Promise<{ orderId: string }> }) {
  const configurationError = getConfigurationError();
  if (configurationError) {
    return <div><SiteHeader /><DatabaseRequiredNotice message={configurationError} /></div>;
  }

  const user = await getCurrentAppUser();
  if (!user) {
    redirect("/account");
  }

  const { orderId } = await params;
  const order = await getOrderForUser(orderId, user.id);
  if (!order) notFound();
  const statusIndex = milestones.findIndex((milestone) => milestone.key === order.status);

  return <div><SiteHeader /><main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16"><Card><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="text-sm uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Order tracking</p><h1 className="mt-3 font-display text-4xl text-[var(--foreground)]">{order.id}</h1><p className="mt-3 text-base text-[var(--muted-foreground)]">{order.schoolName} · {order.classLabel}</p></div><Badge tone="accent">{order.status.replaceAll("_", " ")}</Badge></div><div className="mt-8 grid gap-4 md:grid-cols-4">{milestones.map((milestone, index) => { const Icon = milestone.icon; const active = index <= statusIndex; return <div key={milestone.key} className={`rounded-[24px] border p-4 ${active ? "border-[color-mix(in_srgb,var(--accent)_34%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_10%,var(--panel))]" : "border-[var(--border)] bg-[var(--panel)]"}`}><Icon className={`h-5 w-5 ${active ? "text-[var(--accent-strong)]" : "text-[var(--muted-foreground)]"}`} /><p className="mt-4 text-sm font-medium text-[var(--foreground)]">{milestone.label}</p></div>; })}</div><div className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-[24px] bg-[var(--panel)] p-5"><p className="text-sm text-[var(--muted-foreground)]">Buyer</p><p className="mt-2 text-xl font-semibold text-[var(--foreground)]">{order.buyerName}</p></div><div className="rounded-[24px] bg-[var(--panel)] p-5"><p className="text-sm text-[var(--muted-foreground)]">Delivery window</p><p className="mt-2 text-xl font-semibold text-[var(--foreground)]">{order.deliveryWindow}</p></div><div className="rounded-[24px] bg-[var(--panel)] p-5"><p className="text-sm text-[var(--muted-foreground)]">Order value</p><p className="mt-2 text-xl font-semibold text-[var(--foreground)]">{formatCurrency(order.totalAmount)}</p></div></div></Card></main></div>;
}

