import type { CollectionConfig } from "payload";
import { isLoggedIn } from "@/lib/access";

/**
 * Every message sent through the contact form, stored before either email goes
 * out — so a Resend outage or a bounced address never means a lost enquiry.
 *
 * Nothing here is public: `read` is admin-only even though `create` is open, and
 * there is no revalidate hook because none of it renders on the site.
 */
export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "status", "createdAt"],
    group: "Inbox",
    description: "Messages sent through the contact form on the website.",
    listSearchableFields: ["name", "email", "message"],
    pagination: { defaultLimit: 25 },
  },
  access: {
    // The public form posts through a server route, which uses local API
    // overrides — but keep create open so the collection is honest about who
    // writes to it, and read closed so messages stay private.
    create: () => true,
    read: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  defaultSort: "-createdAt",
  timestamps: true,
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text" },
    { name: "message", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Replied", value: "replied" },
        { label: "Archived", value: "archived" },
      ],
      admin: { position: "sidebar", description: "For your own triage — not shown to the sender." },
    },
    {
      name: "delivery",
      type: "group",
      label: "Email delivery",
      admin: {
        position: "sidebar",
        description: "Whether the notification and acknowledgement actually sent.",
      },
      fields: [
        {
          name: "adminEmailSent",
          type: "checkbox",
          label: "Notified the club",
          defaultValue: false,
          admin: { readOnly: true },
        },
        {
          name: "userEmailSent",
          type: "checkbox",
          label: "Acknowledged to sender",
          defaultValue: false,
          admin: { readOnly: true },
        },
        {
          name: "error",
          type: "text",
          admin: { readOnly: true, description: "Set when Resend rejected the send." },
        },
      ],
    },
  ],
};
