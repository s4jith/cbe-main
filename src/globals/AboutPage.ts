import type { GlobalConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateGlobalAfterChange } from "@/lib/revalidate";

const ACCENT_TEXT_OPTIONS = [
  { label: "Comet (blue)", value: "text-comet" },
  { label: "Starlight (yellow)", value: "text-starlight" },
  { label: "Cranberry (red)", value: "text-cranberry" },
];

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About Page",
  admin: {
    group: "Pages",
  },
  access: {
    read: anyone,
    update: isLoggedIn,
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      name: "storyImages",
      type: "array",
      admin: { description: "Photo fan at the top of the about page." },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "alt", type: "text", required: true },
      ],
    },
    {
      name: "storyParagraphs",
      type: "array",
      admin: { description: 'The "our story" editorial paragraphs.' },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "manifesto",
      type: "array",
      admin: { description: '"A force that…" statement lines.' },
      fields: [
        { name: "text", type: "text", required: true },
        {
          name: "accent",
          type: "select",
          required: true,
          options: ACCENT_TEXT_OPTIONS,
        },
      ],
    },
    {
      name: "timeline",
      type: "array",
      admin: { description: '"The journey so far" milestones.' },
      fields: [
        { name: "year", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
  ],
};
