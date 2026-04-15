import { z } from "zod";

import { getFriendlyErrorMessage } from "@/lib/api/error-message";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(4000),
});

function buildMailtoLink(payload: { name: string; email: string; message: string }) {
  const subject = encodeURIComponent(`AgliClass contact from ${payload.name}`);
  const body = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`);
  return `mailto:amritanshu360@gmail.com?subject=${subject}&body=${body}`;
}

export async function sendContactEmail(payload: unknown) {
  const parsed = contactSchema.parse(payload);
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    return {
      delivered: false,
      fallbackMailto: buildMailtoLink(parsed),
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL?.trim() || "AgliClass Contact <onboarding@resend.dev>",
      to: ["amritanshu360@gmail.com"],
      reply_to: parsed.email,
      subject: `AgliClass contact from ${parsed.name}`,
      text: `Name: ${parsed.name}\nEmail: ${parsed.email}\n\nMessage:\n${parsed.message}`,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || "Could not send your message right now.");
  }

  return {
    delivered: true,
    fallbackMailto: null,
  };
}

export function getContactErrorMessage(error: unknown) {
  return getFriendlyErrorMessage(error, "Could not send your message right now.");
}
