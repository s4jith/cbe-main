import Image from "next/image";
import Link from "next/link";
import SocialIcon from "@/components/SocialIcon";
import BackToTop from "@/components/BackToTop";
import FooterWordmark from "@/components/FooterWordmark";
import * as D from "@/lib/defaults";
import type { FooterData, NavLink, SiteInfo } from "@/lib/types";

/** Kept for CtaClose, which reuses this shape for the closing invitation. */
export type FooterCta = {
  headline: string[];
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  secondaryNote?: string;
};

/**
 * A full-height closing footer. Identity, menu and contact sit at the top; the
 * club name runs across the foot of the page, its letters spread edge to edge
 * the way a masthead is set — one clean wordmark rather than two overlapping
 * words.
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
    <footer className="flex min-h-dvh flex-col bg-space-deep text-paper">
      <div className="shell flex flex-1 flex-col pt-24 max-md:pt-16">
        {/* --- identity / menu / contact -------------------------------- */}
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="flex items-center gap-4">
              <Image
                src={D.BRAND.logo}
                alt=""
                width={88}
                height={88}
                className="h-[88px] w-[88px] object-contain max-md:h-16 max-md:w-16"
              />
              <div>
                <p className="title-sans text-[30px] leading-none text-paper max-md:text-[22px]">
                  {data.brandText} <span className="text-starlight">{data.brandSymbol}</span>
                </p>
                <p className="mt-2 text-[15px] leading-tight text-paper/50 max-md:text-[13px]">
                  {site.name}
                </p>
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
                          className="block text-paper/70 transition-colors hover:text-cranberry"
                        >
                          <SocialIcon name={s.label} />
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

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

        {/* --- the wordmark, spread across the foot --------------------- */}
        <div className="mt-auto pt-16 max-md:pt-12">
          <div className="border-t border-line-invert pt-8" />
          <FooterWordmark wordmark={data.wordmark} />
        </div>

        {/* --- bottom bar ------------------------------------------------ */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line-invert py-7">
          <p className="text-[13px] text-paper/40">{data.copyright}</p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
