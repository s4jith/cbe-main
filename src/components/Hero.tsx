"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { PillButton, ArrowButton } from "@/components/Buttons";
import PerspectiveGrid from "@/components/PerspectiveGrid";
import HeroOrbit from "@/components/HeroOrbit";
import ScrollCurve from "@/components/ScrollCurve";
import BuildingBlocks from "@/components/BuildingBlocks";
import type { HeroCard } from "@/lib/types";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * The cinematic opening: an editorial type column against one immersive project
 * photograph. Everything arrives in sequence — image, then eyebrow, headline,
 * body, actions — so the eye is led rather than hit with the whole page at once.
 */
export default function Hero({
  eyebrow,
  lines,
  body,
  feature,
  primary,
  secondary,
  backdrop = false,
}: {
  eyebrow: string;
  /** Two lines: the statement, then the emphasis (set in display italic). */
  lines: string[];
  body: string;
  /** The single hero photograph, with its project label. */
  feature?: HeroCard;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  /** Ruled grid and the block mark — the home page opening only. */
  backdrop?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: reduced ? undefined : ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  // The stat arrives as "60+ para-athletes, 14 states" — split so each fact reads
  // as its own line in the floating label.
  const facts = feature?.stat
    ? feature.stat.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, ease: EASE, delay },
  });

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${
        // Full viewport, so nothing of the section below shows until the reader
        // actually scrolls. No bottom padding either: the curve is the last
        // element and padding under it paints as a dark bar below the arc.
        backdrop
          ? "flex min-h-dvh flex-col justify-center bg-space-deep pt-28 text-paper"
          : "pt-32 max-lg:pt-28"
      }`}
    >
      {backdrop && (
        <>
          <PerspectiveGrid />
          {/* The wheel sits off to the right, behind the photograph's column,
              so it reads as depth rather than as an illustration competing
              with the headline. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[14%] top-1/2 h-[680px] w-[680px] -translate-y-1/2 max-xl:h-[500px] max-xl:w-[500px] max-lg:hidden"
          >
            <HeroOrbit />
          </div>
        </>
      )}
      <div className="shell relative">
        {/* Mobile-first: a plain stack. The 12-column track only exists from lg up,
            where there is room for its gutters. */}
        <div className="grid gap-y-10 lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:gap-y-12">
          {/* --- type column ------------------------------------------------ */}
          <div className="lg:col-span-7 xl:col-span-6">
            {backdrop === false && <BuildingBlocks className="mb-8 max-lg:mb-6" />}
            <m.p {...rise(0.35)} className={`eyebrow ${backdrop ? "text-paper/45" : "text-ink-soft"}`}>
              {eyebrow}
            </m.p>

            <h1 className="mt-5 lg:mt-6">
              {lines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  <m.span
                    // The dark opening is set in heavy uppercase sans rather than
                    // the editorial serif the rest of the site uses — it has to
                    // hold its own against the grid and the wheel behind it.
                    className={
                      backdrop
                        ? "block font-sans font-extrabold uppercase leading-[0.98] tracking-[-0.02em] will-change-transform"
                        : "headline block will-change-transform"
                    }
                    style={
                      backdrop
                        ? { fontSize: "clamp(34px, 5.2vw, 74px)" }
                        : ({
                            "--h-min": "38px",
                            "--h-max": "78px",
                            "--h-fluid": "calc(23.90px + 3.756vw)",
                          } as React.CSSProperties)
                    }
                    initial={reduced ? false : { y: "115%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1.05, ease: EASE, delay: 0.48 + i * 0.1 }}
                  >
                    {backdrop ? (
                      <span className={i === 0 ? "text-paper" : "text-starlight"}>{line}</span>
                    ) : i === 0 ? (
                      line
                    ) : (
                      <em className="italic text-starlight-deep">{line}</em>
                    )}
                  </m.span>
                </span>
              ))}
            </h1>

            <m.p
              {...rise(0.78)}
              className={`lede mt-6 max-w-[46ch] lg:mt-7 ${
                backdrop ? "text-paper/60" : "text-ink-soft"
              }`}
            >
              {body}
            </m.p>

            <m.div {...rise(0.9)} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-9">
              <PillButton href={primary.href}>{primary.label}</PillButton>
              <ArrowButton href={secondary.href} variant={backdrop ? "light" : "dark"}>
                {secondary.label}
              </ArrowButton>
            </m.div>
          </div>

          {/* --- photograph -------------------------------------------------- */}
          {/* The dark opening gives the right-hand column to the wheel; a
              photograph there would sit on top of it and both would lose. */}
          {feature && !backdrop && (
            <div className="lg:col-span-5 xl:col-span-6">
              <m.figure
                className="relative"
                initial={reduced ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.3, ease: EASE }}
              >
                <div className="grain relative aspect-[4/3] overflow-hidden bg-mist lg:aspect-[5/4]">
                  <m.div style={reduced ? undefined : { y: imageY }} className="absolute -inset-y-[6%] inset-x-0">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 46vw"
                      className="object-cover"
                    />
                  </m.div>
                </div>

                {facts.length > 0 && (
                  <m.figcaption
                    className="absolute bottom-5 left-5 right-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-space/70 px-4 py-3 backdrop-blur-sm"
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 1.05 }}
                  >
                    <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-starlight">
                      {feature.title}
                    </span>
                    {facts.map((f) => (
                      <span key={f} className="text-[12px] text-paper/70">
                        {f}
                      </span>
                    ))}
                  </m.figcaption>
                )}
              </m.figure>
            </div>
          )}
        </div>
      </div>

      {/* The seam into the light section below. Inside the hero so it always
          paints over the dark, whatever section follows. */}
      {backdrop && (
        <div className="absolute inset-x-0 bottom-0">
          <ScrollCurve fill="var(--color-paper)" height={150} />
        </div>
      )}
    </section>
  );
}
