/**
 * The design defaults — every word, colour and layout choice the site shipped with.
 * Anything an editor has not filled in falls back to these, so the site never
 * renders half-empty while the CMS is being populated. The seed script writes
 * these same values into Payload so the admin shows what is on screen.
 */
import type { ContactBlock, FormFieldData, NavLink } from "@/lib/types";

export const BRAND = {
  logo: "/images/brand/site-logo.png",
  prayerEmblem: "/images/brand/prayer.webp",
  shareImage: "/images/brand/og-banner.jpg",
};

/** Club identity, contact details and form endpoints — was "Site Settings" in the CMS. */
export const SITE = {
  name: "Rotaract Club of Coimbatore Main",
  shortName: "Coimbatore Main",
  parent: "Family of Rotary Club of Coimbatore",
  clubId: "87596",
  group: "Group 1",
  district: "RI District 3206",
  chartered: "30 November 2009",
  charterPresident: "Rtr. Jagadeesan",
  tagline:
    "Every spark begins with a question. Every change begins with a choice. At Main, we don't just serve — we lead, we learn, and we lift others as we rise. We are the force behind change.",
  description:
    "Official website of Rotaract Club of Coimbatore Main. Youth service, leadership, and community impact since 2009.",
  url: "https://www.rotaractcoimbatoremain.example",
  phone: "+91 82200 04424",
  email: "hello@rotaractcoimbatoremain.example",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/raccbemain" },
    { label: "Facebook", href: "#" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rotaract-club-of-coimbatore-main/" },
    { label: "X", href: "#" },
    { label: "YouTube", href: "#" },
  ],
  forms: {
    contact: "https://script.google.com/macros/s/AKfycbwcyrxQIkGgFXSeLFoOKnihH0zEWx0sr4pbzZ8vYoJlb7nqiKvxQdGitzmhGF32X69Nbw/exec",
    join: "https://script.google.com/macros/s/AKfycbzRW3jTEs-4Su_GdsoqPOPT88vZoa-OecjrcMvJAvkZsJqwpzwnfRFrmLriT-Qqinc6VA/exec",
    bloodDonor: "https://script.google.com/macros/s/AKfycbwTz4QewjWnwZoJUGtguKCaqeH5yJEybUhVs42C206l7mNWojNu4v970w2r5JrlUSR_qQ/exec",
  },
  prayer:
    "Oh! God! Our Almighty Father & Ruler of the Universe, We thank thee for the inspiration you have given us for the Rotaract movement based upon Fellowship through Service. We humbly beg you to continue thy grace to enable us to do Our Service to ourselves and to our neighbors and to honor and glory of thy holy name.",
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Projects", href: "/projects" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Legacy", href: "/legacy" },
  { label: "Contact", href: "/contact" },
];

/**
 * The footer keeps a deliberately shorter list than the header — the contact
 * details have their own column beside it, and a full site index at the bottom
 * of every page is noise rather than navigation.
 */
export const FOOTER_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
];

/**
 * The hover-ticker rows between the hero and the avenues — what the club
 * actually does, in the visitor's language rather than Rotaract's.
 */
/**
 * The five avenues of service, as the ticker rows. Each carries the photograph
 * that rises behind the row when it is hovered — placeholders for now, swap them
 * for real project photography.
 */
export const SERVICE_BANDS: { label: string; href: string; image: string }[] = [
  { label: "Club Service", href: "/projects", image: "/images/avenues/club.jpg" },
  { label: "Community Service", href: "/projects", image: "/images/avenues/community.jpg" },
  { label: "Professional Service", href: "/projects", image: "/images/avenues/professional.jpg" },
  { label: "International Service", href: "/projects", image: "/images/avenues/international.jpg" },
  { label: "District Priority Projects", href: "/projects", image: "/images/avenues/district.jpg" },
];

/**
 * Placeholder events for the horizontal showcase. Swap these for real entries
 * from the Events collection once there are five of them in the admin.
 */
export const showcaseEvents = [
  {
    title: "Rise & Run",
    kicker: "5K charity run · 400+ runners",
    year: "2026",
    venue: "Race Course, Coimbatore",
    description:
      "A morning run opening the Rotaract year, raising funds for insulin support for children while getting half the city out of bed before sunrise.",
    image: "/images/hero-strip/aravam.jpg",
    tone: "#e0a11b",
    toneInk: "#2e1f00",
  },
  {
    title: "Red Drop",
    kicker: "Blood drive · 6 camps",
    year: "2026",
    venue: "PSG Hospitals",
    description:
      "Six camps across the district in a single week, run with the blood donor registry so units reached the people who had already asked for them.",
    image: "/images/avenues/community.jpg",
    tone: "#b5654f",
    toneInk: "#f8ece8",
  },
  {
    title: "Career Compass",
    kicker: "Mentoring · 12 speakers",
    year: "2025",
    venue: "CODISSIA Trade Fair Complex",
    description:
      "A day of sessions pairing final-year students with working professionals — CVs pulled apart, interviews rehearsed, and a few offers made on the spot.",
    image: "/images/avenues/professional.jpg",
    tone: "#7c93a3",
    toneInk: "#16242c",
  },
  {
    title: "Borderless",
    kicker: "International exchange",
    year: "2025",
    venue: "Coimbatore & Colombo",
    description:
      "A joint project with a partner club overseas, twinning two communities around one shared water and sanitation build.",
    image: "/images/avenues/international.jpg",
    tone: "#8d7f95",
    toneInk: "#2a2230",
  },
  {
    title: "Installation Night",
    kicker: "Club service · 120 guests",
    year: "2025",
    venue: "Hotel Le Meridien",
    description:
      "The handover of the collar, and the evening the incoming board sets out what the year is going to be about in front of everyone who will hold them to it.",
    image: "/images/avenues/club.jpg",
    tone: "#e0a11b",
    toneInk: "#2e1f00",
  },
];

/** Placeholder copy for the Discover band — replace with the club's own words. */
export const discover = {
  eyebrow: "Empowering changemakers",
  heading: "Discover Main",
  body: "Rotaract Coimbatore Main is a youth-led force for service in the city. Our work runs well past one-off events — we set out to give members the skills, the network and the nerve to take on problems their communities actually face, and to lead while they do it. Come build something that outlasts you.",
  stats: [
    { value: "500+", label: "Projects Completed" },
    { value: "42", label: "Active Members" },
    { value: "52+", label: "Years of Service" },
    { value: "Chartered", label: "in 2009", href: "/about" },
  ],
  image: "/images/hero-strip/aravam.jpg",
  imageLabel: "Empowering Changemakers",
};

export const header = {
  logoAlt: "Rotaract Club of Coimbatore Main",
  logoSize: 44,
  wordmark: "Coimbatore Main",
  wordmarkSymbol: "",
  menuLabel: "Menu",
  cta: { label: "Join Us", href: "/join", style: "pill" as const },
};

export const footer = {
  brandText: "Coimbatore Main",
  brandSymbol: "",
  brandLine: "{parent} · Club ID {clubId} · {group} · {district}",
  wordmark: "Main",
  copyright: "© {year} {name}. All rights reserved.",
  note: "",
  columns: [
    { title: "pages", source: "menu" as const, links: [] as NavLink[] },
    {
      title: "get involved",
      source: "manual" as const,
      links: [
        { label: "Become a Member", href: "/join" },
        { label: "Blood Donor Registry", href: "/blood-donor" },
        { label: "Say Hello", href: "/contact" },
      ],
    },
    { title: "socials", source: "socials" as const, links: [] as NavLink[] },
    { title: "get in touch", source: "contact" as const, links: [] as NavLink[] },
  ],
};

export const cta = {
  symbol: "✦",
  headline: ["Every change begins with a choice."],
  body: "Become part of a community where service, leadership, and friendship come together — or save a life without joining anything at all.",
  primary: { label: "Join Us", href: "/join", style: "pill" as const },
  secondary: { label: "Become a Blood Donor", href: "/blood-donor", style: "arrow-light" as const },
};

export const fourWayTest = {
  eyebrow: "of the things we think, say or do",
  items: [
    { question: "Is it the TRUTH?", keyword: "TRUTH" },
    { question: "Is it FAIR to all concerned?", keyword: "FAIR" },
    { question: "Will it build GOODWILL and BETTER FRIENDSHIPS?", keyword: "GOODWILL" },
    { question: "Will it be BENEFICIAL to all concerned?", keyword: "BENEFICIAL" },
  ],
};

export const home = {
  // Line two is set in the display italic — the emphasis is typographic, not a symbol.
  heroHeadline: ["We don't just serve.", "We lead. We rise."],
  heroEyebrow: "Rotaract Club of Coimbatore Main",
  heroBody:
    "{name} — {parent}. Youth-led service and leadership under {district}, Coimbatore. 52+ years of community impact, 500+ projects, and growing.",
  /** Coloured in word by word as the reader scrolls past it. */
  statement:
    "Chartered in 2009, we are Coimbatore's youth-led force for service. Five hundred projects on, we still measure ourselves by the same thing — who we lifted along the way.",
  avenuesHeadline: ["Five avenues.", "One force."],
  avenuesCountLabel: "projects",
  avenuesLinkLabel: "Explore projects",
  statsHeadline: ["Numbers that", "carry weight."],
  statsCta: { label: "See the work", href: "/projects", style: "arrow-dark" as const },
  flagshipHeadline: ["Built to", "break barriers."],
  voicesHeadline: ["Voices from", "the club."],
  teamHeadline: ["Meet the", "Team."],
  teamCta: { label: "View all stars", href: "/team", style: "arrow-light" as const },
  teamLimit: 8,
  marqueeSymbol: "✦",
  seo: {
    title: "",
    description: "",
  },
  /**
   * The single hero photograph and its caption.
   *
   * Chosen because it is the one archive image whose label is verifiably correct
   * and which does not carry the club's former "Gaalaxy" branding on a banner —
   * several of the others do. See the note on `heroStrip` below.
   */
  heroFeature: {
    title: "ARAVAM",
    stat: "200+ participants, Onam celebration",
    image: "/images/hero-strip/aravam.jpg",
  },
  /**
   * Legacy project cards. NOTE: two of these filenames do not match their subject —
   * `ipcl.webp` is a teacher-honouring ceremony and `vanchi.webp` is actually the
   * IPCL trophy presentation. Inherited from the seed data; verify before using
   * any of them in a caption that makes a factual claim.
   */
  heroStrip: [
    { title: "IPCL 2.0", stat: "60+ para-athletes, 14 states", image: "/images/hero-strip/ipcl.webp" },
    { title: "VANCHI", stat: "Tribal upliftment since 2019", image: "/images/hero-strip/vanchi.webp" },
    { title: "SAYBOO", stat: "227 registrations", image: "/images/hero-strip/sayboo.webp" },
    { title: "PETTI KADAI", stat: "Entrepreneurship with dignity", image: "/images/hero-strip/petti-kadai.webp" },
    { title: "ROTA-LIN", stat: "Insulin support, 4 phases", image: "/images/hero-strip/rota-lin.webp" },
    { title: "ARAVAM", stat: "200+ at Onam celebration", image: "/images/hero-strip/aravam.jpg" },
  ],
  avenues: [
    {
      key: "Club Service" as const,
      slug: "club",
      accent: "starlight" as const,
      blurb: "Fellowship, leadership, and the bonds that make us a family — from installation ceremonies to spontaneous getaways.",
      image: "/images/avenues/club.jpg",
    },
    {
      key: "Community Service" as const,
      slug: "community",
      accent: "cranberry" as const,
      blurb: "Hands-on impact for Coimbatore — blood drives, insulin support for children, care for mothers, elders, and the homeless.",
      image: "/images/avenues/community.jpg",
    },
    {
      key: "Professional Service" as const,
      slug: "professional",
      accent: "comet" as const,
      blurb: "Careers, skills, and self-discovery — sessions, contests, and programs that sharpen young professionals.",
      image: "/images/avenues/professional.jpg",
    },
    {
      key: "International Service" as const,
      slug: "international",
      accent: "nebula" as const,
      blurb: "Friendship without borders — exchanges, collaborations, and joint initiatives across districts and countries.",
      image: "/images/avenues/international.jpg",
    },
    {
      key: "District Priority" as const,
      slug: "district",
      accent: "starlight" as const,
      blurb: "Initiatives aligned with RI District 3206 themes — DREAM, MannShakti, Embrace, Hi5, and beyond.",
      image: "/images/avenues/district.jpg",
    },
  ],
  stats: [
    { value: 500, suffix: "+", label: "Projects Completed", body: "Five hundred and counting — innovative projects that uplift communities and empower individuals across Coimbatore and beyond.", accent: "comet" as const },
    { value: 42, suffix: "", label: "Active Members", body: "Passionate students and professionals working together on education, health, environment, and youth development.", accent: "nebula" as const },
    { value: 52, suffix: "+", label: "Years of Service", body: "Chartered on 30 November 2009 under the Rotary Club of Coimbatore — a legacy of youth-driven change.", accent: "starlight" as const },
    { value: 5, suffix: "", label: "District Trainers", body: "Leaders shaped here now train Rotaractors across RI District 3206.", accent: "cranberry" as const },
    { value: 2, suffix: "", label: "Dual Memberships", body: "Members carrying that spirit into Rotary and beyond.", accent: "comet" as const },
  ],
};

export const about = {
  heroHeadline: ["52 years *✦*", "of force."],
  storyEyebrow: "our story",
  storyHeadline: ["Born", "30 November,", "2009."],
  storyQuote: "But we are not just a club — we are a force.",
  manifestoBody:
    "Whether it's celebrating ability through sports, fueling social entrepreneurship, feeding the underserved, or inspiring the next generation of leaders — we lead not for applause, but for impact.",
  timelineHeadline: ["The journey", "so far."],
  prayerEyebrow: "the rotaract prayer",
  affiliation: [
    "Rotary International",
    "{district}",
    "{parent}",
    "Club ID {clubId}",
    "{group}",
    "Chartered {chartered}",
  ],
  affiliationSymbol: "✦",
  seo: {
    title: "Our Story",
    description:
      "Discover the journey, legacy, and evolution of Rotaract Club of Coimbatore Main — from charter to today.",
  },
  storyImages: [
    { src: "/images/story/01.webp", alt: "Rotaract Club of Coimbatore Main — early club events" },
    { src: "/images/story/02.webp", alt: "Club service and community outreach activities" },
    { src: "/images/story/03.webp", alt: "Rotaractors at a project event" },
    { src: "/images/story/04.webp", alt: "Fellowship and team activities" },
    { src: "/images/story/05.webp", alt: "Installation and leadership ceremony" },
  ],
  storyParagraphs: [
    "The Rotaract Club of Coimbatore Main was born under the passionate mentorship of the Rotary Club of Coimbatore and the visionary leadership of Charter President Rtr. Jagadeesan. Since its founding, the club has stood as a dynamic platform for young individuals to cultivate leadership, foster personal growth, and contribute meaningfully to society — true to the global spirit of Rotaract.",
    "Over the years, the club has evolved into a powerhouse of innovation and service — a strong membership base of dedicated Rotaractors, including district trainers, upholding the Rotaract motto of fellowship through service. From flagship ventures like VANCHI, Abled Covai Trophy, Gaalaxy Unavagam, and Petti Kadai, to inclusive platforms like the Indian Para Cricket League and Aasan, our projects speak volumes about our commitment to inclusivity, empowerment, and community welfare.",
    "Operating on an annual budget of ₹10–15 lakhs, we have garnered the support of CSR collaborators, stakeholders, and local bodies — making every rupee count. With over 52 years of unwavering legacy, the Rotaract Club of Coimbatore Main has grown into a beacon of youth-driven change.",
  ],
  manifesto: [
    { text: "A force that educates.", accent: "text-comet" },
    { text: "A force that empowers.", accent: "text-starlight" },
    { text: "A force that breaks barriers.", accent: "text-cranberry" },
  ],
  timeline: [
    { year: "2009", title: "The charter", body: "Born on 30 November 2009 under the mentorship of the Rotary Club of Coimbatore and Charter President Rtr. Jagadeesan." },
    { year: "2019", title: "VANCHI begins", body: "Our flagship tribal-upliftment initiative launches — two editions serving the Irula tribe across Sadivayal and Karamadai, 30+ beneficiaries per phase." },
    { year: "2024", title: "Barriers break", body: "Coimbatore's first para-sports fest, PETTI KADAI entrepreneurship, and the club welcomes its first transgender member." },
    { year: "2025", title: "IPCL goes national", body: "IPCL 2.0 brings 60+ para-athletes from 14 states and 1 UT to 22 Yards, Coimbatore." },
    { year: "Today", title: "God Mode", body: "42 members, 5 district trainers, an annual budget of ₹10–15 lakhs, and a 500-project legacy that keeps compounding." },
  ],
};

export const projects = {
  heroEyebrow: "{count} projects this year · 500+ all-time",
  heroHeadline: ["500+ projects.", "Zero applause *✦* needed."],
  allLabel: "All",
  emptyMessage: "No projects in this avenue yet — check back soon.",
  seo: {
    title: "Projects",
    description:
      "500+ projects across five avenues of service — community impact, professional growth, international friendship, and district priorities.",
  },
};

export const team = {
  heroEyebrow: "board members 2025–26",
  heroHeadline: ["Meet the *✦* Team."],
  leadershipCount: 8,
  boardHeadline: ["Chairs, advisors,", "and avenue leads."],
  constellationHeadline: ["The constellation."],
  constellationBody: "More stars — the general members whose energy powers every project.",
  voicesHeadline: ["In their", "own words."],
  seo: {
    title: "Our Team",
    description:
      "Meet the dedicated board members and Rotaractors of Rotaract Club of Coimbatore Main.",
  },
};

export const legacy = {
  heroEyebrow: "the archive",
  heroHeadline: ["Every chapter", "*✦* before this one."],
  intro:
    "Before the projects on this site were counted, they were lived — in rooms full of people who showed up for each other. This is a working scrapbook of that history, not a finished one: more of it surfaces every time someone digs through an old drive.",
  seo: {
    title: "Legacy",
    description: "A photo archive of the club's history — the years before this site began counting projects.",
  },
};

const formChrome = {
  sendingLabel: "Sending…",
  successMessage: "✦ Sent successfully — we'll be in touch.",
  errorMessage: "Failed to send. Please try again.",
};

export const contact = {
  headline: ["Say hello *✦*"],
  blocks: [
    { title: "we're always here to chat", kind: "emailPhone" },
    { title: "find us in orbit", kind: "socials" },
  ] as ContactBlock[],
  intro:
    "Questions, ideas, or just want to connect? We're a message away — let's keep the conversation and collaboration going.",
  submitLabel: "Send message",
  ...formChrome,
  fields: [
    { label: "Name", key: "name", kind: "text", width: "full", required: true, placeholder: "Your name", options: [] },
    { label: "Phone", key: "phone", kind: "tel", width: "half", required: false, placeholder: "+91", options: [] },
    { label: "Email", key: "email", kind: "email", width: "half", required: true, placeholder: "you@example.com", options: [] },
    { label: "Message", key: "message", kind: "textarea", width: "full", required: true, placeholder: "Tell us what's on your mind…", options: [] },
  ] as FormFieldData[],
  seo: {
    title: "Contact Us",
    description:
      "Get in touch with Rotaract Club of Coimbatore Main for collaborations, membership inquiries, or project partnerships.",
  },
};

export const join = {
  headline: ["Ready to *✦* rise?"],
  kicker: "join a force of 42 (and counting)",
  body: "Become part of a network of motivated individuals driven by leadership, community, and impact. Let's make a difference — together.",
  submitLabel: "Submit application",
  ...formChrome,
  consentLabel:
    "I confirm that the information provided is true and consent to be contacted by the club.",
  fields: [
    { label: "Full name", key: "fullName", kind: "text", width: "full", required: true, placeholder: "Your name", options: [] },
    { label: "Date of birth / Age", key: "dob", kind: "text", width: "half", required: true, placeholder: "DD/MM/YYYY", options: [] },
    { label: "Gender (optional)", key: "gender", kind: "select", width: "half", required: false, placeholder: "Select gender", options: ["Male", "Female", "Prefer not to say"] },
    { label: "Phone", key: "phone", kind: "tel", width: "half", required: true, placeholder: "+91", options: [] },
    { label: "Email", key: "email", kind: "email", width: "half", required: true, placeholder: "you@example.com", options: [] },
    { label: "City / Area / Address", key: "city", kind: "text", width: "full", required: true, placeholder: "Coimbatore", options: [] },
    { label: "Occupation / Educational status", key: "occupation", kind: "text", width: "full", required: true, placeholder: "Student, professional…", options: [] },
    { label: "Institution / Organization (if applicable)", key: "institution", kind: "text", width: "full", required: false, placeholder: "Name of institution", options: [] },
    { label: "Reason for joining / Interest area", key: "reason", kind: "textarea", width: "full", required: true, placeholder: "What draws you to Rotaract?", options: [] },
    { label: "How did you hear about the club?", key: "hearAbout", kind: "text", width: "full", required: false, placeholder: "Instagram, a friend…", options: [] },
  ] as FormFieldData[],
  blocks: [
    { title: "we're always here to chat", kind: "email" },
    { title: "or just call", kind: "phone" },
  ] as ContactBlock[],
  seo: {
    title: "Join Us",
    description:
      "Apply to join Rotaract Club of Coimbatore Main and become part of a youth-led service and leadership community.",
    noIndex: true,
  },
};

export const bloodDonor = {
  headline: ["Every drop *✦* counts."],
  body: "We bring together willing donors with those in urgent need — a life-saving bridge powered by compassion and community. Register once; help when it matters most.",
  submitLabel: "Register as a donor",
  ...formChrome,
  consentLabel:
    "I agree to be contacted by the club for blood donation purposes and confirm that the information provided is true.",
  fields: [
    { label: "Full name", key: "fullName", kind: "text", width: "full", required: true, placeholder: "Your name", options: [] },
    { label: "Email", key: "email", kind: "email", width: "half", required: true, placeholder: "you@example.com", options: [] },
    { label: "Contact number", key: "contactNumber", kind: "tel", width: "half", required: true, placeholder: "+91", options: [] },
    { label: "Rotaractor or Non-Rotaractor", key: "rotaractorStatus", kind: "select", width: "half", required: true, placeholder: "Select", options: ["Rotaractor", "Non-Rotaractor"] },
    { label: "Age / Date of birth", key: "dob", kind: "text", width: "half", required: true, placeholder: "DD/MM/YYYY", options: [] },
    { label: "Gender (optional)", key: "gender", kind: "select", width: "half", required: false, placeholder: "Select gender", options: ["Male", "Female", "Prefer not to say"] },
    { label: "Weight (kg)", key: "weight", kind: "number", width: "half", required: true, placeholder: "e.g. 60", options: [] },
    { label: "Blood group", key: "bloodGroup", kind: "select", width: "half", required: true, placeholder: "Select blood group", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    { label: "City / Area / Address", key: "city", kind: "text", width: "half", required: true, placeholder: "Coimbatore", options: [] },
    { label: "Currently willing to donate?", key: "willingToDonate", kind: "select", width: "half", required: true, placeholder: "Select", options: ["Yes", "No"] },
    { label: "Donated before?", key: "donatedBefore", kind: "select", width: "half", required: true, placeholder: "Select", options: ["Yes", "No"] },
  ] as FormFieldData[],
  blocks: [
    { title: "urgent need?", kind: "phone" },
    { title: "write to us", kind: "email" },
  ] as ContactBlock[],
  accent: "cranberry",
  accentText: "paper",
  seo: {
    title: "Donate Blood",
    description:
      "Register as a blood donor or request blood support through the Rotaract Club of Coimbatore Main community network.",
    noIndex: true,
  },
};

export const notFound = {
  code: "404",
  headline: ["Lost in space *✦*"],
  body: "This page drifted out of orbit. Head back home and we'll take it from there.",
  cta: { label: "Back to Home", href: "/", style: "pill" as const },
};

export const palette = {
  space: "#0a0b14",
  "space-deep": "#05060d",
  ink: "#0e1020",
  paper: "#ffffff",
  mist: "#f2f3f7",
  starlight: "#ffd84d",
  "starlight-ink": "#5c4300",
  nebula: "#a79bff",
  "nebula-ink": "#2b2166",
  comet: "#8cc9fa",
  "comet-ink": "#143e7c",
  cranberry: "#fd4f79",
  "cranberry-ink": "#4a0a24",
};
