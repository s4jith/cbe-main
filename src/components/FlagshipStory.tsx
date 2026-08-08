"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { FlagshipItem } from "@/lib/types";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * Flagship work as a long-form story rather than a tab strip.
 *
 * The photograph sticks while the chapter list scrolls past it on desktop;
 * selecting a chapter cross-fades the image. On mobile the image simply sits
 * above the list — nothing depends on sticky positioning or hover.
 */
export default function FlagshipStory({ items }: { items: FlagshipItem[] }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  if (!items.length) return null;
  const current = items[Math.min(active, items.length - 1)];

  return (
    <div className="grid grid-cols-12 gap-x-12 gap-y-8">
      {/* --- sticky photograph -------------------------------------------- */}
      <div className="col-span-5 max-lg:col-span-12">
        <div className="sticky top-28 max-lg:static">
          <div className="grain relative aspect-[4/5] overflow-hidden bg-space-deep max-lg:aspect-[16/10]">
            <AnimatePresence mode="wait">
              <m.div
                key={current.title}
                className="absolute inset-0"
                initial={reduced ? false : { opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </m.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex items-baseline justify-between gap-4">
            <span className="eyebrow text-paper/45">{current.tag}</span>
            <span className="text-[13px] text-starlight">{current.stat}</span>
          </div>
        </div>
      </div>

      {/* --- chapters ------------------------------------------------------ */}
      <div className="col-span-7 max-lg:col-span-12">
        <ol ref={listRef} className="border-t border-line-invert">
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <li key={item.title} className="border-b border-line-invert">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={isActive}
                  className="group w-full py-8 text-left max-md:py-6"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="numeric text-[12px] font-medium tracking-[0.14em] text-paper/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`headline transition-colors duration-300 ${
                        isActive ? "text-starlight" : "text-paper/70 group-hover:text-paper"
                      }`}
                      style={{ "--h-min": "24px", "--h-max": "36px" } as React.CSSProperties}
                    >
                      {item.title}
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <m.div
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="body-text ml-[calc(12px+1.25rem)] mt-4 max-w-[62ch] text-paper/55 max-md:ml-0">
                          {item.description}
                        </p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
