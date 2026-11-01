import type { Config } from "@netlify/functions";
import {
  createSession,
  privateHeaders,
  safeEqual,
  sessionCookie,
  SESSION_SECONDS,
} from "../lib/session.mts";

const json = (body: unknown, status: number, extra: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...privateHeaders, ...extra },
  });

export default async (req: Request) => {
  const password = process.env.PRIVATE_PASSWORD;
  const secret = process.env.PRIVATE_SESSION_SECRET;
  if (!password || !secret) {
    return json({ error: "Private files aren't configured." }, 500);
  }

  const url = new URL(req.url);

  if (url.pathname.endsWith("/logout")) {
    return json({ ok: true }, 200, { "Set-Cookie": sessionCookie("", 0) });
  }

  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  let submitted = "";
  try {
    const body = await req.json();
    submitted = typeof body?.password === "string" ? body.password : "";
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (!safeEqual(submitted, password)) {
    // A short delay makes guessing passwords in bulk slower.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return json({ error: "Wrong password." }, 401);
  }

  return json({ ok: true }, 200, {
    "Set-Cookie": sessionCookie(createSession(secret), SESSION_SECONDS),
  });
};

export const config: Config = {
  path: ["/api/private/login", "/api/private/logout"],
};
