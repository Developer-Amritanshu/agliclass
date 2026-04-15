import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";

export function hashText(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derived = scryptSync(password, salt, 64);
  const existing = Buffer.from(hash, "hex");

  if (derived.length !== existing.length) {
    return false;
  }

  return timingSafeEqual(derived, existing);
}

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}
