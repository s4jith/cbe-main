"use client";

import { useEffect, useRef, useState } from "react";
import { m, animate, useInView, useReducedMotion } from "framer-motion";
import type { Stat } from "@/lib/types";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * Counts up once, the first time the figure enters view — then stops for good.
 * Reduced-motion visitors get the final value immediately.
 */
function Figure({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className="numeric">
      {display}
      {suffix}
    </span>
  );
}

/**
 * Statistics as a full-bleed editorial band: large figures separated by hairlines,
 * with room to breathe. No tiles, no coloured cards.
 */
export default function StatsEditorial({ stats }: { stats: Stat[] }) {
  const reduced = useReducedMotion();
  if (!stats.length) return null;

  return (
    <ul className="border-t border-line">
      {stats.map((s, i) => (
        <m.li
          key={s.label}
          className="border-b border-line"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.7, ease: EASE, delay: Math.min(i, 3) * 0.06 }}
        >
          <div className="grid gap-y-2 py-7 md:grid-cols-12 md:items-baseline md:gap-x-8 md:gap-y-3 md:py-8">
            <span
              className="headline text-ink md:col-span-3"
              style={{ "--h-min": "40px", "--h-max": "78px" } as React.CSSProperties}
            >
              <Figure value={s.value} suffix={s.suffix} />
            </span>

            <h3 className="text-[14px] font-medium tracking-[-0.01em] text-ink md:col-span-4 md:text-[15px]">
              {s.label}
            </h3>

            <p className="body-text max-w-[54ch] text-[14px] text-ink-soft md:col-span-5 md:text-[16px]">
              {s.body}
            </p>
          </div>
        </m.li>
      ))}
    </ul>
  );
}
