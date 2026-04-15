"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBanner } from "@/components/ui/status-banner";
import type { AppUserView, KitView } from "@/lib/data/types";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  title?: string;
  body?: string;
};

export function CheckoutForm({ user, kit }: { user: AppUserView; kit: KitView }) {
  const [formState, setFormState] = useState<FormState>({ status: "idle" });
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setFormState({
      status: "submitting",
      title: "Placing your order",
      body: "Saving your kit request and preparing tracking in your account.",
    });

    const payload = {
      kit_id: kit.id,
      school_name: kit.schoolName,
      class_label: kit.classLabel,
      delivery_address: String(formData.get("delivery_address") ?? ""),
      delivery_mode: String(formData.get("delivery_mode") ?? "home"),
      payment_mode: String(formData.get("payment_mode") ?? "booking"),
      total_amount: kit.price + 30 + 60,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not place your order.");
      }

      setFormState({
        status: "success",
        title: "Order placed successfully",
        body: "Your order is saved. Opening the tracking page now.",
      });
      router.push(`/buyer/orders/${result.order.id}`);
      router.refresh();
    } catch (error) {
      setFormState({
        status: "error",
        title: error instanceof Error ? error.message : "Could not place your order.",
        body: "Please review the address details and try again.",
      });
    }
  }

  return (
    <form action={onSubmit} className="mt-8 grid gap-5">
      <div className="rounded-[28px] bg-[var(--panel)] p-5">
        <p className="text-sm font-semibold text-[var(--foreground)]">Buying as {user.fullName}</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{user.email} · {user.phone}</p>
      </div>
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Selected kit</p>
        <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{kit.schoolName} · {kit.classLabel}</p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{kit.academicYear} · {kit.totalBooks} books</p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Delivery address</label>
        <Input name="delivery_address" placeholder="Rajpur Road, Dehradun" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Delivery mode</label>
          <Select name="delivery_mode" defaultValue="home">
            <option value="home">Home delivery</option>
            <option value="school">School-gate handoff</option>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Payment mode</label>
          <Select name="payment_mode" defaultValue="booking">
            <option value="booking">Booking amount</option>
            <option value="full">Pay full now</option>
            <option value="cod">Cash on delivery</option>
          </Select>
        </div>
      </div>
      {formState.status !== "idle" && formState.title ? (
        <StatusBanner
          tone={formState.status === "error" ? "error" : formState.status === "success" ? "success" : "pending"}
          title={formState.title}
          body={formState.body}
        />
      ) : null}
      <Button size="lg" loading={formState.status === "submitting"}>
        <CreditCard className="h-4 w-4" />
        Place order
      </Button>
      <p className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <MapPin className="h-4 w-4" />
        We will confirm the delivery slot after route planning.
      </p>
    </form>
  );
}
