import Link from "next/link";
import Headline from "@/components/Headline";
import { getShared } from "@/lib/content";

/**
 * The closing statement. Two deliberately unequal actions: joining is the loud
 * one, but the blood-donor route is given its own weight and a line of context —
 * it is a genuinely useful thing to do without joining anything.
 */
export default function CTABanner() {
  const { cta } = getShared();

  return (
    <section className="section-y bg-space text-paper">
      <div className="shell">
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <Headline
              data={cta.headline}
              sizes={[64, 52, 34]}
              className="max-w-[16ch] text-paper"
            />
          </div>

          <div className="flex flex-col justify-end lg:col-span-5">
            {cta.body && (
              <p className="body-text max-w-[46ch] text-paper/60">{cta.body}</p>
            )}

            <div className="mt-8 flex flex-col gap-px border-t border-line-invert lg:mt-10">
              <Link
                href={cta.primary.href}
                className="group flex items-center justify-between border-b border-line-invert py-6 transition-[padding] duration-300 hover:pl-2"
              >
                <span className="headline text-paper" style={{ "--h-min": "22px", "--h-max": "28px" } as React.CSSProperties}>
                  {cta.primary.label}
                </span>
                <Arrow />
              </Link>

              <Link
                href={cta.secondary.href}
                className="group flex items-center justify-between border-b border-line-invert py-6 transition-[padding] duration-300 hover:pl-2"
              >
                <span>
                  <span className="headline block text-paper" style={{ "--h-min": "22px", "--h-max": "28px" } as React.CSSProperties}>
                    {cta.secondary.label}
                  </span>
                  <span className="mt-1 block text-[13px] text-paper/45">
                    No membership needed — register once, help when it matters.
                  </span>
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
    width="16"
    height="16"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden
    className="shrink-0 text-paper/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-starlight"
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
