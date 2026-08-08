// Plain view-model shapes consumed by pages and client components.
// Mapped from Payload documents in src/lib/content.ts, with the design defaults
// in src/lib/defaults.ts filling in anything an editor has not set.

export type Avenue =
  | "Club Service"
  | "Community Service"
  | "Professional Service"
  | "International Service"
  | "District Priority";

export type Accent = "starlight" | "comet" | "nebula" | "cranberry";

export type LegacyPhoto = { src: string; width: number; height: number };

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
  shareImage: string;
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
  /** ISO date string — month/year granularity. */
  date: string;
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
  accent: Accent;
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

export type StoryImage = { src: string; alt: string };
export type TimelineItem = { year: string; title: string; body: string };
export type ManifestoLine = { text: string; accent: string; color?: string };

// ---------------------------------------------------------------- primitives

/** A multi-line animated headline. `*starred*` words render in `accentColor`. */
export type Headline = {
  lines: string[];
  color?: string;
  accentColor?: string;
  size?: number;
};

/** Background + text tone for one band of a page. */
export type Surface = {
  background?: string;
  tone: "light" | "dark";
  starfield: boolean;
  hidden: boolean;
};

export type ButtonData = {
  label: string;
  href: string;
  style: "pill" | "arrow-light" | "arrow-dark";
  background?: string;
  color?: string;
  hidden: boolean;
};

export type FormFieldData = {
  label: string;
  key: string;
  kind: "text" | "email" | "tel" | "number" | "textarea" | "select" | "checkbox";
  width: "full" | "half";
  required: boolean;
  placeholder?: string;
  options: string[];
};

export type FormChrome = {
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
  accent?: string;
  accentText?: string;
};

export type ContactBlock = {
  title: string;
  kind: "email" | "phone" | "emailPhone" | "socials" | "custom";
  text?: string;
  href?: string;
};

export type SeoData = {
  title?: string;
  description?: string;
  image?: string;
  noIndex: boolean;
};

// -------------------------------------------------------------------- design

export type NavLink = { label: string; href: string };

export type HeaderData = {
  logo: string;
  logoAlt: string;
  logoSize: number;
  wordmark: string;
  wordmarkSymbol: string;
  wordmarkColor?: string;
  symbolColor?: string;
  linkColor?: string;
  menuLabel: string;
  items: NavLink[];
  cta: ButtonData;
};

export type FooterColumn = { title: string; links: NavLink[] };

export type FooterData = {
  brandText: string;
  brandSymbol: string;
  brandLine: string;
  columns: FooterColumn[];
  wordmark: string;
  copyright: string;
  note: string;
  background?: string;
  textColor?: string;
  headingColor?: string;
  starfield: boolean;
};

export type CtaBannerData = {
  symbol: string;
  symbolColor?: string;
  headline: Headline;
  body: string;
  bodyColor?: string;
  primary: ButtonData;
  secondary: ButtonData;
  surface: Surface;
};

export type FourWayTestData = {
  eyebrow: string;
  eyebrowColor?: string;
  items: { question: string; keyword: string }[];
  highlightColor?: string;
  textColor?: string;
  numberColor?: string;
  surface: Surface;
};

export type SharedContent = {
  cta: CtaBannerData;
  fourWayTest: FourWayTestData;
};

// --------------------------------------------------------------------- pages

export type HomeContent = {
  hero: { headline: Headline; body: string; bodyColor?: string; surface: Surface };
  heroStrip: HeroCard[];
  avenuesSection: {
    headline: Headline;
    countLabel: string;
    linkLabel: string;
    cardBackground?: string;
    cardTitleColor?: string;
    cardTextColor?: string;
    surface: Surface;
  };
  avenues: AvenueInfo[];
  statsSection: { headline: Headline; cta: ButtonData; surface: Surface };
  stats: Stat[];
  flagship: { headline: Headline; surface: Surface };
  voices: { headline: Headline; surface: Surface };
  team: { headline: Headline; cta: ButtonData; limit: number; surface: Surface };
  marquee: {
    symbol: string;
    textColor?: string;
    hoverColor?: string;
    symbolColor?: string;
    surface: Surface;
  };
  showFourWayTest: boolean;
  showCta: boolean;
  seo: SeoData;
};

export type AboutContent = {
  hero: { headline: Headline; surface: Surface };
  storyImages: StoryImage[];
  story: {
    eyebrow: string;
    eyebrowColor?: string;
    headline: Headline;
    quote: string;
    quoteColor?: string;
    quoteBarColor?: string;
    paragraphColor?: string;
    surface: Surface;
  };
  storyParagraphs: string[];
  manifesto: ManifestoLine[];
  manifestoSection: { body: string; bodyColor?: string; surface: Surface };
  timelineSection: {
    headline: Headline;
    yearColor?: string;
    titleColor?: string;
    bodyColor?: string;
    surface: Surface;
  };
  timeline: TimelineItem[];
  prayerSection: {
    image: string;
    eyebrow: string;
    eyebrowColor?: string;
    textColor?: string;
    surface: Surface;
  };
  affiliation: {
    items: string[];
    symbol: string;
    textColor?: string;
    symbolColor?: string;
    surface: Surface;
  };
  showFourWayTest: boolean;
  showCta: boolean;
  seo: SeoData;
};

export type ProjectsContent = {
  hero: { eyebrow: string; eyebrowColor?: string; headline: Headline; surface: Surface };
  grid: {
    allLabel: string;
    activePillColor?: string;
    activePillTextColor?: string;
    cardTitleColor?: string;
    cardTextColor?: string;
    emptyMessage: string;
    surface: Surface;
  };
  showCta: boolean;
  seo: SeoData;
};

export type TeamContent = {
  hero: { eyebrow: string; eyebrowColor?: string; headline: Headline; surface: Surface };
  leadership: { count: number; nameColor?: string; roleColor?: string; surface: Surface };
  board: { headline: Headline; nameColor?: string; roleColor?: string; surface: Surface };
  constellation: {
    headline: Headline;
    body: string;
    bodyColor?: string;
    nameColor?: string;
    surface: Surface;
  };
  voices: { headline: Headline; surface: Surface };
  showCta: boolean;
  seo: SeoData;
};

export type ContactContent = {
  hero: {
    headline: Headline;
    blocks: ContactBlock[];
    blockTitleColor?: string;
    blockLinkColor?: string;
    surface: Surface;
  };
  form: {
    intro: string;
    introColor?: string;
    fields: FormFieldData[];
    chrome: FormChrome;
    cardBackground?: string;
    surface: Surface;
  };
  seo: SeoData;
};

export type FormPageContent = {
  hero: {
    headline: Headline;
    kicker: string;
    kickerColor?: string;
    body: string;
    bodyColor?: string;
    surface: Surface;
  };
  form: {
    fields: FormFieldData[];
    consentLabel: string;
    chrome: FormChrome;
    cardBackground?: string;
    surface: Surface;
  };
  contact: {
    blocks: ContactBlock[];
    titleColor?: string;
    linkColor?: string;
    surface: Surface;
  };
  seo: SeoData;
};

export type NotFoundContent = {
  code: string;
  codeColor?: string;
  headline: Headline;
  body: string;
  bodyColor?: string;
  cta: ButtonData;
  surface: Surface;
};
