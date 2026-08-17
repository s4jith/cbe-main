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
                className="flex w-full items-center justify-between gap-8 py-7 text-left max-md:py-5"
              >
                <span className="font-sans text-[clamp(16px,1.5vw,21px)] font-bold leading-snug text-ink">
                  {item.question}
                </span>
                {/* A chevron that turns over when the panel opens. */}
                <m.span
                  aria-hidden
                  className="shrink-0 text-ink"
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                    <path
                      d="M1 1l9 9 9-9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </m.span>
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
