"use client";

import { m, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The club's name closing the page: the city stretched across the full width,
 * with the short name set solid on top of it.
 *
 * Every letter of both words drops into place as the footer comes into view,
 * one after the next — the type sets itself rather than simply appearing. Each
 * letter falls from above with a slight lean that straightens as it lands, so
 * the line reads as printing rather than sliding.
 */
function Letters({
  word,
  className,
  style,
  delayBase,
  step,
  reduced,
}: {
  word: string;
  className: string;
  style: React.CSSProperties;
  delayBase: number;
  step: number;
  reduced: boolean;
}) {
  return (
    <span className={className} style={style}>
      {word.split("").map((ch, i) => (
        <m.span
          key={i}
          className="inline-block"
          initial={reduced ? false : { y: "-70%", opacity: 0, rotate: -8 }}
          whileInView={{ y: "0%", opacity: 1, rotate: 0 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{
            duration: 0.62,
            ease: EASE,
            delay: delayBase + i * step,
          }}
        >
          {ch}
        </m.span>
      ))}
    </span>
  );
}

export default function FooterWordmark({ wordmark }: { wordmark: string }) {
  const reduced = Boolean(useReducedMotion());
  const front = wordmark.toUpperCase();

  return (
    <div aria-hidden className="select-none">
      {/* Stacked rather than overlaid. Sitting one word on top of the other put
          two sets of very heavy letterforms in the same space and neither could
          be read; as a lockup the city carries the width and the short name
          sits under it, and both stay legible. */}
      <Letters
        word="COIMBATORE"
        className="flex justify-between font-sans font-black uppercase leading-[0.82] text-paper/35"
        style={{ fontSize: "clamp(38px, 12.6vw, 190px)", letterSpacing: "-0.015em" }}
        delayBase={0}
        step={0.055}
        reduced={reduced}
      />

      <Letters
        word={front}
        className="mt-3 flex justify-center font-sans font-black leading-[0.82] text-paper max-md:mt-2"
        style={{ fontSize: "clamp(30px, 7.6vw, 112px)", letterSpacing: "0.14em" }}
        delayBase={0.34}
        step={0.09}
        reduced={reduced}
      />
    </div>
  );
}
