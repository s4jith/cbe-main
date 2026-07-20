/**
 * Destructive reset used during initial setup: drops the Postgres schema
 * (Payload push recreates it on next boot) and empties the Blob store.
 */
import fs from "node:fs";

function loadEnv(file: string) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=("?)(.*?)\2$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[3];
  }
}
loadEnv(".env.local");

const { getPayload } = await import("payload");
const { default: config } = await import("../src/payload.config");

const payload = await getPayload({ config });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = payload.db as any;
await db.execute({ drizzle: db.drizzle, raw: "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" });
console.log("schema dropped + recreated");

const token = process.env.BLOB_READ_WRITE_TOKEN!;
const { blobs } = await (
  await fetch("https://blob.vercel-storage.com/?limit=1000", {
    headers: { authorization: `Bearer ${token}` },
  })
).json();
for (const b of blobs) {
  await fetch("https://blob.vercel-storage.com/delete", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ urls: [b.url] }),
  });
  console.log("blob deleted:", b.pathname);
}
console.log("wipe complete");
process.exit(0);
