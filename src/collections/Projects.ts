import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/revalidate";

export const AVENUE_OPTIONS = [
  { label: "Club Service", value: "Club Service" },
  { label: "Community Service", value: "Community Service" },
  { label: "Professional Service", value: "Professional Service" },
  { label: "International Service", value: "International Service" },
  { label: "District Priority", value: "District Priority" },
] as const;

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["image", "title", "avenue", "order"],
    group: "Content",
    description: "Every project card on the projects page and the counts on the home page.",
    listSearchableFields: ["title", "description"],
    pagination: { defaultLimit: 25 },
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
    { name: "title", type: "text", required: true },
    {
      name: "avenue",
      type: "select",
      required: true,
      options: [...AVENUE_OPTIONS],
      admin: { position: "sidebar" },
    },
    { name: "description", type: "textarea", required: true },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "monthOnly", displayFormat: "MMM yyyy" },
        description:
          "Month and year this happened. Powers the year/month filters on the projects page — club years run July to June, so a project dated any month from July through December belongs to that calendar year's edition, and January through June belongs to the following one.",
      },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first within the avenue.",
      },
    },
  ],
};
