import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/revalidate";

export const Members: CollectionConfig = {
  slug: "members",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["photo", "name", "role", "memberType", "order"],
    group: "Content",
    description:
      "The team shown on the Team page and the home page teaser. Add, edit or delete a member here — Priority controls the order they appear in.",
    listSearchableFields: ["name", "role"],
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
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "text",
      label: "Designation",
      required: true,
      defaultValue: "Member",
      admin: { description: "Job title / position — e.g. President, Secretary, Member." },
    },
    {
      name: "memberType",
      type: "select",
      label: "Team",
      required: true,
      defaultValue: "general",
      options: [
        { label: "Board of Directors", value: "board" },
        { label: "General Member", value: "general" },
      ],
      admin: {
        position: "sidebar",
        description:
          "Board members show name + designation on the Team page. General members show in the name-only circle grid further down.",
      },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "order",
      type: "number",
      label: "Priority",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Display order on the website — lower numbers appear first (0, 1, 2 …).",
      },
    },
  ],
};
