import type { GlobalConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateGlobalAfterChange } from "@/lib/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: anyone,
    update: isLoggedIn,
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity",
          fields: [
            { name: "name", type: "text", required: true },
            { name: "shortName", type: "text", required: true },
            { name: "parent", type: "text", required: true },
            { name: "clubId", type: "text", required: true },
            { name: "group", type: "text", required: true },
            { name: "district", type: "text", required: true },
            { name: "chartered", type: "text", required: true },
            { name: "charterPresident", type: "text", required: true },
            { name: "tagline", type: "textarea", required: true },
            {
              name: "description",
              type: "textarea",
              required: true,
              admin: { description: "Used for SEO metadata." },
            },
            {
              name: "url",
              type: "text",
              required: true,
              admin: { description: "Canonical site URL, no trailing slash." },
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            { name: "phone", type: "text", required: true },
            { name: "email", type: "email", required: true },
            {
              name: "socials",
              type: "array",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "href", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Forms",
          fields: [
            {
              name: "forms",
              type: "group",
              admin: { description: "Google Apps Script endpoints receiving form submissions." },
              fields: [
                { name: "contact", type: "text", required: true },
                { name: "join", type: "text", required: true },
                { name: "bloodDonor", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Texts",
          fields: [{ name: "prayer", type: "textarea", required: true }],
        },
      ],
    },
  ],
};
