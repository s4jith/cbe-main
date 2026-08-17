import type { GlobalConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateGlobalAfterChange } from "@/lib/revalidate";

/**
 * The written parts of the home page that are not a list of something else —
 * the statement under Our Story, the Discover band, and the words framing the
 * events and FAQ sections.
 *
 * Every field is optional: the content layer falls back to the shipped defaults
 * whenever one is blank, so the page never renders a hole while this is being
 * filled in.
 */
export const HomeSections: GlobalConfig = {
  slug: "home-sections",
  label: "Home Page",
  admin: {
    group: "Site",
    description:
      "The headings and copy on the home page. Anything left blank falls back to what the site already ships with.",
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
          label: "Our Story",
          fields: [
            {
              name: "storyEyebrow",
              type: "text",
              admin: { description: "The small label above the heading." },
            },
            { name: "storyHeading", type: "text" },
            {
              name: "statement",
              type: "textarea",
              admin: {
                description:
                  "The large statement that colours itself in as the reader scrolls past. Two or three sentences works best.",
              },
            },
          ],
        },
        {
          label: "Discover",
          fields: [
            { name: "discoverEyebrow", type: "text" },
            { name: "discoverHeading", type: "text" },
            { name: "discoverBody", type: "textarea" },
            {
              name: "discoverImage",
              type: "upload",
              relationTo: "media",
              admin: { description: "The photograph beside the figures." },
            },
            {
              name: "discoverImageLabel",
              type: "text",
              admin: { description: "The caption under that photograph." },
            },
            {
              name: "stats",
              type: "array",
              label: "Figures",
              labels: { singular: "Figure", plural: "Figures" },
              maxRows: 4,
              admin: { description: "Four reads best — they are laid out two by two." },
              fields: [
                {
                  name: "value",
                  type: "text",
                  required: true,
                  admin: { description: "e.g. 500+" },
                },
                { name: "label", type: "text", required: true },
                {
                  name: "href",
                  type: "text",
                  admin: { description: "Optional. Makes the figure a link." },
                },
              ],
            },
          ],
        },
        {
          label: "Events & FAQ",
          fields: [
            {
              name: "eventsBackdrop",
              type: "text",
              admin: {
                description:
                  "The hollow words behind the events track. Use a line break between the two lines.",
              },
            },
            { name: "faqEyebrow", type: "text" },
            { name: "faqHeading", type: "text" },
          ],
        },
      ],
    },
  ],
};
