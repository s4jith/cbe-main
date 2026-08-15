"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import * as D from "@/lib/defaults";
import {
  fillTokens,
  quoteBlock,
  renderBody,
  renderEmail,
  toPlainText,
  type SubmissionTokens,
} from "@/lib/email";

export type ContactResult = { ok: true } | { ok: false; error: string };

const MAX = { name: 120, email: 200, phone: 40, message: 5000 };

function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === "object" && "url" in media) {
    const url = (media as { url?: unknown }).url;
    if (typeof url === "string" && url) return url;
  }
  return undefined;
}

/** Relative uploads need an absolute URL — an email client has no origin to resolve against. */
function absolute(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  const base = process.env.NEXT_PUBLIC_SITE_URL || D.SITE.url;
  return base ? `${base.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}` : undefined;
}

/**
 * Handles a contact form submission: stores it, then tries both emails.
 *
 * The store comes first and its failure is the only one the visitor is told
 * about. If Resend is down, or the sender's address bounces, the club still has
 * the message in the admin — telling the visitor "something went wrong" at that
 * point would just make them send it twice.
 */
export async function submitContact(formData: FormData): Promise<ContactResult> {
  // Legacy spam trap, same field name the old Apps Script endpoint used.
  if (formData.get("_honeypot")) return { ok: true };

  const read = (key: string, limit: number) =>
    String(formData.get(key) ?? "")
      .trim()
      .slice(0, limit);

  const name = read("name", MAX.name);
  const email = read("email", MAX.email);
  const phone = read("phone", MAX.phone);
  const message = read("message", MAX.message);

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in your name, email and message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "That email address doesn't look right." };
  }

  const payload = await getPayload({ config });

  let submissionId: string | number;
  try {
    const created = await payload.create({
      collection: "contact-submissions",
      data: { name, email, phone, message, status: "new" },
      overrideAccess: true,
      context: { disableRevalidate: true },
    });
    submissionId = created.id;
  } catch (err) {
    console.error("[contact] could not store submission", err);
    return { ok: false, error: "We couldn't send that just now. Please try again in a moment." };
  }

  const tokens: SubmissionTokens = {
    name,
    email,
    phone,
    message,
    date: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }),
  };

  const delivery = { adminEmailSent: false, userEmailSent: false, error: undefined as string | undefined };

  try {
    const [adminTpl, userTpl] = await Promise.all([
      payload.findGlobal({ slug: "admin-contact-email", depth: 1, overrideAccess: true }),
      payload.findGlobal({ slug: "user-contact-email", depth: 1, overrideAccess: true }),
    ]);

    const adminTo = process.env.ADMIN_EMAIL || D.SITE.email;

    // Club notification — the quoted message is appended by us, not the template,
    // so it is always present regardless of how the body has been edited.
    if (adminTpl?.richTextBody && adminTo) {
      const html = renderEmail({
        headerImageUrl: absolute(mediaUrl(adminTpl.headerImage)),
        bodyHtml: renderBody(adminTpl.richTextBody as SerializedEditorState, tokens),
        extraHtml: quoteBlock(tokens),
        footerNote: adminTpl.footerNote ?? undefined,
        preheader: `${name} — ${message.slice(0, 90)}`,
      });
      await payload.sendEmail({
        to: adminTo,
        replyTo: email,
        subject: fillTokens(adminTpl.subject || "New enquiry from {name}", tokens),
        html,
        text: toPlainText(html),
      });
      delivery.adminEmailSent = true;
    }

    // Sender acknowledgement.
    if (userTpl?.richTextBody) {
      const html = renderEmail({
        headerImageUrl: absolute(mediaUrl(userTpl.headerImage)),
        bodyHtml: renderBody(userTpl.richTextBody as SerializedEditorState, tokens),
        extraHtml: quoteBlock(tokens),
        footerNote: userTpl.footerNote ?? undefined,
        preheader: "We've got your message and will be in touch soon.",
      });
      await payload.sendEmail({
        to: email,
        ...(D.SITE.email ? { replyTo: process.env.ADMIN_EMAIL || D.SITE.email } : {}),
        subject: fillTokens(userTpl.subject || "Thanks for writing to us, {name}", tokens),
        html,
        text: toPlainText(html),
      });
      delivery.userEmailSent = true;
    }
  } catch (err) {
    // Resend's sandbox sender can only deliver to the account owner's own
    // address, so the acknowledgement is expected to fail until a domain is
    // verified. Record it and carry on — the message is already saved.
    delivery.error = err instanceof Error ? err.message.slice(0, 300) : "Unknown send error";
    console.error("[contact] email send failed", err);
  }

  try {
    await payload.update({
      collection: "contact-submissions",
      id: submissionId,
      data: { delivery },
      overrideAccess: true,
      context: { disableRevalidate: true },
    });
  } catch {
    // Delivery bookkeeping only — never worth failing the request over.
  }

  return { ok: true };
}
