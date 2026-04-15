"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBanner } from "@/components/ui/status-banner";

export function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: String(formData.get("username") ?? ""),
        password: String(formData.get("password") ?? ""),
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to sign in.");
      return;
    }

    window.location.href = next;
  }

  return (
    <form action={handleSubmit} className="mt-8 grid gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Admin username</label>
        <Input name="username" placeholder="Enter your admin username" required />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">Password</label>
        <Input name="password" type="password" placeholder="Enter your password" required />
      </div>
      {error ? <StatusBanner tone="error" title={error} /> : null}
      <Button size="lg" loading={loading}>
        <LockKeyhole className="h-4 w-4" />
        Continue to admin
      </Button>
    </form>
  );
}
