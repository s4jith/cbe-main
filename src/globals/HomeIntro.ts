import type { GlobalConfig } from "payload";
import { anyone, isLoggedIn } from "@/lib/access";
import { revalidateGlobalAfterChange } from "@/lib/revalidate";

/**
 * The curtain that plays over the home page on a visitor's first arrival: a run
 * of photographs sliding past on vertical panels, which then close onto the club
 * mark before lifting to reveal the page.
 *
 * It is skipped entirely when fewer than two panels are set, so an empty CMS
 * degrades to the plain home page rather than a broken animation.
 */
export const HomeIntro: GlobalConfig = {
  slug: "home-intro",
  label: "Home Intro",
  admin: {
    group: "Site",
    description:
      "The opening sequence on the home page, and the headline it reveals. Shown once per visit.",
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
      name: "enabled",
      type: "checkbox",
      label: "Play the intro",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Turn this off to send visitors straight to the home page.",
      },
    },
    {
      name: "headline",
      type: "text",
      required: true,
      defaultValue: "We don't serve, we rise.",
      admin: { description: "The line the home page opens with once the curtain lifts." },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "The mark the panels close onto. Leave empty to use the club logo already in the header.",
      },
    },
    {
      name: "panelImages",
      type: "array",
      label: "Curtain photographs",
      labels: { singular: "Photograph", plural: "Photographs" },
      minRows: 2,
      maxRows: 12,
      admin: {
        description:
          "Photographs that slide past on the panels — five or more looks best. Fewer than two skips the intro.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
