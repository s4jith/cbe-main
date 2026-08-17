"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

/**
 * The avenues as a stack of rows over one shared photographic stage.
 *
 * Hovering a row brings up that avenue's photograph behind the whole block and
 * opens an accent ticker across the row. The image lives behind *all* the rows
 * rather than inside each one, which is what lets it cross-fade between them
 * instead of appearing and vanishing per row.
 */
export default function ServiceBands({
  bands,
  ticker,
}: {
  bands: { label: string; href: string; image: string }[];
  /** The word repeated inside the ticker — the club's short name. */
  ticker: string;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  if (bands.length === 0) return null;

  const words = Array.from({ length: 14 }, (_, i) => i);

  return (
    // The stage is an inset panel rather than a full-bleed band, so the
    // photography reads as a framed object sitting on the page.
    <section className="bg-space-deep px-5 pb-16 pt-4 max-md:px-3">
      <div
        className="relative mx-auto max-w-[1560px] overflow-hidden rounded-2xl bg-space"
        onMouseLeave={() => setActive(null)}
      >
        {/* --- the stage -------------------------------------------------- */}
        <AnimatePresence>
          {active !== null && !reduced && (
            <m.div
              key={active}
              aria-hidden
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={bands[active].image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
              {/* Without this the white type sits straight on a photograph and
                  loses all of its contrast. */}
              <div className="absolute inset-0 bg-space-deep/62" />
            </m.div>
          )}
        </AnimatePresence>

        <ul className="relative px-[clamp(20px,4vw,64px)] py-[clamp(24px,4vw,56px)]">
          {bands.map((band, i) => (
            <li key={band.label} className="border-b border-line-invert last:border-b-0">
              <Link
                href={band.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="band-row relative block overflow-hidden py-[clamp(18px,2.6vw,40px)]"
              >
                <h3
                  className="band-heading headline uppercase text-paper transition-colors duration-300"
                  style={{ "--h-min": "26px", "--h-max": "68px" } as React.CSSProperties}
                >
                  {band.label}
                </h3>

                <div
                  aria-hidden
                  className="band-ticker pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden bg-cranberry py-2"
                >
                  {/* Two identical tracks: the second fills the gap the first leaves. */}
                  {[0, 1].map((track) => (
                    <div key={track} className="band-track">
                      {words.map((w) => (
                        <span
                          key={w}
                          className="mr-[2.5vw] inline-block text-[clamp(11px,1.25vw,17px)] font-bold uppercase tracking-[0.14em] text-paper"
                        >
                          {ticker}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
