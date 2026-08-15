import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/revalidate";
import { currentRotaractYear } from "./Members";

/**
 * One entry per Rotaract year, holding that board's group photograph.
 *
 * Kept separate from Members because the photo belongs to the year rather than
 * to any one person — and because adding next year's board should be a matter of
 * creating one record here, not editing code.
 */
export const BoardYears: CollectionConfig = {
  slug: "board-years",
  labels: { singular: "Board Year", plural: "Board Years" },
  admin: {
    useAsTitle: "year",
    defaultColumns: ["groupPhoto", "year"],
    group: "Content",
    description:
      "The group photograph for each board. The year tabs on the home page are built from these, and each one pairs with the members carrying the same year.",
  },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  defaultSort: "-year",
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: "year",
      type: "number",
      required: true,
      unique: true,
      defaultValue: () => currentRotaractYear(),
      admin: {
        description:
          "The starting year of the term — a board serving July 2026 to June 2027 is 2026. Must match the year set on that board's members.",
      },
    },
    {
      name: "groupPhoto",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "The whole board in one photograph. A wide, landscape shot works best." },
    },
    {
      name: "caption",
      type: "text",
      admin: { description: "Optional line under the photograph — e.g. the installation venue." },
    },
  ],
};
