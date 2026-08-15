/**
 * Seeds the content added in the UI overhaul: the five avenues, and the two
 * contact email templates.
 *
 * Separate from scripts/seed.ts because that one is a single-shot migration of
 * the legacy site and is expected to have already run. This is safe to run on a
 * populated database — every step checks first and skips.
 *
 * Run with: pnpm seed:cms
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
const { home } = await import("../src/lib/defaults");

const payload = await getPayload({ config });
const ctx = () => ({ disableRevalidate: true });

const SEED_ASSETS = "scripts/seed-assets";
const PUBLIC_DIR = "public";

/**
 * Avenue photography lives in public/images/avenues on this repo rather than in
 * scripts/seed-assets, so look in both before giving up.
 */
/**
 * Reuse a media document that already holds this file rather than uploading a
 * second copy — `pnpm seed` may have put the same photographs in the library
 * already, and duplicates there are a nuisance to clean up by hand.
 */
async function findExistingMedia(publicPath: string): Promise<string | undefined> {
  const base = path.basename(publicPath).replace(/\.[^.]+$/, "");
  const { docs } = await payload.find({
    collection: "media",
    where: { filename: { like: base } },
    limit: 1,
  });
  return docs[0] ? String(docs[0].id) : undefined;
}

async function uploadImage(publicPath: string, alt: string): Promise<string> {
  const existing = await findExistingMedia(publicPath);
  if (existing) return existing;

  const candidates = [
    path.resolve(SEED_ASSETS, "." + publicPath),
    path.resolve(PUBLIC_DIR, "." + publicPath),
  ];
  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) {
    throw new Error(
      `No image found for ${publicPath}. Looked in ${SEED_ASSETS} and ${PUBLIC_DIR}. ` +
        `Avenues require a photograph, so add the file or upload one in the admin instead.`,
    );
  }
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
    context: ctx(),
  });
  return String(doc.id);
}

/** Minimal Lexical document — one paragraph per line of text. */
function richText(lines: string[]) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: lines.map((text) => ({
        type: "paragraph",
        format: "" as const,
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        textFormat: 0,
        children: [
          {
            type: "text",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
            version: 1,
          },
        ],
      })),
    },
  };
}

// ---- avenues ---------------------------------------------------------------
const { totalDocs: avenueCount } = await payload.count({ collection: "avenues" });
if (avenueCount === 0) {
  console.log("Seeding avenues…");
  let order = 0;
  for (const a of home.avenues) {
    await payload.create({
      collection: "avenues",
      data: {
        name: a.key,
        slug: a.slug,
        description: a.blurb,
        accentColor: a.accent,
        order: (order += 10),
        image: await uploadImage(a.image, a.key),
      },
      context: ctx(),
    });
    console.log(`  · ${a.key}`);
  }
} else {
  console.log(`avenues already has ${avenueCount} entries — skipping`);
}

// ---- home intro ------------------------------------------------------------
// The curtain needs at least two photographs or the component skips itself, so
// seed it with the archive event photography the site already ships.
const homeIntro = await payload.findGlobal({ slug: "home-intro" });
if (!homeIntro?.panelImages || homeIntro.panelImages.length === 0) {
  console.log("Seeding the home intro curtain…");
  const panels = [
    "/images/hero-strip/aravam.jpg",
    "/images/hero-strip/sayboo.webp",
    "/images/hero-strip/rota-lin.webp",
    "/images/hero-strip/petti-kadai.webp",
    "/images/hero-strip/ipcl.webp",
    "/images/hero-strip/vanchi.webp",
  ];
  const panelImages = [];
  for (const p of panels) {
    // Alt is intentionally empty: these are decorative panels behind the mark,
    // and two of these filenames do not describe their subject (see defaults.ts).
    panelImages.push({ image: await uploadImage(p, "") });
  }
  await payload.updateGlobal({
    slug: "home-intro",
    data: { enabled: true, headline: "We don't serve, we rise.", panelImages },
    context: ctx(),
  });
} else {
  console.log("home intro already has photographs — skipping");
}

// ---- members: backfill the Rotaract year -----------------------------------
// `year` arrived after the members did, so every existing record needs one
// before the board's year tabs have anything to group by.
const { currentRotaractYear } = await import("../src/collections/Members");
const thisYear = currentRotaractYear();
const { docs: yearless } = await payload.find({
  collection: "members",
  where: { year: { exists: false } },
  pagination: false,
  depth: 0,
});
if (yearless.length > 0) {
  console.log(`Backfilling year=${thisYear} on ${yearless.length} members…`);
  for (const m of yearless) {
    await payload.update({
      collection: "members",
      id: m.id,
      data: { year: thisYear },
      context: ctx(),
    });
  }
} else {
  console.log("every member already has a year — skipping");
}

// ---- faqs ------------------------------------------------------------------
const { totalDocs: faqCount } = await payload.count({ collection: "faqs" });
if (faqCount === 0) {
  console.log("Seeding starter FAQs…");
  const faqs = [
    {
      question: "How do I join Rotaract Coimbatore Main?",
      answer:
        "Fill in the membership form on our Join page and we will get in touch. We welcome anyone between 18 and 30 who wants to serve, lead and grow with us — no prior experience needed.",
    },
    {
      question: "Do I need to be a college student to join?",
      answer:
        "No. We are a community-based club, so students and working professionals are both welcome. What matters is the willingness to show up and contribute.",
    },
    {
      question: "What kind of projects does the club run?",
      answer:
        "Our work spans five avenues of service — club, community, professional, international and district priority projects. Blood drives, insulin support for children, career sessions and international collaborations all sit within them.",
    },
    {
      question: "Is there a membership fee?",
      answer:
        "There is a nominal annual fee that covers district and international affiliation. Reach out through the contact form and we will walk you through the current figure.",
    },
    {
      question: "Can I help without becoming a member?",
      answer:
        "Absolutely. Our blood donor registry is open to everyone — register once and we will only contact you when a request matches. You can also volunteer at individual projects.",
    },
    {
      question: "How do I stay updated on upcoming events?",
      answer:
        "Follow us on Instagram and keep an eye on the Events page, where every upcoming project and event is listed with its date and venue.",
    },
  ];
  let faqOrder = 0;
  for (const f of faqs) {
    await payload.create({
      collection: "faqs",
      data: { ...f, order: (faqOrder += 10) },
      context: ctx(),
    });
  }
} else {
  console.log(`faqs already has ${faqCount} entries — skipping`);
}

// ---- email templates -------------------------------------------------------
const adminEmail = await payload.findGlobal({ slug: "admin-contact-email" });
if (!adminEmail?.richTextBody) {
  console.log("Seeding admin notification email…");
  await payload.updateGlobal({
    slug: "admin-contact-email",
    data: {
      subject: "New enquiry from {name}",
      richTextBody: richText([
        "Somebody just wrote to the club through the website.",
        "Their message is below — reply to this email and it goes straight back to them.",
      ]),
      footerNote: "Sent automatically by the website contact form.",
    },
    context: ctx(),
  });
} else {
  console.log("admin notification email already written — skipping");
}

const userEmail = await payload.findGlobal({ slug: "user-contact-email" });
if (!userEmail?.richTextBody) {
  console.log("Seeding sender acknowledgement email…");
  await payload.updateGlobal({
    slug: "user-contact-email",
    data: {
      subject: "Thanks for writing to us, {name}",
      richTextBody: richText([
        "Hi {name},",
        "Thanks for getting in touch with the Rotaract Club of Coimbatore Main. We have your message and someone from the club will come back to you shortly.",
        "A copy of what you sent is below, just so you have it.",
      ]),
      footerNote: "You're receiving this because you used the contact form on our website.",
    },
    context: ctx(),
  });
} else {
  console.log("sender acknowledgement email already written — skipping");
}

console.log("CMS seed complete.");
process.exit(0);
