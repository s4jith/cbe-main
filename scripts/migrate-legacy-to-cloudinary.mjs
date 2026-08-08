/**
 * One-off migration: uploads the processed archive photos in
 * scripts/seed-assets/images/legacy/*.webp into the legacy-photos collection,
 * which routes through Cloudinary (see src/lib/cloudinaryAdapter.ts) rather
 * than the local filesystem or Vercel Blob. Sources live outside public/ so
 * they aren't shipped in the deployment — same convention as the main seed's
 * scripts/seed-assets/images.
 *
 * Source images were already produced by scripts/process-legacy-images.mjs
 * (re-oriented, capped at 1600px, re-encoded as WebP) — this script only
 * uploads them, it does no further processing.
 *
 * Run with: node scripts/migrate-legacy-to-cloudinary.mjs
 * Idempotent: refuses to run if legacy-photos already has documents, so it's
 * safe to leave in the repo rather than a delete-after-use throwaway.
 */
import fs from "node:fs";
import path from "node:path";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=("?)(.*?)\2$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[3];
  }
}
loadEnv(".env.local");
loadEnv(".env");

const { getPayload } = await import("payload");
const { default: config } = await import("../src/payload.config.ts");
const payload = await getPayload({ config });

const { totalDocs } = await payload.count({ collection: "legacy-photos" });
if (totalDocs > 0) {
  console.log(`legacy-photos already has ${totalDocs} document(s) — skipping. Delete them in the admin first to re-run.`);
  process.exit(0);
}

const DIR = path.resolve("scripts/seed-assets/images/legacy");
const files = fs
  .readdirSync(DIR)
  .filter((f) => /\.webp$/i.test(f))
  .sort();

console.log(`Uploading ${files.length} photos to Cloudinary…`);
let order = 0;
let failed = 0;
for (const file of files) {
  order += 10;
  try {
    const doc = await payload.create({
      collection: "legacy-photos",
      data: { order },
      filePath: path.join(DIR, file),
      context: { disableRevalidate: true },
    });
    console.log(`  ✓ ${file} -> ${doc.url}`);
  } catch (err) {
    failed += 1;
    console.warn(`  ! ${file} — ${err.message}`);
  }
}

const { totalDocs: finalCount } = await payload.count({ collection: "legacy-photos" });
console.log(`\nDone: ${finalCount} photos in legacy-photos${failed ? `, ${failed} failed` : ""}.`);
process.exit(failed ? 1 : 0);
