import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/revalidate";
import { slugField } from "@/lib/slug";

/**
 * The five Rotaract avenues of service, as content rather than a hardcoded list —
 * they drive the card deck on the home page and tag every blog post.
 *
 * `accent` is a design-token name, not a free hex value: the palette in
 * globals.css is deliberately one accent plus a few muted markers, and letting
 * editors paste arbitrary colours is what breaks that.
 */
export const AVENUE_ACCENTS = [
  { label: "Club gold", value: "starlight" },
  { label: "Cranberry", value: "cranberry" },
  { label: "Comet blue", value: "comet" },
  { label: "Nebula violet", value: "nebula" },
] as const;

export const Avenues: CollectionConfig = {
  slug: "avenues",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["image", "name", "accentColor", "order"],
    group: "Content",
    description:
      "The five avenues of service. These are the cards in the home page deck and the tags on blog posts — the set rarely changes, but the words and photography here are yours to edit.",
    listSearchableFields: ["name", "description"],
  },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  defaultSort: "order",
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "e.g. Community Service." },
    },
    slugField("name"),
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: { description: "The line that appears on the back of the card when it is turned over." },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "The photograph on the face of the card." },
    },
    {
      name: "accentColor",
      type: "select",
      label: "Accent",
      required: true,
      defaultValue: "starlight",
      options: [...AVENUE_ACCENTS],
      admin: {
        position: "sidebar",
        description: "The marker colour for this avenue. Drawn from the site palette.",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Priority",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Order in the deck — lower numbers sit on top (0, 1, 2 …).",
      },
    },
  ],
};
