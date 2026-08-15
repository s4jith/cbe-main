import type { GlobalConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateGlobalAfterChange } from "@/lib/revalidate";

/**
 * Site-wide details that used to be fixed in src/lib/defaults.ts. Every field is
 * optional: the content layer falls back to those same defaults whenever one is
 * left blank, so the site never renders a hole while this is being filled in.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Site",
    description:
      "Footer links, socials, contact details and copyright. Anything left blank falls back to what the site already ships with.",
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
          label: "Contact",
          description: "Used in the footer, on the contact page, and as the reply-to on emails.",
          fields: [
            { name: "email", type: "email" },
            { name: "phone", type: "text" },
            { name: "address", type: "textarea" },
          ],
        },
        {
          label: "Footer",
          fields: [
            {
              name: "footerLinks",
              type: "array",
              label: "Footer links",
              labels: { singular: "Link", plural: "Links" },
              admin: {
                description:
                  "The 'get involved' column. Leave empty to keep the links the site ships with.",
              },
              fields: [
                { name: "label", type: "text", required: true },
                { name: "url", type: "text", required: true },
              ],
            },
            {
              name: "copyrightText",
              type: "text",
              admin: {
                description:
                  "Supports {year} and {name} — e.g. “© {year} {name}. All rights reserved.”",
              },
            },
          ],
        },
        {
          label: "Socials",
          fields: [
            {
              name: "socialLinks",
              type: "array",
              label: "Social links",
              labels: { singular: "Profile", plural: "Profiles" },
              admin: { description: "Shown in the footer and on the contact page." },
              fields: [
                {
                  name: "platform",
                  type: "select",
                  required: true,
                  options: [
                    { label: "Instagram", value: "Instagram" },
                    { label: "Facebook", value: "Facebook" },
                    { label: "LinkedIn", value: "LinkedIn" },
                    { label: "X", value: "X" },
                    { label: "YouTube", value: "YouTube" },
                    { label: "WhatsApp", value: "WhatsApp" },
                  ],
                },
                { name: "url", type: "text", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
