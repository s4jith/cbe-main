"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";

/**
 * A statement that colours itself in, word by word, as it travels up the screen.
 *
 * Each word owns a slice of the block's scroll progress and fades from a washed
 * tint to the full accent across it. The slices overlap slightly so the leading
 * edge reads as a sweep rather than words snapping on one at a time.
 */
export default function ScrollHighlight({
  text,
  className = "",
  // Literal rgba rather than a token or color-mix(): framer interpolates parsed
  // colour values, and hands anything it cannot parse straight through — which
  // shows up as words snapping between two states instead of fading.
  from = "rgba(181, 101, 79, 0.22)",
  to = "rgba(181, 101, 79, 1)",
}: {
  text: string;
  className?: string;
  /** Colour before the sweep reaches a word. */
  from?: string;
  /** Colour once it has passed. */
  to?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);

  // Starts once the block's top reaches ~85% down the viewport and completes
  // while its end is still comfortably on screen, so the last word lands before
  // the reader has scrolled past it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  const words = text.split(/\s+/).filter(Boolean);

  if (reduced) {
    return (
      <p ref={ref} className={className} style={{ color: to }}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1.6) / words.length]}
          from={from}
          to={to}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  from,
  to,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  from: string;
  to: string;
}) {
  const color = useTransform(progress, range, [from, to]);
  return (
    <m.span style={{ color }} className="mr-[0.28em] inline-block">
      {children}
    </m.span>
  );
}
