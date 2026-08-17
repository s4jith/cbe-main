"use client";

import { m, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

/**
 * The seam between the opening band and the section under it.
 *
 * The arc is at its fullest while the hero is still filling the screen and
 * straightens as the reader travels down to the section below — so the curve
 * belongs to the hero, and the page flattens out once you have left it.
 */
export default function ScrollCurve({
  /** The colour of the section below, which is what the arc paints. */
  fill = "var(--color-paper)",
  height = 140,
  /** The bow, in viewBox units, before any scrolling has happened. */
  base = 52,
}: {
  fill?: string;
  height?: number;
  base?: number;
}) {
  const reduced = useReducedMotion();

  // Measured against the window rather than a ref: the curve sits at the very
  // bottom of the hero, so the window's own scroll is already the right clock.
  const { scrollY } = useScroll();
  const flatten = useTransform(scrollY, [0, 620], [1, 0], { clamp: true });
  const eased = useSpring(flatten, { stiffness: 120, damping: 28, mass: 0.5 });

  const d = useTransform(eased, (v) => {
    const c = 100 - base * v;
    return `M0,100 Q50,${c.toFixed(2)} 100,100 L100,100 L0,100 Z`;
  });

  if (reduced) {
    return (
      <div aria-hidden className="w-full" style={{ height }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <path d={`M0,100 Q50,${100 - base} 100,100 L100,100 L0,100 Z`} fill={fill} />
        </svg>
      </div>
    );
  }

  return (
    <div aria-hidden className="relative -mb-px w-full" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <m.path d={d} fill={fill} />
      </svg>
    </div>
  );
}
