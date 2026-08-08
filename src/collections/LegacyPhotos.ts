import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/revalidate";

/** The archive gallery on /legacy. Stored on Cloudinary, not the Vercel Blob
 * media library — see cloudinaryAdapter() in payload.config.ts. */
export const LegacyPhotos: CollectionConfig = {
  slug: "legacy-photos",
  labels: { singular: "Legacy Photo", plural: "Legacy Photos" },
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "order"],
    group: "Content",
    description: "The archive gallery on the Legacy page — hosted on Cloudinary.",
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
  upload: {
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { position: "sidebar", description: "Lower numbers appear first." },
    },
  ],
};
