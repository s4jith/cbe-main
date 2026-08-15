import type { GlobalConfig } from "payload";
import { isLoggedIn } from "@/lib/access";

/**
 * The two contact emails, each editable on its own. They share this shape but
 * deliberately not their content: one is an internal notification, the other is
 * the club's voice speaking to a stranger.
 *
 * Neither is read by the public site, so there is no revalidate hook and read is
 * closed — they are only ever loaded server-side when a message is sent.
 */
function contactEmailTemplate({
  slug,
  label,
  description,
  defaultSubject,
  tokens,
}: {
  slug: string;
  label: string;
  description: string;
  defaultSubject: string;
  tokens: string;
}): GlobalConfig {
  return {
    slug,
    label,
    admin: { group: "Email", description },
    access: {
      read: isLoggedIn,
      update: isLoggedIn,
    },
    fields: [
      {
        name: "subject",
        type: "text",
        required: true,
        defaultValue: defaultSubject,
        admin: { description: `Subject line. ${tokens}` },
      },
      {
        name: "headerImage",
        type: "upload",
        relationTo: "media",
        admin: {
          description: "Optional banner across the top of the email. Wide and short works best.",
        },
      },
      {
        name: "richTextBody",
        type: "richText",
        required: true,
        admin: { description: `The body of the email. ${tokens}` },
      },
      {
        name: "footerNote",
        type: "text",
        admin: {
          description: "Small print under the message — e.g. why they are receiving this.",
        },
      },
    ],
  };
}

const SENDER_TOKENS =
  "You can use {name}, {email}, {phone}, {message} and {date} — they are replaced with the sender's details.";

export const AdminContactEmailTemplate = contactEmailTemplate({
  slug: "admin-contact-email",
  label: "Admin Notification",
  description: "What lands in the club inbox when somebody uses the contact form.",
  defaultSubject: "New enquiry from {name}",
  tokens: SENDER_TOKENS,
});

export const UserContactEmailTemplate = contactEmailTemplate({
  slug: "user-contact-email",
  label: "Sender Acknowledgement",
  description: "The confirmation the sender receives after using the contact form.",
  defaultSubject: "Thanks for writing to us, {name}",
  tokens: SENDER_TOKENS,
});
