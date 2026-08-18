"use client";

import { m, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

/**
 * The seam between the opening band and the section under it.
 *
 * Flat while the hero fills the screen — so nothing pokes into the opening —
 * and it bows up into the section below as the reader scrolls down. The curve
 * belongs to the transition, and simply is not there until you leave the top.
 */
export default function ScrollCurve({
  /** The colour of the section below, which is what the arc paints. */
  fill = "var(--color-paper)",
  height = 140,
  /** The bow, in viewBox units, at its fullest once scrolled in. */
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
  // 0 at the top (flat, invisible), 1 once scrolled a little way in (full bow).
  const bow = useTransform(scrollY, [40, 520], [0, 1], { clamp: true });
  const eased = useSpring(bow, { stiffness: 120, damping: 28, mass: 0.5 });

  const d = useTransform(eased, (v) => {
    const c = 100 - base * v;
    return `M0,100 Q50,${c.toFixed(2)} 100,100 L100,100 L0,100 Z`;
  });

  if (reduced) {
    // No scroll signal to ride — keep it flat so it never intrudes on the hero.
    return <div aria-hidden className="w-full" style={{ height: 1 }} />;
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
