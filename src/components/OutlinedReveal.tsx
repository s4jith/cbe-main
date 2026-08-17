"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * A column of hollow words drifting upward, with the club's line set solid
 * across the middle of them and one round photograph sitting in the gap.
 *
 * The outlined stack is scroll-linked rather than looping: it travels only while
 * the section is on screen, so the movement belongs to the reader's scroll
 * instead of running on its own forever behind the type.
 */
export default function OutlinedReveal({
  word,
  lead,
  trail,
  image,
}: {
  /** The hollow word repeated down the backdrop. */
  word: string;
  /** Solid text before the photograph. */
  lead: string;
  /** Solid text after it. */
  trail: string;
  image: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // The stack drifts up roughly one word-height across the whole pass.
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-42%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.82, 1, 0.9]);

  const rows = Array.from({ length: 6 }, (_, i) => i);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[86vh] items-center overflow-hidden bg-space-deep py-24 max-md:min-h-[62vh] max-md:py-16"
    >
      {/* --- hollow stack -------------------------------------------------- */}
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center"
        style={reduced ? undefined : { y }}
      >
        {rows.map((r) => (
          <span
            key={r}
            className="block select-none font-sans font-extrabold leading-[0.92] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(64px, 13vw, 210px)",
              color: "transparent",
              WebkitTextStroke: "1.2px rgba(247, 244, 238, 0.16)",
            }}
          >
            {word}
          </span>
        ))}
      </m.div>

      {/* --- the line ------------------------------------------------------ */}
      <div className="shell relative">
        <p
          className="flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-4 text-center font-sans font-extrabold leading-none tracking-[-0.02em] text-paper"
          style={{ fontSize: "clamp(34px, 7vw, 104px)" }}
        >
          <span>{lead}</span>
          <m.span
            className="relative inline-block shrink-0 overflow-hidden rounded-full"
            style={{
              width: "clamp(64px, 12vw, 176px)",
              height: "clamp(64px, 12vw, 176px)",
              scale: reduced ? 1 : imageScale,
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 768px) 96px, 176px"
              className="object-cover"
            />
          </m.span>
          <span>{trail}</span>
        </p>
      </div>
    </section>
  );
}
