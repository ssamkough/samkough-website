// Manage the private PDFs stored in Netlify Blobs.
//
//   npm run private -- upload <file.pdf> "Title" ["Description"]
//   npm run private -- list
//   npm run private -- delete <name.pdf>
//
// Needs NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN (a Netlify personal access
// token), read from the environment or from a local .env file.
import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import { getStore } from "@netlify/blobs";

const { NETLIFY_SITE_ID, NETLIFY_AUTH_TOKEN } = process.env;
if (!NETLIFY_SITE_ID || !NETLIFY_AUTH_TOKEN) {
  console.error(
    "Set NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN (for example in a .env file).",
  );
  process.exit(1);
}

const store = getStore({
  name: "private-files",
  siteID: NETLIFY_SITE_ID,
  token: NETLIFY_AUTH_TOKEN,
  consistency: "strong",
});

const [command, ...args] = process.argv.slice(2);

/** "Amin Passport (1).PDF" -> "amin-passport-1.pdf" */
function toKey(filename) {
  const name = filename
    .toLowerCase()
    .replace(/\.pdf$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${name || "file"}.pdf`;
}

if (command === "upload") {
  const [path, title, description = ""] = args;
  if (!path || !title) {
    console.error('Usage: upload <file.pdf> "Title" ["Description"]');
    process.exit(1);
  }
  const data = await readFile(path);
  if (data.subarray(0, 5).toString() !== "%PDF-") {
    console.error("That file doesn't look like a PDF.");
    process.exit(1);
  }
  const key = toKey(basename(path));
  const { size } = await stat(path);
  await store.set(key, new Blob([data], { type: "application/pdf" }), {
    metadata: {
      title,
      description,
      size: String(size),
      uploaded: new Date().toISOString().slice(0, 10),
    },
  });
  console.log(`Uploaded as ${key}`);
} else if (command === "list") {
  const { blobs } = await store.list();
  for (const { key } of blobs) {
    const entry = await store.getMetadata(key);
    console.log(`${key}\t${entry?.metadata?.title ?? ""}`);
  }
  if (blobs.length === 0) console.log("No private files.");
} else if (command === "delete") {
  const [key] = args;
  if (!key) {
    console.error("Usage: delete <name.pdf>");
    process.exit(1);
  }
  await store.delete(key);
  console.log(`Deleted ${key}`);
} else {
  console.error("Commands: upload, list, delete");
  process.exit(1);
}
