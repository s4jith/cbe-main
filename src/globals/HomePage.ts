import type { GlobalConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateGlobalAfterChange } from "@/lib/revalidate";
import { AVENUE_OPTIONS } from "@/collections/Projects";

const ACCENT_OPTIONS = [
  { label: "Starlight (yellow)", value: "starlight" },
  { label: "Comet (blue)", value: "comet" },
  { label: "Nebula (violet)", value: "nebula" },
  { label: "Cranberry (red)", value: "cranberry" },
];

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Home Page",
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
      name: "heroStrip",
      label: "Hero Strip Cards",
      type: "array",
      admin: { description: "Photo cards in the scrolling strip under the home hero." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "stat", type: "text", required: true },
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
    {
      name: "avenues",
      type: "array",
      admin: { description: "The five avenues of service shown on the home and projects pages." },
      fields: [
        {
          name: "avenue",
          type: "select",
          required: true,
          options: [...AVENUE_OPTIONS],
        },
        {
          name: "slug",
          type: "text",
          required: true,
          admin: { description: "URL filter key, e.g. club, community, professional, international, district." },
        },
        {
          name: "accent",
          type: "select",
          required: true,
          options: ACCENT_OPTIONS,
        },
        { name: "blurb", type: "textarea", required: true },
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
    {
      name: "stats",
      type: "array",
      admin: { description: '"Numbers that carry weight" section.' },
      fields: [
        { name: "value", type: "number", required: true },
        { name: "suffix", type: "text", defaultValue: "" },
        { name: "label", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
  ],
};
