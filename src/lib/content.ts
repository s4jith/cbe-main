import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import * as D from "@/lib/defaults";
import type {
  AboutContent,
  ButtonData,
  ContactContent,
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

export function getSiteSettings(): SiteInfo {
  const phone = D.SITE.phone;
  const email = D.SITE.email;
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
    socials: D.SITE.socials,
    forms: D.SITE.forms,
    prayer: D.SITE.prayer,
  };
}

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

export function getFooter(): FooterData {
  const header = getHeader();
  const site = getSiteSettings();
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
    return { title: c.title, links: c.links };
  });

  return {
    brandText: D.footer.brandText,
    brandSymbol: D.footer.brandSymbol,
    brandLine: D.footer.brandLine,
    columns,
    wordmark: D.footer.wordmark,
    copyright: D.footer.copyright,
    note: site.tagline.split(".")[0] + ".",
    starfield: true,
  };
}

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
  }));
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
