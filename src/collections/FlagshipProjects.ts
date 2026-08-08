import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/revalidate";

export const FlagshipProjects: CollectionConfig = {
  slug: "flagship-projects",
  labels: {
    singular: "Flagship Project",
    plural: "Flagship Projects",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["image", "title", "tag", "order"],
    group: "Content",
    description: "The spotlight tabs in the “Built to break barriers” section of the home page.",
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
      name: "tag",
      type: "text",
      required: true,
      admin: { description: 'Short label, e.g. "Flagship since 2019".' },
    },
    { name: "description", type: "textarea", required: true },
    {
      name: "stat",
      type: "text",
      required: true,
      admin: { description: 'Headline stat, e.g. "60+ players · 14 states".' },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers appear first." },
    },
  ],
};
