import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import {
  isValidSession,
  privateHeaders,
  STORE_NAME,
} from "../lib/session.mts";

const PREFIX = "/api/private/files";
const SAFE_KEY = /^[a-z0-9][a-z0-9._-]*\.pdf$/;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...privateHeaders },
  });

export default async (req: Request) => {
  if (!isValidSession(req.headers.get("cookie"), process.env.PRIVATE_SESSION_SECRET)) {
    return json({ error: "Not signed in." }, 401);
  }
  if (req.method !== "GET") return json({ error: "Method not allowed." }, 405);

  const store = getStore({ name: STORE_NAME, consistency: "strong" });
  const { pathname } = new URL(req.url);

  // List: GET /api/private/files
  if (pathname === PREFIX || pathname === `${PREFIX}/`) {
    const { blobs } = await store.list();
    const files = await Promise.all(
      blobs.map(async ({ key }) => {
        const entry = await store.getMetadata(key);
        const meta = (entry?.metadata ?? {}) as Record<string, string>;
        return {
          key,
          title: meta.title ?? key,
          description: meta.description ?? "",
          uploaded: meta.uploaded ?? "",
          size: meta.size ? Number(meta.size) : null,
        };
      }),
    );
    files.sort((a, b) => a.title.localeCompare(b.title));
    return json({ files }, 200);
  }

  // Download: GET /api/private/files/<name>.pdf
  let key: string;
  try {
    key = decodeURIComponent(pathname.slice(PREFIX.length + 1));
  } catch {
    return json({ error: "Not found." }, 404);
  }
  if (!SAFE_KEY.test(key)) return json({ error: "Not found." }, 404);

  const stream = await store.get(key, { type: "stream" });
  if (!stream) return json({ error: "Not found." }, 404);

  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${key}"`,
      ...privateHeaders,
    },
  });
};

export const config: Config = {
  // Netlify reads this statically, so it has to be string literals.
  path: ["/api/private/files", "/api/private/files/*"],
};
