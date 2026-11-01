import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_NAME = "private_session";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;
export const STORE_NAME = "private-files";

const sha256 = (value: string) => createHash("sha256").update(value).digest();

/** Compares two strings without leaking their length or contents through timing. */
export function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha256(a), sha256(b));
}

function sign(expires: string, secret: string): string {
  return createHmac("sha256", secret).update(expires).digest("hex");
}

/** A cookie value of the form "<expiry unix seconds>.<hmac>". */
export function createSession(secret: string): string {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${expires}.${sign(expires, secret)}`;
}

export function isValidSession(
  cookieHeader: string | null,
  secret: string | undefined,
): boolean {
  if (!secret || !cookieHeader) return false;
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;

  const [expires, signature] = match.slice(COOKIE_NAME.length + 1).split(".");
  if (!expires || !signature) return false;
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now() / 1000) {
    return false;
  }
  return safeEqual(signature, sign(expires, secret));
}

export function sessionCookie(value: string, maxAge: number): string {
  return `${COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

/** Headers that keep private responses out of caches and search engines. */
export const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
};
