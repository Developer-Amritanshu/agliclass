"use client";

import { useRef, useState } from "react";
import { Linkedin, Mail, SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { StatusBanner } from "@/components/ui/status-banner";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  title?: string;
  body?: string;
};

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<FormState>({ status: "idle" });

  async function onSubmit(formData: FormData) {
    setFormState({
      status: "submitting",
      title: "Sending your message",
      body: "Preparing your note and routing it to the AgliClass inbox.",
    });

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not send your message right now.");
      }

      if (result.fallbackMailto) {
        setFormState({
          status: "success",
          title: "Opening your email app",
          body: "Your message is ready for Amritanshu. Press send there to finish.",
        });
        window.location.href = result.fallbackMailto;
        return;
      }

      formRef.current?.reset();
      setFormState({
        status: "success",
        title: "Message sent",
        body: "Thanks for reaching out. You should hear back in the same email thread.",
      });
    } catch (error) {
      setFormState({
        status: "error",
        title: error instanceof Error ? error.message : "Could not send your message right now.",
        body: "Please check your details and try again.",
      });
    }
  }

  return (
    <div className="editorial-frame rounded-[34px] p-6 md:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--foreground)] text-white">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Contact form</p>
          <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)]">Send a note</h2>
        </div>
      </div>

      <form ref={formRef} action={onSubmit} className="mt-8 grid gap-5">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Name
          </label>
          <Input id="contact-name" name="name" autoComplete="name" placeholder="Your name" required />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Email
          </label>
          <Input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Message
          </label>
          <Textarea
            id="contact-message"
            name="message"
            placeholder="Tell me a little about what you want to build, improve, or ask."
            required
          />
        </div>

        {formState.status !== "idle" && formState.title ? (
          <StatusBanner
            tone={formState.status === "error" ? "error" : formState.status === "success" ? "success" : "pending"}
            title={formState.title}
            body={formState.body}
          />
        ) : null}

        <Button size="lg" loading={formState.status === "submitting"}>
          <SendHorizonal className="h-4 w-4" />
          Send message
        </Button>
      </form>

      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
        <a
          href="mailto:amritanshu360@gmail.com"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 transition hover:bg-[var(--card)] hover:text-[var(--foreground)]"
        >
          <Mail className="h-4 w-4" />
          amritanshu360@gmail.com
        </a>
        <a
          href="https://www.linkedin.com/in/amritanshu-rawat/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 transition hover:bg-[var(--card)] hover:text-[var(--foreground)]"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </a>
      </div>
    </div>
  );
}
