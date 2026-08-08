import type { ContactBlock, SiteInfo } from "@/lib/types";
import { alpha, cssColor } from "@/lib/theme";

/** The small "we're always here to chat" blocks used on the form pages. */
export default function ContactBlocks({
  blocks,
  site,
  titleColor,
  linkColor,
  className = "",
}: {
  blocks: ContactBlock[];
  site: SiteInfo;
  titleColor?: string;
  linkColor?: string;
  className?: string;
}) {
  const title = cssColor(titleColor, "var(--color-ink)");
  const link = cssColor(linkColor, "var(--color-ink)");

  return (
    <div className={`flex flex-wrap justify-between gap-10 ${className}`}>
      {blocks.map((block) => (
        <div key={block.title}>
          <p className="text-[20px] font-extrabold lowercase" style={{ color: title }}>
            {block.title}
          </p>
          {(block.kind === "email" || block.kind === "emailPhone") && (
            <a href={site.emailHref} className="wipe-link mt-2 inline-block text-[17px] font-semibold" style={{ color: link }}>
              {site.email}
            </a>
          )}
          {block.kind === "emailPhone" && <br />}
          {(block.kind === "phone" || block.kind === "emailPhone") && (
            <a href={site.phoneHref} className="wipe-link mt-1 inline-block text-[17px] font-semibold" style={{ color: link }}>
              {site.phone}
            </a>
          )}
          {block.kind === "socials" && (
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wipe-link text-[16px] font-semibold"
                  style={{ color: alpha(link, 80) }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
          {block.kind === "custom" && block.text && (
            block.href ? (
              <a href={block.href} className="wipe-link mt-2 inline-block text-[17px] font-semibold" style={{ color: link }}>
                {block.text}
              </a>
            ) : (
              <p className="mt-2 text-[17px] font-semibold" style={{ color: link }}>
                {block.text}
              </p>
            )
          )}
        </div>
      ))}
    </div>
  );
}
