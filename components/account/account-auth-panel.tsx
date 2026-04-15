"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { KeyRound, ShieldCheck, Truck, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBanner } from "@/components/ui/status-banner";

type Mode = "login" | "register";

type FormState = {
  status: "idle" | "submitting" | "error";
  title?: string;
  body?: string;
};

export function AccountAuthPanel({
  role = "parent",
  nextOverride,
}: {
  role?: "parent" | "driver";
  nextOverride?: string;
}) {
  const [mode, setMode] = useState<Mode>("register");
  const [state, setState] = useState<FormState>({ status: "idle" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const fallbackNext = role === "driver" ? "/drivers" : "/account";
  const next = nextOverride || searchParams.get("next") || fallbackNext;

  async function handleSubmit(formData: FormData) {
    setState({
      status: "submitting",
      title: mode === "register" ? "Creating your account" : "Signing you in",
      body: mode === "register" ? "This only takes a moment." : "Checking your details and opening your dashboard.",
    });

    const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
    const payload =
      mode === "register"
        ? {
            full_name: String(formData.get("full_name") ?? ""),
            email: String(formData.get("email") ?? ""),
            phone: String(formData.get("phone") ?? ""),
            password: String(formData.get("password") ?? ""),
            role,
          }
        : {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
          };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not continue.");
      }

      router.push(next);
      router.refresh();
    } catch (error) {
      setState({
        status: "error",
        title: error instanceof Error ? error.message : "Could not continue.",
        body: mode === "register" ? "Please review your details and try again." : "Please check your email and password and try again.",
      });
    }
  }

  return (
    <div className="editorial-frame rounded-[38px] p-8 md:p-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{role === "driver" ? "Driver access" : "Account"}</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">
            {mode === "register" ? (role === "driver" ? "Create your driver profile" : "Create your AgliClass account") : "Welcome back"}
          </h2>
        </div>
        <div className="flex rounded-full border border-[var(--border)] bg-[var(--panel)] p-1">
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === "register" ? "bg-[var(--foreground)] text-white" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-[var(--foreground)] text-white" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
          >
            Sign in
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-[28px] bg-[var(--panel)] p-5 text-sm text-[var(--muted-foreground)]">
        <div className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
          {role === "driver" ? <Truck className="h-4 w-4 text-[var(--accent)]" /> : <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />}
          {role === "driver" ? "Driver accounts manage pickup and delivery assignments." : "One account lets you buy kits and sell books from the same profile."}
        </div>
      </div>

      <form action={handleSubmit} className="mt-6 grid gap-4">
        {mode === "register" ? (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Full name</label>
              <Input name="full_name" placeholder={role === "driver" ? "Rajat Bisht" : "Aarushi Rawat"} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Phone number</label>
              <Input name="phone" placeholder="+91 98xxxxxx21" required />
            </div>
          </>
        ) : null}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Email address</label>
          <Input name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Password</label>
          <Input name="password" type="password" placeholder="At least 8 characters" required />
        </div>
        {state.status !== "idle" && state.title ? <StatusBanner tone={state.status === "error" ? "error" : "pending"} title={state.title} body={state.body} /> : null}
        <Button size="lg" loading={state.status === "submitting"}>
          {mode === "register" ? <UserPlus className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
          {mode === "register" ? "Create account" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
