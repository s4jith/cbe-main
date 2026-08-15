"use client";

import { m, useReducedMotion } from "framer-motion";

/**
 * A small stack of blocks that assembles itself and then breathes — the club's
 * "built, not given" idea reduced to four rectangles.
 *
 * Deliberately geometric and unlabelled: it sits beside the headline as a mark,
 * not an illustration, so it must never compete with the type. Decorative, and
 * hidden from assistive tech.
 */
const BLOCKS = [
  { w: 56, h: 16, tone: "bg-ink", delay: 0.0, drift: -5 },
  { w: 40, h: 16, tone: "bg-starlight", delay: 0.12, drift: 4 },
  { w: 64, h: 16, tone: "bg-ink/25", delay: 0.24, drift: -3 },
  { w: 30, h: 16, tone: "bg-ink", delay: 0.36, drift: 6 },
] as const;

export default function BuildingBlocks({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className={`flex flex-col items-start gap-2 ${className}`}>
      {BLOCKS.map((block, i) => (
        // The entrance lives on the wrapper and the idle float on the painted
        // block inside it, so the two never compete for the same transform.
        <m.span
          key={i}
          className="block"
          style={{ width: block.w, height: block.h }}
          initial={reduced ? false : { opacity: 0, y: -18, scaleX: 0.4 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.9 + block.delay,
          }}
        >
          <m.span
            className={`block h-full w-full rounded-xs ${block.tone}`}
            animate={reduced ? undefined : { y: [0, block.drift, 0] }}
            transition={{
              duration: 4.5 + i * 0.6,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 1.6 + block.delay,
            }}
          />
        </m.span>
      ))}
    </div>
  );
}
