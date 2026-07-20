/**
 * One-time seeder: migrates the legacy hardcoded content (scripts/seed-data/*)
 * into Payload. Images are read from /public and uploaded through the media
 * collection (stored in Vercel Blob when BLOB_READ_WRITE_TOKEN is set).
 *
 * Run with: pnpm seed
 * Idempotent: skips any collection/global that already has content.
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
const { site, stats, prayer, forms } = await import("./seed-data/site");
const { board, generalMembers, voices } = await import("./seed-data/members");
const { projects, avenues, flagship, heroStrip } = await import("./seed-data/projects");
const { newsletters, scrapbooks } = await import("./seed-data/publications");

const payload = await getPayload({ config });
const ctx = () => ({ disableRevalidate: true });

// ---- media -----------------------------------------------------------------
const mediaCache = new Map<string, number>();

async function uploadImage(publicPath: string, alt: string): Promise<number> {
  const cached = mediaCache.get(publicPath);
  if (cached !== undefined) return cached;
  const filePath = path.resolve("public", "." + publicPath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing image file: ${filePath}`);
  }
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
    context: ctx(),
  });
  mediaCache.set(publicPath, doc.id as number);
  console.log(`  media ✓ ${publicPath}`);
  return doc.id as number;
}

async function isEmpty(collection: "members" | "projects" | "flagship-projects" | "publications" | "voices") {
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
    await payload.create({
      collection: "projects",
      data: {
        title: p.title,
        avenue: p.avenue,
        description: p.description,
        image: await uploadImage(p.image, p.title),
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

// ---- publications ----------------------------------------------------------
if (await isEmpty("publications")) {
  console.log("Seeding publications…");
  let order = 0;
  for (const n of newsletters) {
    await payload.create({
      collection: "publications",
      data: {
        title: n.title,
        type: "newsletter",
        cover: await uploadImage(n.cover, `${n.title} newsletter cover`),
        pdfUrl: n.pdf,
        order: (order += 10),
      },
      context: ctx(),
    });
  }
  order = 0;
  for (const s of scrapbooks) {
    await payload.create({
      collection: "publications",
      data: {
        title: s.title,
        type: "scrapbook",
        cover: await uploadImage(s.cover, `${s.title} scrapbook cover`),
        pdfUrl: s.pdf,
        order: (order += 10),
      },
      context: ctx(),
    });
  }
} else {
  console.log("publications already seeded — skipping");
}

// ---- voices ----------------------------------------------------------------
if (await isEmpty("voices")) {
  console.log("Seeding voices…");
  let order = 0;
  for (const v of voices) {
    await payload.create({
      collection: "voices",
      data: {
        name: v.name,
        role: v.role,
        quote: v.quote,
        image: await uploadImage(v.image, v.name),
        order: (order += 10),
      },
      context: ctx(),
    });
  }
} else {
  console.log("voices already seeded — skipping");
}

// ---- site settings ---------------------------------------------------------
{
  const existing = await payload.findGlobal({ slug: "site-settings" });
  if (!existing.name) {
    console.log("Seeding site settings…");
    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        name: site.name,
        shortName: site.shortName,
        parent: site.parent,
        clubId: site.clubId,
        group: site.group,
        district: site.district,
        chartered: site.chartered,
        charterPresident: site.charterPresident,
        tagline: site.tagline,
        description: site.description,
        url: site.url,
        phone: site.phone,
        email: site.email,
        socials: site.socials.map((s) => ({ label: s.label, href: s.href })),
        forms: {
          contact: forms.contact,
          join: forms.join,
          bloodDonor: forms.bloodDonor,
        },
        prayer,
      },
      context: ctx(),
    });
  } else {
    console.log("site-settings already seeded — skipping");
  }
}

// ---- home page -------------------------------------------------------------
{
  const existing = await payload.findGlobal({ slug: "home-page" });
  if (!existing.heroStrip?.length) {
    console.log("Seeding home page…");
    const avenueImages: Record<string, string> = {
      club: "/images/projects/club/06.jpg",
      community: "/images/projects/community/03.jpg",
      professional: "/images/projects/professional/05.jpg",
      international: "/images/projects/international/03.jpg",
      district: "/images/projects/district/05.jpg",
    };
    await payload.updateGlobal({
      slug: "home-page",
      data: {
        heroStrip: await Promise.all(
          heroStrip.map(async (c) => ({
            title: c.title,
            stat: c.stat,
            image: await uploadImage(c.image, c.title),
          })),
        ),
        avenues: await Promise.all(
          avenues.map(async (a) => ({
            avenue: a.key,
            slug: a.slug,
            accent: a.accent,
            blurb: a.blurb,
            image: await uploadImage(avenueImages[a.slug], a.key),
          })),
        ),
        stats: stats.map((s) => ({
          value: s.value,
          suffix: s.suffix,
          label: s.label,
          body: s.body,
        })),
      },
      context: ctx(),
    });
  } else {
    console.log("home-page already seeded — skipping");
  }
}

// ---- about page ------------------------------------------------------------
{
  const existing = await payload.findGlobal({ slug: "about-page" });
  if (!existing.timeline?.length) {
    console.log("Seeding about page…");
    const storyImages = [
      { src: "/images/story/01.webp", alt: "Rotaract Club of Coimbatore Gaalaxy — early club events" },
      { src: "/images/story/02.webp", alt: "Club service and community outreach activities" },
      { src: "/images/story/03.webp", alt: "Rotaractors at a project event" },
      { src: "/images/story/04.webp", alt: "Fellowship and team activities" },
      { src: "/images/story/05.webp", alt: "Installation and leadership ceremony" },
    ];
    await payload.updateGlobal({
      slug: "about-page",
      data: {
        storyImages: await Promise.all(
          storyImages.map(async (s) => ({
            image: await uploadImage(s.src, s.alt),
            alt: s.alt,
          })),
        ),
        storyParagraphs: [
          { text: "The Rotaract Club of Coimbatore Gaalaxy was born under the passionate mentorship of the Rotary Club of Coimbatore Gaalaxy and the visionary leadership of Charter President Rtr. Jagadeesan. Since its founding, the club has stood as a dynamic platform for young individuals to cultivate leadership, foster personal growth, and contribute meaningfully to society — true to the global spirit of Rotaract." },
          { text: "Over the years, the club has evolved into a powerhouse of innovation and service — a strong membership base of dedicated Rotaractors, including district trainers, upholding the Rotaract motto of fellowship through service. From flagship ventures like VANCHI, Abled Covai Trophy, Gaalaxy Unavagam, and Petti Kadai, to inclusive platforms like the Indian Para Cricket League and Aasan, our projects speak volumes about our commitment to inclusivity, empowerment, and community welfare." },
          { text: "Operating on an annual budget of ₹10–15 lakhs, we have garnered the support of CSR collaborators, stakeholders, and local bodies — making every rupee count. With over 15 years of unwavering legacy, the Rotaract Club of Coimbatore Gaalaxy has grown into a beacon of youth-driven change." },
        ],
        manifesto: [
          { text: "A force that educates.", accent: "text-comet" },
          { text: "A force that empowers.", accent: "text-starlight" },
          { text: "A force that breaks barriers.", accent: "text-cranberry" },
        ],
        timeline: [
          { year: "2009", title: "The charter", body: "Born on 30 November 2009 under the mentorship of the Rotary Club of Coimbatore Gaalaxy and Charter President Rtr. Jagadeesan." },
          { year: "2019", title: "VANCHI begins", body: "Our flagship tribal-upliftment initiative launches — two editions serving the Irula tribe across Sadivayal and Karamadai, 30+ beneficiaries per phase." },
          { year: "2024", title: "Barriers break", body: "Coimbatore's first para-sports fest, PETTI KADAI entrepreneurship, and the club welcomes its first transgender member." },
          { year: "2025", title: "IPCL goes national", body: "IPCL 2.0 brings 60+ para-athletes from 14 states and 1 UT to 22 Yards, Coimbatore." },
          { year: "Today", title: "God Mode", body: "42 members, 5 district trainers, an annual budget of ₹10–15 lakhs, and a 500-project legacy that keeps compounding." },
        ],
      },
      context: ctx(),
    });
  } else {
    console.log("about-page already seeded — skipping");
  }
}

console.log("Seed complete.");
process.exit(0);
