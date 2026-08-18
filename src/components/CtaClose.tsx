import Link from "next/link";
import type { FooterCta } from "@/components/Footer";

/**
 * The closing call to action, given a full screen of its own before the footer.
 *
 * `min-h-dvh` with the content centred is what makes it read as a page rather
 * than a strip: the invitation fills the view, then the footer follows as a
 * separate band.
 */
export default function CtaClose({ cta, symbol = "✦" }: { cta: FooterCta; symbol?: string }) {
  return (
    <section className="flex min-h-dvh flex-col justify-center overflow-hidden bg-space-deep py-24 text-paper max-md:py-16">
      <div className="shell w-full">
        <p className="eyebrow text-cranberry">Get involved {symbol}</p>

        <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-12 lg:items-end max-md:mt-6">
          <div className="lg:col-span-7">
            <h2
              className="font-display uppercase leading-[0.92] text-paper"
              style={{ fontSize: "clamp(44px, 8vw, 128px)" }}
            >
              {cta.headline.join(" ")}
            </h2>
          </div>

          <div className="lg:col-span-5">
            {cta.body && (
              <p className="body-text max-w-[46ch] text-paper/60">{cta.body}</p>
            )}

            <div className="mt-8 flex flex-col border-t border-line-invert">
              <Link
                href={cta.primary.href}
                className="group flex items-center justify-between border-b border-line-invert py-7 transition-[padding] duration-300 hover:pl-3"
              >
                <span
                  className="font-display text-paper transition-colors group-hover:text-cranberry"
                  style={{ fontSize: "clamp(26px, 3vw, 40px)" }}
                >
                  {cta.primary.label}
                </span>
                <Arrow />
              </Link>

              <Link
                href={cta.secondary.href}
                className="group flex items-center justify-between border-b border-line-invert py-7 transition-[padding] duration-300 hover:pl-3"
              >
                <span>
                  <span
                    className="block font-display text-paper transition-colors group-hover:text-cranberry"
                    style={{ fontSize: "clamp(26px, 3vw, 40px)" }}
                  >
                    {cta.secondary.label}
                  </span>
                  {cta.secondaryNote && (
                    <span className="mt-1.5 block text-[13px] text-paper/45">
                      {cta.secondaryNote}
                    </span>
                  )}
                </span>
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Arrow = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden
    className="shrink-0 text-paper/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cranberry"
  >
    <path
      d="M2.5 11.5 11.5 2.5M11.5 2.5H4.75M11.5 2.5V9.25"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
