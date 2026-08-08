/**
 * Recompresses the seed image library.
 *
 * The originals mined from the old site run up to 8 MB each (107 MB total). They
 * are uploaded verbatim into the media library by `pnpm seed`, so every project
 * card on the site ends up backed by a multi-megabyte source that the image
 * optimizer has to fetch and decode on first request.
 *
 * This caps every file at MAX_EDGE px and re-encodes at QUALITY, keeping the
 * relative path AND extension identical so the paths in scripts/seed-data/*
 * keep resolving.
 *
 * Run with: node scripts/compress-images.mjs [srcDir] [destDir]
 * Defaults:  public/images -> scripts/seed-assets/images
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve(process.argv[2] ?? "public/images");
const DEST = path.resolve(process.argv[3] ?? "scripts/seed-assets/images");
const MAX_EDGE = 2000;
const QUALITY = 80;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
let before = 0;
let after = 0;
let skipped = 0;

for (const file of files) {
  const rel = path.relative(SRC, file);
  const out = path.join(DEST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const srcBytes = fs.statSync(file).size;
  const ext = path.extname(file).toLowerCase();

  // withoutEnlargement keeps already-small assets (logos, social icons) untouched
  // dimensionally; the re-encode below is what shrinks them.
  let pipeline = sharp(file).rotate().resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: QUALITY });
  } else {
    pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
  }

  let buf;
  try {
    buf = await pipeline.toBuffer();
  } catch (err) {
    // Mislabelled or corrupt source (wrong extension, unsupported variant).
    // Pass it through untouched rather than losing the asset.
    console.warn(`  ! ${rel} — ${err.message.trim()} (copied as-is)`);
    fs.copyFileSync(file, out);
    skipped += 1;
    before += srcBytes;
    after += srcBytes;
    continue;
  }

  // Never write a bigger file than we started with — some assets are already
  // optimal and re-encoding would only add weight.
  if (buf.length >= srcBytes) {
    fs.copyFileSync(file, out);
    skipped += 1;
    before += srcBytes;
    after += srcBytes;
    continue;
  }

  fs.writeFileSync(out, buf);
  before += srcBytes;
  after += buf.length;
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";
console.log(`${files.length} images  ${mb(before)} -> ${mb(after)}  (${skipped} left as-is)`);
console.log(`written to ${DEST}`);
