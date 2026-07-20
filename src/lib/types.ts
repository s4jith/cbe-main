// Plain view-model shapes consumed by pages and client components.
// Mapped from Payload documents in src/lib/content.ts.

export type Avenue =
  | "Club Service"
  | "Community Service"
  | "Professional Service"
  | "International Service"
  | "District Priority";

export type Accent = "starlight" | "comet" | "nebula" | "cranberry";

export type SiteInfo = {
  name: string;
  shortName: string;
  parent: string;
  clubId: string;
  group: string;
  district: string;
  chartered: string;
  charterPresident: string;
  tagline: string;
  description: string;
  url: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  socials: { label: string; href: string }[];
  forms: { contact: string; join: string; bloodDonor: string };
  prayer: string;
};

export type Member = {
  name: string;
  role: string;
  image: string;
};

export type Project = {
  title: string;
  avenue: Avenue;
  description: string;
  image: string;
};

export type AvenueInfo = {
  key: Avenue;
  slug: string;
  accent: Accent;
  blurb: string;
  image: string;
};

export type Stat = {
  value: number;
  suffix: string;
  label: string;
  body: string;
};

export type FlagshipItem = {
  title: string;
  tag: string;
  description: string;
  stat: string;
  image: string;
};

export type HeroCard = {
  title: string;
  stat: string;
  image: string;
};

export type Voice = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

export type Publication = {
  title: string;
  cover: string;
  pdf: string;
};

export type StoryImage = { src: string; alt: string };
export type TimelineItem = { year: string; title: string; body: string };
export type ManifestoLine = { text: string; accent: string };

export type AboutContent = {
  storyImages: StoryImage[];
  storyParagraphs: string[];
  manifesto: ManifestoLine[];
  timeline: TimelineItem[];
};
