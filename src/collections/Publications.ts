import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/revalidate";

export const Publications: CollectionConfig = {
  slug: "publications",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "order"],
    group: "Content",
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
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Newsletter", value: "newsletter" },
        { label: "Scrapbook", value: "scrapbook" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "pdfFile",
      type: "upload",
      relationTo: "media",
      admin: { description: "Upload the PDF here, or paste an external link below." },
    },
    {
      name: "pdfUrl",
      type: "text",
      admin: { description: "External PDF link — used when no PDF file is uploaded." },
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
