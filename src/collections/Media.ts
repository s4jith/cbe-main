import type { CollectionConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Content",
  },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  upload: true,
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
};
