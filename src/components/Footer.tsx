import Link from "next/link";
import type { FooterData } from "@/lib/types";

/**
 * Spacious editorial footer. The previous version's cursor-tracked giant wordmark
 * was doing more work than the ending needs — this one just lays the club's
 * identity, routes and contact details out cleanly and gets out of the way.
 *
 * No client JS: it is now a plain server component.
 */
export default function Footer({ data }: { data: FooterData }) {
  return (
    <footer className="bg-space-deep text-paper">
      <div className="shell py-20 max-md:py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-x-10">
          <div className="col-span-2 md:col-span-4">
            <div className="headline text-paper" style={{ "--h-min": "26px", "--h-max": "30px" } as React.CSSProperties}>
              {data.brandText}
              <span className="text-starlight">{data.brandSymbol}</span>
            </div>
            <p className="mt-4 max-w-[34ch] text-[13px] leading-relaxed text-paper/45">
              {data.brandLine}
            </p>
          </div>

          {data.columns.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="col-span-1 md:col-span-2"
            >
              <h2 className="eyebrow text-paper/35">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={`${l.label}-${l.href}`}>
                    <Link
                      href={l.href}
                      className="wipe-link text-[14px] text-paper/75 transition-colors hover:text-paper"
                      {...(l.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-line-invert pt-8 max-md:mt-14">
          <p className="text-[12px] text-paper/35">{data.copyright}</p>
          <p className="text-[12px] text-paper/35">{data.note}</p>
        </div>
      </div>
    </footer>
  );
}
