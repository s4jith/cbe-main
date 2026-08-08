/**
 * One-off processing of the "MAIN legacy" photo drop into web-ready assets.
 *
 * Source files are a raw export (UUID filenames, mixed JPEG/HEIC, up to 6.5 MB
 * each) — this re-orients by EXIF, caps the long edge at MAX_EDGE, re-encodes as
 * WebP, and writes sequential filenames into public/images/legacy/. It also
 * captures each image's final width/height so the gallery can render without
 * layout shift, and prints a manifest to paste into src/lib/defaults.ts.
 *
 * Run with: node scripts/process-legacy-images.mjs
 * One-off by design — not wired into `pnpm seed`.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("MAIN legacy");
// Outside public/ — these are uploaded to Cloudinary by
// scripts/migrate-legacy-to-cloudinary.mjs, not served locally.
const DEST = path.resolve("scripts/seed-assets/images/legacy");
const MAX_EDGE = 1600;
const QUALITY = 78;

fs.mkdirSync(DEST, { recursive: true });

const files = fs
  .readdirSync(SRC)
  .filter((f) => /\.(jpe?g|heic)$/i.test(f))
  .sort();

const manifest = [];
const failed = [];
let i = 0;
for (const file of files) {
  i += 1;
  const name = `legacy-${String(i).padStart(2, "0")}.webp`;
  try {
    const buf = await sharp(path.join(SRC, file))
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    fs.writeFileSync(path.join(DEST, name), buf);
    const meta = await sharp(buf).metadata();
    manifest.push({ src: `/images/legacy/${name}`, width: meta.width, height: meta.height });
    console.log(`${name}  ${meta.width}x${meta.height}  (from ${file})`);
  } catch (err) {
    failed.push(file);
    i -= 1; // keep filenames sequential/gap-free among the ones that succeeded
    console.warn(`  ! skipped ${file} — ${err.message.trim()}`);
  }
}

console.log(`\n${manifest.length} images written to ${DEST}${failed.length ? `, ${failed.length} skipped: ${failed.join(", ")}` : ""}\n`);
console.log(JSON.stringify(manifest, null, 2));
