import Image from "next/image";
import Link from "next/link";
import SocialIcon from "@/components/SocialIcon";
import BackToTop from "@/components/BackToTop";
import * as D from "@/lib/defaults";
import type { FooterData, NavLink, SiteInfo } from "@/lib/types";

/**
 * The ending: identity and socials on the left, a short menu and the contact
 * details on the right, then the club's name set as large as the page allows.
 *
 * The wordmark is two layers — "COIMBATORE" stretched faintly across the full
 * width with "MAIN" solid on top of it. Both are decorative duplicates of text
 * already in the footer, so they are hidden from assistive tech.
 */
export default function Footer({
  data,
  site,
  menu,
}: {
  data: FooterData;
  site: SiteInfo;
  menu: NavLink[];
}) {
  return (
    <footer className="bg-space-deep text-paper">
      <div className="shell pt-20 max-md:pt-14">
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-12">
          {/* --- identity + socials --------------------------------------- */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-3">
              <Image
                src={D.BRAND.logo}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
              <div>
                <p className="title-sans text-[18px] leading-none text-paper">
                  {data.brandText} <span className="text-starlight">{data.brandSymbol}</span>
                </p>
                <p className="mt-1.5 text-[12px] leading-tight text-paper/45">{site.name}</p>
              </div>
            </div>

            {site.socials.length > 0 && (
              <div className="mt-12 max-md:mt-8">
                <h2 className="title-sans text-[19px] text-paper">Follow Us</h2>
                <ul className="mt-5 flex flex-wrap items-center gap-6">
                  {site.socials
                    .filter((s) => s.href && s.href !== "#")
                    .map((s) => (
                      <li key={s.label}>
                        <Link
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="block text-paper/70 transition-colors hover:text-starlight"
                        >
                          <SocialIcon name={s.label} />
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {/* --- menu ------------------------------------------------------ */}
          <nav aria-label="Footer menu" className="md:col-span-3">
            <h2 className="title-sans text-[19px] text-paper">Menu</h2>
            <ul className="mt-5 space-y-3.5">
              {menu.map((l) => (
                <li key={`${l.label}-${l.href}`}>
                  <Link
                    href={l.href}
                    className="wipe-link text-[15px] text-paper/70 transition-colors hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* --- contact --------------------------------------------------- */}
          <div className="md:col-span-3">
            <h2 className="title-sans text-[19px] text-paper">Contact</h2>
            <ul className="mt-5 space-y-3.5">
              {site.email && (
                <li>
                  <Link
                    href={site.emailHref}
                    className="wipe-link text-[15px] text-paper/70 transition-colors hover:text-paper"
                  >
                    {site.email}
                  </Link>
                </li>
              )}
              {site.phone && (
                <li>
                  <Link
                    href={site.phoneHref}
                    className="wipe-link text-[15px] text-paper/70 transition-colors hover:text-paper"
                  >
                    {site.phone}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* --- the wordmark --------------------------------------------- */}
        <div className="mt-20 border-t border-line-invert pt-14 max-md:mt-14 max-md:pt-10">
          <div aria-hidden className="relative select-none">
            {/* Back layer: stretched edge to edge, just legible. */}
            <span
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display uppercase leading-none text-paper/10"
              style={{ fontSize: "clamp(30px, 8.6vw, 118px)", letterSpacing: "0.02em" }}
            >
              Coimbatore
            </span>
            {/* Front layer. */}
            <p
              className="relative text-center font-display uppercase leading-[0.85] text-paper"
              style={{ fontSize: "clamp(72px, 22vw, 300px)" }}
            >
              {data.wordmark}
            </p>
          </div>
        </div>

        {/* --- bottom bar ------------------------------------------------ */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line-invert py-8 max-md:mt-8">
          <p className="text-[13px] text-paper/40">{data.copyright}</p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
