import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type {
  AboutContent,
  Avenue,
  AvenueInfo,
  FlagshipItem,
  HeroCard,
  Member,
  Project,
  Publication,
  SiteInfo,
  Stat,
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

export const getSiteSettings = cache(async (): Promise<SiteInfo> => {
  const payload = await client();
  const s = await payload.findGlobal({ slug: "site-settings" });
  const phone = s.phone ?? "";
  const email = s.email ?? "";
  return {
    name: s.name ?? "",
    shortName: s.shortName ?? "",
    parent: s.parent ?? "",
    clubId: s.clubId ?? "",
    group: s.group ?? "",
    district: s.district ?? "",
    chartered: s.chartered ?? "",
    charterPresident: s.charterPresident ?? "",
    tagline: s.tagline ?? "",
    description: s.description ?? "",
    url: s.url ?? "https://www.rotaractcbegaalaxy.org",
    phone,
    phoneHref: `tel:${phone.replace(/\s+/g, "")}`,
    email,
    emailHref: `mailto:${email}`,
    socials: (s.socials ?? []).map((x) => ({ label: x.label, href: x.href })),
    forms: {
      contact: s.forms?.contact ?? "",
      join: s.forms?.join ?? "",
      bloodDonor: s.forms?.bloodDonor ?? "",
    },
    prayer: s.prayer ?? "",
  };
});

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
    avenue: d.avenue as Avenue,
    description: d.description,
    image: mediaUrl(d.image),
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

export const getPublications = cache(
  async (type: "newsletter" | "scrapbook"): Promise<Publication[]> => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "publications",
      where: { type: { equals: type } },
      sort: "order",
      pagination: false,
      depth: 1,
    });
    return docs.map((d) => ({
      title: d.title,
      cover: mediaUrl(d.cover),
      pdf: mediaUrl(d.pdfFile) || d.pdfUrl || "",
    }));
  },
);

export const getVoices = cache(async (): Promise<Voice[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "voices",
    sort: "order",
    pagination: false,
    depth: 1,
  });
  return docs.map((d) => ({
    name: d.name,
    role: d.role,
    quote: d.quote,
    image: mediaUrl(d.image),
  }));
});

export const getHomeContent = cache(
  async (): Promise<{ heroStrip: HeroCard[]; avenues: AvenueInfo[]; stats: Stat[] }> => {
    const payload = await client();
    const home = await payload.findGlobal({ slug: "home-page", depth: 1 });
    return {
      heroStrip: (home.heroStrip ?? []).map((c) => ({
        title: c.title,
        stat: c.stat,
        image: mediaUrl(c.image),
      })),
      avenues: (home.avenues ?? []).map((a) => ({
        key: a.avenue as Avenue,
        slug: a.slug,
        accent: a.accent as AvenueInfo["accent"],
        blurb: a.blurb,
        image: mediaUrl(a.image),
      })),
      stats: (home.stats ?? []).map((s) => ({
        value: s.value,
        suffix: s.suffix ?? "",
        label: s.label,
        body: s.body,
      })),
    };
  },
);

export const getAboutContent = cache(async (): Promise<AboutContent> => {
  const payload = await client();
  const about = await payload.findGlobal({ slug: "about-page", depth: 1 });
  return {
    storyImages: (about.storyImages ?? []).map((s) => ({
      src: mediaUrl(s.image),
      alt: s.alt,
    })),
    storyParagraphs: (about.storyParagraphs ?? []).map((p) => p.text),
    manifesto: (about.manifesto ?? []).map((m) => ({ text: m.text, accent: m.accent })),
    timeline: (about.timeline ?? []).map((t) => ({
      year: t.year,
      title: t.title,
      body: t.body,
    })),
  };
});
