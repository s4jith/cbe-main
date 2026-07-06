export const site = {
  name: "Rotaract Club of Coimbatore Gaalaxy",
  shortName: "Gaalaxy",
  parent: "Family of Rotary Club of Coimbatore Gaalaxy",
  clubId: "87596",
  group: "Group 1",
  district: "RI District 3206",
  chartered: "30 November 2009",
  charterPresident: "Rtr. Jagadeesan",
  tagline:
    "Every spark begins with a question. Every change begins with a choice. At Gaalaxy, we don't just serve — we lead, we learn, and we lift others as we rise. We are the force behind change.",
  description:
    "Official website of Rotaract Coimbatore Gaalaxy. Youth service, leadership, and community impact since 2009.",
  url: "https://www.rotaractcbegaalaxy.org",
  phone: "+91 82200 04424",
  phoneHref: "tel:+918220004424",
  email: "gaalaxy.socials@gmail.com",
  emailHref: "mailto:gaalaxy.socials@gmail.com",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/raccoimbatoregaalaxy" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61578119250015" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/rotaract-club-of-coimbatore-gaalaxy/" },
    { label: "X", href: "https://x.com/Rac_Gaalaxy" },
    { label: "YouTube", href: "https://youtube.com/@rac_gaalaxy" },
  ],
} as const;

export const stats = [
  { value: 500, suffix: "+", label: "Projects Completed", body: "Five hundred and counting — innovative projects that uplift communities and empower individuals across Coimbatore and beyond." },
  { value: 42, suffix: "", label: "Active Members", body: "Passionate students and professionals working together on education, health, environment, and youth development." },
  { value: 15, suffix: "+", label: "Years of Service", body: "Chartered on 30 November 2009 under the Rotary Club of Coimbatore Gaalaxy — a legacy of youth-driven change." },
  { value: 5, suffix: "", label: "District Trainers", body: "Leaders shaped in Gaalaxy now train Rotaractors across RI District 3206." },
  { value: 2, suffix: "", label: "Dual Memberships", body: "Members carrying the spirit of Gaalaxy into Rotary and beyond." },
] as const;

export const fourWayTest = [
  { key: "TRUTH", question: "Is it the TRUTH?" },
  { key: "FAIR", question: "Is it FAIR to all concerned?" },
  { key: "GOODWILL", question: "Will it build GOODWILL and BETTER FRIENDSHIPS?" },
  { key: "BENEFICIAL", question: "Will it be BENEFICIAL to all concerned?" },
] as const;

export const prayer =
  "Oh! God! Our Almighty Father & Ruler of the Universe, We thank thee for the inspiration you have given us for the Rotaract movement based upon Fellowship through Service. We humbly beg you to continue thy grace to enable us to do Our Service to ourselves and to our neighbors and to honor and glory of thy holy name.";

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Projects", href: "/projects" },
  { label: "Publications", href: "/publications" },
  { label: "Contact", href: "/contact" },
] as const;

export const forms = {
  contact: "https://script.google.com/macros/s/AKfycbwcyrxQIkGgFXSeLFoOKnihH0zEWx0sr4pbzZ8vYoJlb7nqiKvxQdGitzmhGF32X69Nbw/exec",
  join: "https://script.google.com/macros/s/AKfycbzRW3jTEs-4Su_GdsoqPOPT88vZoa-OecjrcMvJAvkZsJqwpzwnfRFrmLriT-Qqinc6VA/exec",
  bloodDonor: "https://script.google.com/macros/s/AKfycbwTz4QewjWnwZoJUGtguKCaqeH5yJEybUhVs42C206l7mNWojNu4v970w2r5JrlUSR_qQ/exec",
} as const;
