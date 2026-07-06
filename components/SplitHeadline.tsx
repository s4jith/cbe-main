"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.23, 1, 0.32, 1] as const;

/**
 * Masked line-by-line headline reveal (ref-site signature move).
 * Lines are authored explicitly so wraps stay art-directed.
 * The container is observed (not the lines — they start fully clipped,
 * so observing them directly would never trigger).
 */
export default function SplitHeadline({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -30px 0px" });
  const shown = reduced || inView;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="block will-change-transform"
            initial={reduced ? false : { y: "118%" }}
            animate={shown ? { y: "0%" } : undefined}
            transition={{ duration: 1.5, ease: EASE, delay: delay + i * 0.14 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
