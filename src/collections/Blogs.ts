import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/revalidate";
import { slugField } from "@/lib/slug";

export const Blogs: CollectionConfig = {
  slug: "blogs",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["heroImage", "name", "avenue", "date"],
    group: "Content",
    description:
      "Write-ups for the blog. The hero image and card summary are what show in the list; everything else appears once a reader opens the post.",
    listSearchableFields: ["name", "cardSummary"],
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
    {
      name: "name",
      type: "text",
      label: "Title",
      required: true,
    },
    slugField("name"),
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "The image on the blog card and at the top of the post." },
    },
    {
      name: "cardSummary",
      type: "textarea",
      required: true,
      maxLength: 240,
      admin: {
        description: "One or two sentences. This is all a reader sees on the card before clicking through.",
      },
    },
    {
      name: "details",
      type: "richText",
      required: true,
      admin: { description: "The post itself — headings, links and formatting all work here." },
    },
    {
      name: "gallery",
      type: "array",
      labels: { singular: "Photo", plural: "Photos" },
      maxRows: 3,
      admin: { description: "Up to three photographs, shown as a gallery at the end of the post." },
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
      name: "avenue",
      type: "relationship",
      relationTo: "avenues",
      required: true,
      admin: {
        position: "sidebar",
        description: "Which avenue this post belongs to. It surfaces on that avenue's card in the home page deck.",
      },
    },
    {
      name: "date",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
      },
    },
  ],
};
