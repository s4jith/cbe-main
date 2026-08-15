"use client";

import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { FaqItem } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The questions we are asked most often.
 *
 * One panel open at a time: with six short answers, letting them all open at
 * once just turns the section into an unbroken wall of text.
 */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) return null;

  return (
    <div className="border-t border-line">
      {items.map((item) => {
        const open = item.id === openId;
        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                aria-controls={`faq-panel-${item.id}`}
                className="flex w-full items-start justify-between gap-8 py-7 text-left max-md:py-6"
              >
                <span className="title-sans text-[19px] leading-snug text-ink max-md:text-[17px]">
                  {item.question}
                </span>
                {/* A plus that becomes a minus — cheaper than swapping icons. */}
                <span className="relative mt-1.5 h-4 w-4 shrink-0" aria-hidden>
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-ink" />
                  <m.span
                    className="absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-ink"
                    animate={{ scaleY: open ? 0 : 1 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {open && (
                <m.div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  className="overflow-hidden"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.5, ease: EASE },
                    opacity: { duration: 0.35, ease: EASE },
                  }}
                >
                  <p className="body-text max-w-[68ch] pb-8 pr-12 text-ink-soft max-md:pr-0">
                    {item.answer}
                  </p>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
