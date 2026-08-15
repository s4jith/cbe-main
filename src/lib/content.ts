import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import * as D from "@/lib/defaults";
import type {
  AboutContent,
  Accent,
  AvenueEntry,
  AvenueTag,
  BlogPost,
  BlogSummary,
  BoardYear,
  ButtonData,
  ContactContent,
  EventEntry,
  EventStatus,
  EventSummary,
  FaqItem,
  HomeIntroData,
  Picture,
  FlagshipItem,
  FooterData,
  FormPageContent,
  HeaderData,
  Headline,
  HomeContent,
  LegacyPhoto,
  Member,
  NotFoundContent,
  Project,
  ProjectsContent,
  SeoData,
  SharedContent,
  SiteInfo,
  Surface,
  TeamContent,
  Voice,
} from "@/lib/types";

const client = cache(() => getPayload({ config }));

function mediaUrl(media: unknown): string {
  if (media && typeof media === "object" && "url" in media) {
    const url = (media as { url?: unknown }).url;
    if (typeof url === "string") return url;
  }
  return "";
}

/** An upload resolved to src + alt, or null when the relationship is unset. */
function picture(media: unknown, fallbackAlt = ""): Picture | null {
  const src = mediaUrl(media);
  if (!src) return null;
  const alt =
    media && typeof media === "object" && "alt" in media && typeof media.alt === "string"
      ? media.alt
      : "";
  return { src, alt: alt || fallbackAlt };
}

/** Flatten an array-of-uploads field, dropping any row whose image went missing. */
function gallery(rows: unknown, fallbackAlt: string): Picture[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) =>
      picture(
        row && typeof row === "object" && "image" in row ? (row as { image: unknown }).image : null,
        fallbackAlt,
      ),
    )
    .filter((p): p is Picture => p !== null);
}

function isoDate(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Replace {tokens} in copy with live site values. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** The token values available to every piece of copy. */
export function siteVars(site: SiteInfo, extra: Record<string, string | number> = {}) {
  return {
    name: site.name,
    shortName: site.shortName,
    parent: site.parent,
    clubId: site.clubId,
    group: site.group,
    district: site.district,
    chartered: site.chartered,
    charterPresident: site.charterPresident,
    email: site.email,
    phone: site.phone,
    year: new Date().getFullYear(),
    ...extra,
  };
}

// ------------------------------------------------------------------ statics
// Site identity, design and page copy are fixed in code (src/lib/defaults.ts) rather
// than editable in the CMS — only the Team, Projects and Flagship Projects
// lists below are backed by Payload.

function sHeadline(lines: string[]): Headline {
  return { lines };
}

function sSurface(tone: "light" | "dark", starfield = false): Surface {
  return { tone, starfield, hidden: false };
}

function sButton(label: string, href: string, style: ButtonData["style"]): ButtonData {
  return { label, href, style, hidden: false };
}

function sSeo(seo: { title?: string; description?: string; noIndex?: boolean }): SeoData {
  return { title: seo.title, description: seo.description, noIndex: seo.noIndex ?? false };
}

/**
 * Site-wide details, with anything set in the Site Settings global winning over
 * the shipped defaults. Reading the global is what makes this async — every
 * blank field still falls back to src/lib/defaults.ts, so an untouched CMS
 * renders exactly what the site shipped with.
 */
export const getSiteSettings = cache(async (): Promise<SiteInfo> => {
  const payload = await client();
  const cms = await payload.findGlobal({ slug: "site-settings", depth: 0 }).catch(() => null);

  const phone = cms?.phone || D.SITE.phone;
  const email = cms?.email || D.SITE.email;
  const socials =
    cms?.socialLinks && cms.socialLinks.length > 0
      ? cms.socialLinks.map((s) => ({ label: s.platform, href: s.url }))
      : D.SITE.socials;

  return {
    name: D.SITE.name,
    shortName: D.SITE.shortName,
    parent: D.SITE.parent,
    clubId: D.SITE.clubId,
    group: D.SITE.group,
    district: D.SITE.district,
    chartered: D.SITE.chartered,
    charterPresident: D.SITE.charterPresident,
    tagline: D.SITE.tagline,
    description: D.SITE.description,
    url: D.SITE.url,
    phone,
    phoneHref: `tel:${phone.replace(/\s+/g, "")}`,
    email,
    emailHref: `mailto:${email}`,
    shareImage: D.BRAND.shareImage,
    socials,
    forms: D.SITE.forms,
    prayer: D.SITE.prayer,
  };
});

export function getHeader(): HeaderData {
  return {
    logo: D.BRAND.logo,
    logoAlt: D.header.logoAlt,
    logoSize: D.header.logoSize,
    wordmark: D.header.wordmark,
    wordmarkSymbol: D.header.wordmarkSymbol,
    menuLabel: D.header.menuLabel,
    items: D.NAV_LINKS,
    cta: sButton(D.header.cta.label, D.header.cta.href, D.header.cta.style),
  };
}

export const getFooter = cache(async (): Promise<FooterData> => {
  const payload = await client();
  const cms = await payload.findGlobal({ slug: "site-settings", depth: 0 }).catch(() => null);
  const header = getHeader();
  const site = await getSiteSettings();

  // The "get involved" column is the only editable one — the others are derived
  // from the nav, the socials and the contact details, so editing them here
  // would just be a second place for the same links to drift out of sync.
  const editableLinks =
    cms?.footerLinks && cms.footerLinks.length > 0
      ? cms.footerLinks.map((l) => ({ label: l.label, href: l.url }))
      : null;

  const columns = D.footer.columns.map((c) => {
    if (c.source === "menu") return { title: c.title, links: header.items };
    if (c.source === "socials") return { title: c.title, links: site.socials };
    if (c.source === "contact") {
      return {
        title: c.title,
        links: [
          { label: site.email, href: site.emailHref },
          { label: site.phone, href: site.phoneHref },
        ].filter((l) => l.label),
      };
    }
    return { title: c.title, links: editableLinks ?? c.links };
  });

  return {
    brandText: D.footer.brandText,
    brandSymbol: D.footer.brandSymbol,
    brandLine: D.footer.brandLine,
    columns,
    menu: editableLinks ?? D.FOOTER_LINKS,
    wordmark: D.footer.wordmark,
    copyright: cms?.copyrightText || D.footer.copyright,
    note: site.tagline.split(".")[0] + ".",
    starfield: true,
  };
});

export function getShared(): SharedContent {
  return {
    cta: {
      symbol: D.cta.symbol,
      headline: sHeadline(D.cta.headline),
      body: D.cta.body,
      primary: sButton(D.cta.primary.label, D.cta.primary.href, D.cta.primary.style),
      secondary: sButton(D.cta.secondary.label, D.cta.secondary.href, D.cta.secondary.style),
      surface: sSurface("dark"),
    },
    fourWayTest: {
      eyebrow: D.fourWayTest.eyebrow,
      items: D.fourWayTest.items,
      surface: sSurface("light"),
    },
  };
}

// ------------------------------------------------------------------ Payload-backed content
// The only content editors manage in the admin: Team, Projects, Flagship
// Projects and Legacy Photos — everything else above is fixed in code.

export const getMembers = cache(async (memberType: "board" | "general"): Promise<Member[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "members",
    where: { memberType: { equals: memberType } },
    sort: "order",
    pagination: false,
    depth: 1,
  });
  return docs.map((d) => ({
    name: d.name,
    role: d.role,
    image: mediaUrl(d.photo),
    bio: d.bio ?? "",
    year: typeof d.year === "number" ? d.year : null,
  }));
});

export const getFaqs = cache(async (): Promise<FaqItem[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "faqs",
    sort: "order",
    pagination: false,
    depth: 0,
  });
  return docs.map((d) => ({ id: String(d.id), question: d.question, answer: d.answer }));
});

export const getProjects = cache(async (): Promise<Project[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "projects",
    sort: "order",
    pagination: false,
    depth: 1,
  });
  return docs.map((d) => ({
    title: d.title,
    avenue: d.avenue as Project["avenue"],
    description: d.description,
    image: mediaUrl(d.image),
    date: typeof d.date === "string" ? d.date : "",
    postSlug:
      d.relatedPost && typeof d.relatedPost === "object" && "slug" in d.relatedPost
        ? ((d.relatedPost as { slug?: string }).slug ?? "")
        : "",
    featured: Boolean(d.featured),
  }));
});

/**
 * The seven projects on the home page: the ones explicitly ticked first, then
 * the most recent to make up the number. Editors get control without having to
 * tick exactly seven boxes for the section to look right.
 */
export const getFeaturedProjects = cache(async (limit = 7): Promise<Project[]> => {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  if (featured.length >= limit) return featured.slice(0, limit);

  const rest = projects
    .filter((p) => !p.featured)
    .sort((a, b) => b.date.localeCompare(a.date));
  return [...featured, ...rest].slice(0, limit);
});

export const getBoardYears = cache(async (): Promise<BoardYear[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "board-years",
    sort: "-year",
    pagination: false,
    depth: 1,
  });
  return docs.map((d) => ({
    year: d.year,
    photo: picture(d.groupPhoto, `The ${d.year} board`) ?? PLACEHOLDER,
    caption: d.caption ?? "",
  }));
});

export const getFlagship = cache(async (): Promise<FlagshipItem[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "flagship-projects",
    sort: "order",
    pagination: false,
    depth: 1,
  });
  return docs.map((d) => ({
    title: d.title,
    tag: d.tag,
    description: d.description,
    stat: d.stat,
    image: mediaUrl(d.image),
  }));
});

export const getLegacyPhotos = cache(async (): Promise<LegacyPhoto[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "legacy-photos",
    sort: "order",
    pagination: false,
    depth: 0,
  });
  return docs
    .filter((d): d is typeof d & { url: string } => typeof d.url === "string")
    .map((d) => ({
      src: d.url,
      width: d.width || 1200,
      height: d.height || 900,
    }));
});

/** No testimonials collected yet — every Voices section hides itself when empty. */
export function getVoices(): Voice[] {
  return [];
}

// ------------------------------------------------------------------ avenues, blogs, events

const PLACEHOLDER: Picture = { src: "", alt: "" };

function avenueTag(avenue: unknown): AvenueTag | null {
  if (!avenue || typeof avenue !== "object" || !("name" in avenue)) return null;
  const a = avenue as { name?: unknown; slug?: unknown; accentColor?: unknown };
  if (typeof a.name !== "string") return null;
  return {
    name: a.name,
    slug: typeof a.slug === "string" ? a.slug : "",
    accent: (typeof a.accentColor === "string" ? a.accentColor : "starlight") as Accent,
  };
}

export const getAvenues = cache(async (): Promise<AvenueEntry[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "avenues",
    sort: "order",
    pagination: false,
    depth: 1,
  });
  return docs.map((d) => ({
    id: String(d.id),
    name: d.name,
    slug: d.slug ?? "",
    description: d.description,
    image: picture(d.image, d.name) ?? PLACEHOLDER,
    accent: (d.accentColor ?? "starlight") as Accent,
  }));
});

function toBlogSummary(d: {
  id: string | number;
  name: string;
  slug?: string | null;
  date: string;
  cardSummary: string;
  heroImage: unknown;
  avenue: unknown;
}): BlogSummary {
  return {
    id: String(d.id),
    name: d.name,
    slug: d.slug ?? "",
    date: isoDate(d.date),
    summary: d.cardSummary,
    image: picture(d.heroImage, d.name) ?? PLACEHOLDER,
    avenue: avenueTag(d.avenue),
  };
}

export const getBlogs = cache(async (): Promise<BlogSummary[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "blogs",
    sort: "-date",
    pagination: false,
    depth: 1,
  });
  return docs.map(toBlogSummary);
});

export const getBlogBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "blogs",
    where: { slug: { equals: slug } },
    limit: 1,
    // depth 2 so the avenue relationship's own image resolves alongside it.
    depth: 2,
  });
  const doc = docs[0];
  if (!doc) return null;
  return {
    ...toBlogSummary(doc),
    details: doc.details ?? null,
    gallery: gallery(doc.gallery, doc.name),
  };
});

function toEventSummary(d: {
  id: string | number;
  name: string;
  slug?: string | null;
  date: string;
  location: string;
  status: string;
  heroImage: unknown;
  registrationLink?: string | null;
}): EventSummary {
  return {
    id: String(d.id),
    name: d.name,
    slug: d.slug ?? "",
    date: isoDate(d.date),
    location: d.location,
    status: (d.status ?? "upcoming") as EventStatus,
    image: picture(d.heroImage, d.name) ?? PLACEHOLDER,
    registrationLink: d.registrationLink ?? "",
  };
}

export const getEvents = cache(async (): Promise<EventSummary[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "events",
    sort: "-date",
    pagination: false,
    depth: 1,
  });
  return docs.map(toEventSummary);
});

export const getEventBySlug = cache(async (slug: string): Promise<EventEntry | null> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "events",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  const doc = docs[0];
  if (!doc) return null;
  return {
    ...toEventSummary(doc),
    description: doc.description ?? null,
    gallery: gallery(doc.gallery, doc.name),
  };
});

/**
 * The opening curtain. Returns `enabled: false` whenever there is nothing to
 * show, so the home page can make one check instead of re-deriving the rule.
 */
export const getHomeIntro = cache(async (): Promise<HomeIntroData> => {
  const payload = await client();
  const intro = await payload.findGlobal({ slug: "home-intro", depth: 1 });
  const panels = gallery(intro?.panelImages, "");
  return {
    enabled: Boolean(intro?.enabled) && panels.length >= 2,
    headline: intro?.headline || D.home.heroHeadline.join(" "),
    logo: mediaUrl(intro?.logo) || D.BRAND.logo,
    panels,
  };
});

// ------------------------------------------------------------------ static pages

export function getHomeContent(): HomeContent {
  return {
    hero: { headline: sHeadline(D.home.heroHeadline), body: D.home.heroBody, surface: sSurface("light") },
    heroStrip: D.home.heroStrip,
    avenuesSection: {
      headline: sHeadline(D.home.avenuesHeadline),
      countLabel: D.home.avenuesCountLabel,
      linkLabel: D.home.avenuesLinkLabel,
      surface: sSurface("dark", true),
    },
    avenues: D.home.avenues,
    statsSection: { headline: sHeadline(D.home.statsHeadline), cta: sButton(D.home.statsCta.label, D.home.statsCta.href, D.home.statsCta.style), surface: sSurface("light") },
    stats: D.home.stats,
    flagship: { headline: sHeadline(D.home.flagshipHeadline), surface: sSurface("dark", true) },
    voices: { headline: sHeadline(D.home.voicesHeadline), surface: sSurface("light") },
    team: {
      headline: sHeadline(D.home.teamHeadline),
      cta: sButton(D.home.teamCta.label, D.home.teamCta.href, D.home.teamCta.style),
      limit: D.home.teamLimit,
      surface: sSurface("dark", true),
    },
    marquee: { symbol: D.home.marqueeSymbol, surface: sSurface("dark") },
    showFourWayTest: true,
    showCta: true,
    seo: sSeo(D.home.seo),
  };
}

export function getAboutContent(): AboutContent {
  return {
    hero: { headline: sHeadline(D.about.heroHeadline), surface: sSurface("light") },
    storyImages: D.about.storyImages,
    story: {
      eyebrow: D.about.storyEyebrow,
      headline: sHeadline(D.about.storyHeadline),
      quote: D.about.storyQuote,
      surface: sSurface("light"),
    },
    storyParagraphs: D.about.storyParagraphs,
    manifesto: D.about.manifesto,
    manifestoSection: { body: D.about.manifestoBody, surface: sSurface("dark", true) },
    timelineSection: { headline: sHeadline(D.about.timelineHeadline), surface: sSurface("light") },
    timeline: D.about.timeline,
    prayerSection: {
      image: D.BRAND.prayerEmblem,
      eyebrow: D.about.prayerEyebrow,
      surface: sSurface("dark", true),
    },
    affiliation: {
      items: D.about.affiliation,
      symbol: D.about.affiliationSymbol,
      surface: sSurface("light"),
    },
    showFourWayTest: true,
    showCta: true,
    seo: sSeo(D.about.seo),
  };
}

export function getProjectsContent(): ProjectsContent {
  return {
    hero: { eyebrow: D.projects.heroEyebrow, headline: sHeadline(D.projects.heroHeadline), surface: sSurface("light") },
    grid: {
      allLabel: D.projects.allLabel,
      emptyMessage: D.projects.emptyMessage,
      surface: sSurface("light"),
    },
    showCta: true,
    seo: sSeo(D.projects.seo),
  };
}

export function getTeamContent(): TeamContent {
  return {
    hero: { eyebrow: D.team.heroEyebrow, headline: sHeadline(D.team.heroHeadline), surface: sSurface("light") },
    leadership: { count: D.team.leadershipCount, surface: sSurface("light") },
    board: { headline: sHeadline(D.team.boardHeadline), surface: sSurface("dark", true) },
    constellation: {
      headline: sHeadline(D.team.constellationHeadline),
      body: D.team.constellationBody,
      surface: sSurface("light"),
    },
    voices: { headline: sHeadline(D.team.voicesHeadline), surface: sSurface("light") },
    showCta: true,
    seo: sSeo(D.team.seo),
  };
}

export function getContactContent(): ContactContent {
  return {
    hero: {
      headline: sHeadline(D.contact.headline),
      blocks: D.contact.blocks,
      surface: sSurface("light"),
    },
    form: {
      intro: D.contact.intro,
      fields: D.contact.fields,
      chrome: {
        submitLabel: D.contact.submitLabel,
        sendingLabel: D.contact.sendingLabel,
        successMessage: D.contact.successMessage,
        errorMessage: D.contact.errorMessage,
      },
      surface: sSurface("light"),
    },
    seo: sSeo(D.contact.seo),
  };
}

export function getJoinContent(): FormPageContent {
  return {
    hero: {
      headline: sHeadline(D.join.headline),
      kicker: D.join.kicker,
      body: D.join.body,
      surface: sSurface("light"),
    },
    form: {
      fields: D.join.fields,
      consentLabel: D.join.consentLabel,
      chrome: {
        submitLabel: D.join.submitLabel,
        sendingLabel: D.join.sendingLabel,
        successMessage: D.join.successMessage,
        errorMessage: D.join.errorMessage,
      },
      surface: sSurface("light"),
    },
    contact: { blocks: D.join.blocks, surface: sSurface("light") },
    seo: sSeo(D.join.seo),
  };
}

export function getBloodDonorContent(): FormPageContent {
  return {
    hero: {
      headline: sHeadline(D.bloodDonor.headline),
      kicker: "",
      body: D.bloodDonor.body,
      surface: sSurface("light"),
    },
    form: {
      fields: D.bloodDonor.fields,
      consentLabel: D.bloodDonor.consentLabel,
      chrome: {
        submitLabel: D.bloodDonor.submitLabel,
        sendingLabel: D.bloodDonor.sendingLabel,
        successMessage: D.bloodDonor.successMessage,
        errorMessage: D.bloodDonor.errorMessage,
        accent: D.bloodDonor.accent,
        accentText: D.bloodDonor.accentText,
      },
      surface: sSurface("light"),
    },
    contact: { blocks: D.bloodDonor.blocks, surface: sSurface("light") },
    seo: sSeo(D.bloodDonor.seo),
  };
}

export function getNotFoundContent(): NotFoundContent {
  return {
    code: D.notFound.code,
    headline: sHeadline(D.notFound.headline),
    body: D.notFound.body,
    cta: sButton(D.notFound.cta.label, D.notFound.cta.href, D.notFound.cta.style),
    surface: sSurface("light"),
  };
}
