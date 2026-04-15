"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ClipboardList, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBanner } from "@/components/ui/status-banner";
import type { DriverProfileView, OrderView } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils";

export function AdminOrderManager({ orders, drivers }: { orders: OrderView[]; drivers: DriverProfileView[] }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState(orders[0]?.id ?? "");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error" | "pending"; title: string; body?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const activeOrder = useMemo(() => orders.find((item) => item.id === activeId) ?? orders[0], [activeId, orders]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setFeedback({ tone: "pending", title: "Saving delivery assignment", body: "Updating driver assignment and delivery status." });

    const rawDriverId = String(formData.get("delivery_driver_id") ?? "");
    const payload = {
      id: String(formData.get("id") ?? ""),
      delivery_driver_id: rawDriverId || null,
      fulfillment_status: String(formData.get("fulfillment_status") ?? "confirmed"),
      delivery_window: String(formData.get("delivery_window") ?? ""),
    };

    const response = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setFeedback({ tone: "error", title: result.error ?? "Could not save delivery assignment." });
      return;
    }

    setFeedback({ tone: "success", title: "Order updated", body: "Delivery driver and status are now saved." });
    router.refresh();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Order pipeline</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">Orders</h2>
          </div>
          <div className="rounded-full bg-[var(--panel)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]">{orders.length} orders</div>
        </div>
        <div className="mt-6 grid gap-3">
          {orders.length === 0 ? (
            <StatusBanner tone="info" title="No live orders yet" body="New customer orders will appear here for delivery assignment." />
          ) : orders.map((order) => (
            <button
              key={order.id}
              type="button"
              className={`rounded-[24px] border p-5 text-left transition ${order.id === activeOrder?.id ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,var(--panel))]" : "border-[var(--border)] bg-[var(--panel)] hover:border-[var(--foreground)]/10"}`}
              onClick={() => setActiveId(order.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">{order.schoolName}</p>
                  <h3 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[var(--foreground)]">{order.classLabel}</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{order.id}</p>
                </div>
                <span className="rounded-full bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]">{order.status.replaceAll("_", " ")}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
                <span>{order.deliveryWindow}</span>
                <span className="font-semibold text-[var(--foreground)]">{formatCurrency(order.totalAmount)}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <div className="grid gap-5">
        <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
          <Truck className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">Delivery assignment</h2>
          {activeOrder ? (
            <form action={handleSubmit} className="mt-5 grid gap-4">
              <input type="hidden" name="id" value={activeOrder.id} />
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Assign driver</label>
                <Select name="delivery_driver_id" defaultValue={activeOrder.deliveryDriverId || ""}>
                  <option value="">Keep unassigned</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>{driver.fullName} · {driver.city}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Delivery status</label>
                <Select name="fulfillment_status" defaultValue={activeOrder.status}>
                  <option value="confirmed">Confirmed</option>
                  <option value="packed">Packed</option>
                  <option value="out_for_delivery">Out for delivery</option>
                  <option value="delivered">Delivered</option>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Delivery window message</label>
                <Input name="delivery_window" defaultValue={activeOrder.deliveryWindow} />
              </div>
              {feedback ? <StatusBanner tone={feedback.tone} title={feedback.title} body={feedback.body} /> : null}
              <Button type="submit" loading={loading}>Save assignment</Button>
            </form>
          ) : (
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">Select an order to assign a driver.</p>
          )}
        </section>
        <section className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
          <ClipboardList className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[var(--foreground)]">Live delivery state</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">Assign available drivers from the live list and keep the buyer-facing delivery window updated from this panel.</p>
        </section>
      </div>
    </div>
  );
}
