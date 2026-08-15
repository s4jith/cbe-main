import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import * as D from "@/lib/defaults";

/**
 * One branded email shell, shared by the club notification and the sender's
 * acknowledgement. Both bodies come out of the CMS, so this file owns only the
 * chrome around them.
 *
 * Everything here is table-based with inline styles on purpose — Gmail strips
 * <style> blocks, Outlook ignores flexbox, and neither honours CSS variables.
 * The palette below is the same warm paper and club gold as globals.css, copied
 * literally because an email cannot read that stylesheet.
 */
const PALETTE = {
  paper: "#f7f4ee",
  mist: "#ece7dd",
  ink: "#16150f",
  inkSoft: "#46433a",
  gold: "#e0a11b",
  goldInk: "#2e1f00",
  line: "#dcd6c9",
};

export type SubmissionTokens = {
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
};

/** Replace {tokens} in subject lines and body copy with the sender's details. */
export function fillTokens(input: string, tokens: SubmissionTokens): string {
  return input.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in tokens ? String(tokens[key as keyof SubmissionTokens]) : match,
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Lexical richtext → HTML, with the sender's details substituted in afterwards. */
export function renderBody(
  data: SerializedEditorState | null | undefined,
  tokens: SubmissionTokens,
): string {
  if (!data) return "";
  const html = convertLexicalToHTML({ data, disableContainer: true });
  return fillTokens(html, tokens);
}

/**
 * The sender's own words, quoted back in a bordered block. Kept separate from the
 * editable body so the club always sees the message even if somebody clears the
 * {message} token out of the template.
 */
export function quoteBlock(tokens: SubmissionTokens): string {
  const rows: [string, string][] = [
    ["Name", tokens.name],
    ["Email", tokens.email],
    ["Phone", tokens.phone || "—"],
    ["Received", tokens.date],
  ];

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:28px 0 0;background:${PALETTE.mist};border-radius:8px;">
      <tr><td style="padding:24px 26px;">
        ${rows
          .map(
            ([label, value]) => `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td style="padding:0 0 10px;font:500 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:0.14em;text-transform:uppercase;color:${PALETTE.inkSoft};width:96px;vertical-align:top;">${escapeHtml(label)}</td>
            <td style="padding:0 0 10px;font:500 15px/1.5 Helvetica,Arial,sans-serif;color:${PALETTE.ink};">${escapeHtml(value)}</td>
          </tr>
        </table>`,
          )
          .join("")}
        <div style="border-top:1px solid ${PALETTE.line};margin:6px 0 16px;"></div>
        <div style="font:500 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:0.14em;text-transform:uppercase;color:${PALETTE.inkSoft};padding-bottom:8px;">Message</div>
        <div style="font:400 15px/1.65 Helvetica,Arial,sans-serif;color:${PALETTE.ink};white-space:pre-wrap;">${escapeHtml(tokens.message)}</div>
      </td></tr>
    </table>`;
}

/**
 * Wrap an editable body in the club's letterhead.
 *
 * `preheader` is the grey line inbox clients show next to the subject; without
 * one they pull the first words of the HTML, which here would be the alt text of
 * the banner image.
 */
export function renderEmail({
  headerImageUrl,
  bodyHtml,
  extraHtml = "",
  footerNote,
  preheader,
}: {
  headerImageUrl?: string;
  bodyHtml: string;
  extraHtml?: string;
  footerNote?: string;
  preheader?: string;
}): string {
  const banner = headerImageUrl
    ? `<tr><td style="padding:0;">
         <img src="${escapeHtml(headerImageUrl)}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
       </td></tr>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${escapeHtml(D.SITE.name)}</title>
</head>
<body style="margin:0;padding:0;background:${PALETTE.mist};-webkit-text-size-adjust:100%;">
${
  preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>`
    : ""
}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:${PALETTE.mist};">
  <tr><td align="center" style="padding:32px 16px;">

    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:600px;background:${PALETTE.paper};border-radius:10px;overflow:hidden;">

      <tr><td style="padding:28px 32px 0;">
        <div style="font:700 15px/1 Helvetica,Arial,sans-serif;letter-spacing:-0.02em;color:${PALETTE.ink};">
          ${escapeHtml(D.SITE.shortName)} <span style="color:${PALETTE.gold};">&#10022;</span>
        </div>
        <div style="font:500 11px/1.5 Helvetica,Arial,sans-serif;letter-spacing:0.14em;text-transform:uppercase;color:${PALETTE.inkSoft};padding-top:6px;">
          ${escapeHtml(D.SITE.name)}
        </div>
      </td></tr>

      <tr><td style="padding:22px 32px 0;"><div style="border-top:1px solid ${PALETTE.line};"></div></td></tr>

      ${banner ? `<tr><td style="padding:22px 0 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${banner}</table></td></tr>` : ""}

      <tr><td style="padding:26px 32px 0;font:400 16px/1.65 Helvetica,Arial,sans-serif;color:${PALETTE.ink};">
        ${bodyHtml}
      </td></tr>

      ${extraHtml ? `<tr><td style="padding:0 32px;">${extraHtml}</td></tr>` : ""}

      <tr><td style="padding:30px 32px 32px;">
        <div style="border-top:1px solid ${PALETTE.line};padding-top:18px;font:400 13px/1.6 Helvetica,Arial,sans-serif;color:${PALETTE.inkSoft};">
          ${footerNote ? `${escapeHtml(footerNote)}<br /><br />` : ""}
          ${escapeHtml(D.SITE.name)}${D.SITE.district ? ` &middot; ${escapeHtml(D.SITE.district)}` : ""}
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/** Plain-text fallback for clients that refuse HTML. */
export function toPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
