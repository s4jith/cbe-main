/**
 * One-time seeder: migrates the legacy hardcoded content (scripts/seed-data/*)
 * into Payload for the three CMS-managed collections — Team, Projects and
 * Flagship Projects. Images are read from scripts/seed-assets and
 * uploaded through the media collection (stored in Vercel Blob when
 * BLOB_READ_WRITE_TOKEN is set). Regenerate that folder from a fresh image drop
 * with scripts/compress-images.mjs.
 *
 * Everything else on the site (theme, header/footer, page copy, site settings)
 * is fixed in code — see src/lib/defaults.ts — and is not seeded here.
 *
 * Run with: pnpm seed
 * Idempotent: skips any collection that already has content.
 */
import fs from "node:fs";
import path from "node:path";

function loadEnv(file: string) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=("?)(.*?)\2$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[3];
  }
}
loadEnv(".env.local");
loadEnv(".env");

const { getPayload } = await import("payload");
const { default: config } = await import("../src/payload.config");
const { board, generalMembers } = await import("./seed-data/members");
const { projects, flagship } = await import("./seed-data/projects");

const payload = await getPayload({ config });
const ctx = () => ({ disableRevalidate: true });

// ---- media -----------------------------------------------------------------
// Mongo document ids are strings — this was `number` from when the project ran on
// Vercel Postgres, which made every media relationship assignment a type error.
const mediaCache = new Map<string, string>();

// Seed sources live outside public/ so they are not shipped with the deployment —
// they exist only to be uploaded into the media library. Paths in seed-data are
// still written as "/images/..." for readability.
const SEED_ASSETS = "scripts/seed-assets";

async function uploadImage(publicPath: string, alt: string): Promise<string> {
  const cached = mediaCache.get(publicPath);
  if (cached !== undefined) return cached;
  const filePath = path.resolve(SEED_ASSETS, "." + publicPath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing image file: ${filePath}`);
  }
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
    context: ctx(),
  });
  mediaCache.set(publicPath, doc.id as string);
  console.log(`  media ✓ ${publicPath}`);
  return doc.id as string;
}

// The legacy member list carries no term of its own, so it seeds as the board
// current at the time of the import; past boards are added in the admin.
const { currentRotaractYear } = await import("../src/collections/Members");
const SEED_YEAR = currentRotaractYear();

async function isEmpty(collection: "members" | "projects" | "flagship-projects") {
  const { totalDocs } = await payload.count({ collection });
  return totalDocs === 0;
}

// ---- members ---------------------------------------------------------------
if (await isEmpty("members")) {
  console.log("Seeding members…");
  let order = 0;
  for (const m of board) {
    await payload.create({
      collection: "members",
      data: {
        name: m.name,
        role: m.role,
        memberType: "board",
        photo: await uploadImage(m.image, m.name),
        year: SEED_YEAR,
        order: (order += 10),
      },
      context: ctx(),
    });
  }
  order = 0;
  for (const m of generalMembers) {
    await payload.create({
      collection: "members",
      data: {
        name: m.name,
        role: m.role,
        memberType: "general",
        photo: await uploadImage(m.image, m.name),
        year: SEED_YEAR,
        order: (order += 10),
      },
      context: ctx(),
    });
  }
} else {
  console.log("members already seeded — skipping");
}

// ---- projects --------------------------------------------------------------
if (await isEmpty("projects")) {
  console.log("Seeding projects…");
  let order = 0;
  for (const p of projects) {
    // The Projects collection requires a month/year (it drives the year/month
    // filters on the site) and none of the legacy entries in seed-data have a
    // real one on file — refuse to import a guessed date rather than seed the
    // site with a wrong one.
    if (!p.date) {
      throw new Error(
        `scripts/seed-data/projects.ts: "${p.title}" has no date set. Add a real ` +
          `month/year ("date: \"2025-03-01\"") to every project in that file before re-running the seed.`,
      );
    }
    await payload.create({
      collection: "projects",
      data: {
        title: p.title,
        avenue: p.avenue,
        description: p.description,
        image: await uploadImage(p.image, p.title),
        date: p.date,
        order: (order += 10),
      },
      context: ctx(),
    });
  }
} else {
  console.log("projects already seeded — skipping");
}

// ---- flagship --------------------------------------------------------------
if (await isEmpty("flagship-projects")) {
  console.log("Seeding flagship projects…");
  let order = 0;
  for (const f of flagship) {
    await payload.create({
      collection: "flagship-projects",
      data: {
        title: f.title,
        tag: f.tag,
        description: f.description,
        stat: f.stat,
        image: await uploadImage(f.image, f.title),
        order: (order += 10),
      },
      context: ctx(),
    });
  }
} else {
  console.log("flagship-projects already seeded — skipping");
}

console.log("Seed complete.");
process.exit(0);
