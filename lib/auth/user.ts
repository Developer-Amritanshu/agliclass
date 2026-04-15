import { cookies } from "next/headers";
import { z } from "zod";

import { createPasswordHash, createSessionToken, hashText, verifyPassword } from "@/lib/auth/crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/client";

const APP_SESSION_COOKIE = "agliclass_session";
const APP_SESSION_TTL_DAYS = 30;

const registerSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  role: z.enum(["parent", "driver"]).default("parent"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AppUser = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: "parent" | "driver";
};

function getSupabase() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Service is temporarily unavailable.");
  }

  return supabase;
}

function isMissingRoleColumnError(error: unknown) {
  return error instanceof Error && error.message.toLowerCase().includes("app_users.role");
}

function withDefaultRole<T extends { id: string; full_name: string; email: string; phone: string }>(user: T): AppUser {
  return {
    ...user,
    role: "parent",
  };
}

export function getAppSessionCookieName() {
  return APP_SESSION_COOKIE;
}

function getSessionExpiryDate() {
  return new Date(Date.now() + APP_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
}

async function createSessionForUser(userId: string) {
  const supabase = getSupabase();
  const token = createSessionToken();
  const tokenHash = hashText(token);

  const { error } = await supabase.from("app_sessions").insert({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: getSessionExpiryDate().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  return token;
}

export async function registerAppUser(payload: unknown) {
  const parsed = registerSchema.parse(payload);
  const supabase = getSupabase();
  const normalizedEmail = parsed.email.trim().toLowerCase();

  const { data: existing } = await supabase.from("app_users").select("id").eq("email", normalizedEmail).maybeSingle();

  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const baseInsert = {
    full_name: parsed.full_name.trim(),
    email: normalizedEmail,
    phone: parsed.phone.trim(),
    password_hash: createPasswordHash(parsed.password),
  };

  const primary = await supabase
    .from("app_users")
    .insert({
      ...baseInsert,
      role: parsed.role,
    })
    .select("id,full_name,email,phone,role")
    .single();

  let user: AppUser | null = null;

  if (!primary.error && primary.data) {
    user = primary.data as AppUser;
  } else if (isMissingRoleColumnError(primary.error ? new Error(primary.error.message) : null)) {
    const fallback = await supabase.from("app_users").insert(baseInsert).select("id,full_name,email,phone").single();

    if (fallback.error || !fallback.data) {
      throw new Error(fallback.error?.message ?? "Unable to create account.");
    }

    user = withDefaultRole(fallback.data);
  } else {
    throw new Error(primary.error?.message ?? "Unable to create account.");
  }

  const sessionToken = await createSessionForUser(user.id);
  return { user, sessionToken };
}

export async function loginAppUser(payload: unknown) {
  const parsed = loginSchema.parse(payload);
  const supabase = getSupabase();
  const normalizedEmail = parsed.email.trim().toLowerCase();

  const primary = await supabase
    .from("app_users")
    .select("id,full_name,email,phone,role,password_hash")
    .eq("email", normalizedEmail)
    .maybeSingle();

  let data: { id: string; full_name: string; email: string; phone: string; password_hash: string; role?: "parent" | "driver" } | null = null;

  if (!primary.error) {
    data = primary.data;
  } else if (isMissingRoleColumnError(new Error(primary.error.message))) {
    const fallback = await supabase.from("app_users").select("id,full_name,email,phone,password_hash").eq("email", normalizedEmail).maybeSingle();

    if (fallback.error) {
      throw new Error(fallback.error.message);
    }

    data = fallback.data ? { ...fallback.data, role: "parent" } : null;
  } else {
    throw new Error(primary.error.message);
  }

  if (!data || !verifyPassword(parsed.password, data.password_hash)) {
    throw new Error("Email or password is incorrect.");
  }

  const sessionToken = await createSessionForUser(data.id);

  return {
    user: {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      role: data.role ?? "parent",
    } as AppUser,
    sessionToken,
  };
}

export async function getCurrentAppUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(APP_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return getAppUserFromToken(token);
}

export async function getAppUserFromToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const supabase = getSupabase();
  const tokenHash = hashText(token);

  const { data, error } = await supabase
    .from("app_sessions")
    .select("user_id,expires_at")
    .eq("token_hash", tokenHash)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const primary = await supabase.from("app_users").select("id,full_name,email,phone,role").eq("id", data.user_id).single();

  if (!primary.error) {
    return primary.data as AppUser;
  }

  if (isMissingRoleColumnError(new Error(primary.error.message))) {
    const fallback = await supabase.from("app_users").select("id,full_name,email,phone").eq("id", data.user_id).single();

    if (fallback.error) {
      throw new Error(fallback.error.message);
    }

    return withDefaultRole(fallback.data);
  }

  throw new Error(primary.error.message);
}

export async function clearAppSession(token?: string | null) {
  if (!token) {
    return;
  }

  const supabase = getSupabase();
  await supabase.from("app_sessions").delete().eq("token_hash", hashText(token));
}
