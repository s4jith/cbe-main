import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/revalidate";
import { slugField } from "@/lib/slug";

export const EVENT_STATUSES = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Past", value: "past" },
] as const;

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["heroImage", "name", "date", "status"],
    group: "Content",
    description:
      "Everything on the events page. Upcoming events lead the page; past ones fall into the archive below.",
    listSearchableFields: ["name", "location"],
    pagination: { defaultLimit: 25 },
  },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  defaultSort: "-date",
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: "name", type: "text", required: true },
    slugField("name"),
    {
      name: "description",
      type: "richText",
      required: true,
      admin: { description: "The full write-up shown on the event's own page." },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "The lead photograph — used on the event card and at the top of its page." },
    },
    {
      name: "gallery",
      type: "array",
      labels: { singular: "Photo", plural: "Photos" },
      admin: { description: "Photographs from the event, shown as a gallery on its page." },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime", displayFormat: "d MMM yyyy, h:mm a" },
      },
    },
    {
      name: "location",
      type: "text",
      required: true,
      admin: { position: "sidebar", description: "Where it happens — venue, or city." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "upcoming",
      options: [...EVENT_STATUSES],
      admin: {
        position: "sidebar",
        description: "Controls where the event appears on the page.",
      },
    },
    {
      name: "posterTone",
      type: "select",
      label: "Poster colour",
      required: true,
      defaultValue: "starlight",
      options: [
        { label: "Club gold", value: "starlight" },
        { label: "Cranberry", value: "cranberry" },
        { label: "Comet blue", value: "comet" },
        { label: "Nebula violet", value: "nebula" },
      ],
      admin: {
        position: "sidebar",
        description: "The card colour on the home page events strip.",
      },
    },
    {
      name: "kicker",
      type: "text",
      admin: {
        description:
          "The short line under the poster image on the home page — e.g. “5K charity run · 400+ runners”.",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Show on the home page",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "The home page strip shows up to five events. Tick this to put one there; the newest fill any remaining slots.",
      },
    },
    {
      name: "registrationLink",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Optional. A registration or RSVP link — the button only appears when this is filled in.",
      },
    },
  ],
};
