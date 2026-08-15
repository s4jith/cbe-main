import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/revalidate";

export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
    group: "Content",
    description:
      "The questions answered at the bottom of the home page. Keep the answers short — one short paragraph reads best in the accordion.",
    listSearchableFields: ["question", "answer"],
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
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
    {
      name: "order",
      type: "number",
      label: "Priority",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first (0, 1, 2 …).",
      },
    },
  ],
};
