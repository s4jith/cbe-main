"use client";

import { m, useReducedMotion } from "framer-motion";
import type { FourWayTestData } from "@/lib/types";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * The Four-Way Test set as a quiet poster. This is the still point of the page —
 * each line simply rises into place, with the key word carried on a hairline
 * rather than a highlighter block.
 */
export default function FourWayTestClient({ data }: { data: FourWayTestData }) {
  const reduced = useReducedMotion();

  return (
    <ol className="mt-14 max-md:mt-10">
      {data.items.map((item, i) => {
        // The keyword is underlined in place; if it is not present in the question,
        // the question still renders in full.
        const at = item.keyword ? item.question.indexOf(item.keyword) : -1;
        const before = at >= 0 ? item.question.slice(0, at) : item.question;
        const keyword = at >= 0 ? item.keyword : "";
        const after = at >= 0 ? item.question.slice(at + item.keyword.length) : "";

        return (
          <m.li
            key={`${item.question}-${i}`}
            className="grid gap-y-2 border-b border-line py-7 first:border-t md:grid-cols-12 md:items-baseline md:gap-x-8 md:py-9"
            initial={reduced ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <span className="numeric text-[12px] font-medium tracking-[0.14em] text-ink/35 md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p
              className="headline text-ink md:col-span-11"
              style={{ "--h-min": "22px", "--h-max": "40px" } as React.CSSProperties}
            >
              {before}
              {keyword && (
                <span className="relative whitespace-nowrap">
                  <span className="italic text-starlight-deep">{keyword}</span>
                  <m.span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-px bg-starlight"
                    style={{ originX: 0 }}
                    initial={reduced ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
                  />
                </span>
              )}
              {after}
            </p>
          </m.li>
        );
      })}
    </ol>
  );
}
