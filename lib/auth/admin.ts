const ADMIN_SESSION_COOKIE = "agliclass_admin_session";
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function stringToBase64Url(value: string) {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

function base64UrlToString(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function signPayload(payload: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

export function getAdminCookieName() {
  return ADMIN_SESSION_COOKIE;
}

export function getAdminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!secret) {
    throw new Error("Admin session secret is not configured.");
  }

  return secret;
}

export async function createAdminSessionValue(username: string) {
  const payload = JSON.stringify({ sub: username, exp: Date.now() + ADMIN_SESSION_TTL_MS });
  const encoded = stringToBase64Url(payload);
  const signature = await signPayload(encoded, getAdminSessionSecret());
  return `${encoded}.${signature}`;
}

export async function verifyAdminSessionValue(value?: string | null) {
  if (!value) {
    return false;
  }

  const [encoded, signature] = value.split(".");

  if (!encoded || !signature) {
    return false;
  }

  const expectedSignature = await signPayload(encoded, getAdminSessionSecret());

  if (signature !== expectedSignature) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlToString(encoded)) as { sub?: string; exp?: number };
    const expectedUser = process.env.ADMIN_USERNAME?.trim();
    return Boolean(expectedUser && payload.sub === expectedUser && payload.exp && payload.exp > Date.now());
  } catch {
    return false;
  }
}
