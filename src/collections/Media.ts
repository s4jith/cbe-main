import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Library",
    description: "Every photo and PDF used on the site. Upload here, then pick the file from any page.",
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "updatedAt"],
  },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  // A phone photo straight off a committee member's camera is 6–12 MB. Uploading
  // that verbatim is what made the old library 107 MB, and every one of those
  // originals had to be decoded by the image optimizer on first request. Cap the
  // stored original at 2000px and re-encode to WebP so the library can't drift
  // back there, whoever is uploading.
  upload: {
    resizeOptions: {
      width: 2000,
      height: 2000,
      fit: "inside",
      withoutEnlargement: true,
    },
    formatOptions: {
      format: "webp",
      options: { quality: 80 },
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Description",
      admin: {
        description:
          "What the image shows. Read aloud by screen readers and shown if the image fails to load.",
      },
    },
  ],
};
