"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { HomeIntroData, Picture } from "@/lib/types";

const SEEN_KEY = "rcm:curtain";

/** One continuous timeline, expressed as the moment each phase begins (ms). */
const AT = {
  close: 2900,
  hold: 3750,
  lift: 4750,
  done: 5600,
} as const;

type Phase = "gallery" | "closing" | "holding" | "lifting" | "done";

const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

/**
 * The opening curtain: columns of photographs sliding past each other, which
 * close inward onto the club mark before the whole sheet lifts off the page.
 *
 * Runs once per session and renders as an overlay, so the home page underneath
 * has already painted by the time the curtain leaves — the intro never sits on
 * the critical path.
 */
export default function CurtainIntro({ intro }: { intro: HomeIntroData }) {
  const reduced = useReducedMotion();
  // Server and first client render must agree: assume the curtain plays, then
  // skip straight to "done" in the effect if this session has already seen it.
  const [phase, setPhase] = useState<Phase>("gallery");
  const [armed, setArmed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const columns = useMemo(() => buildColumns(intro.panels), [intro.panels]);

  useEffect(() => {
    if (!intro.enabled || sessionStorage.getItem(SEEN_KEY)) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    setArmed(true);

    // Reduced motion still gets the logo moment, just without the travel.
    const schedule: [Phase, number][] = reduced
      ? [
          ["holding", 60],
          ["lifting", 900],
          ["done", 1300],
        ]
      : [
          ["closing", AT.close],
          ["holding", AT.hold],
          ["lifting", AT.lift],
          ["done", AT.done],
        ];

    timers.current = schedule.map(([next, at]) => setTimeout(() => setPhase(next), at));
    return () => timers.current.forEach(clearTimeout);
  }, [intro.enabled, reduced]);

  /**
   * Nobody should be held in front of the intro. Any click, key or scroll
   * gesture cancels the remaining timeline and lifts the curtain immediately.
   */
  const skip = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase((current) => (current === "lifting" || current === "done" ? current : "lifting"));
    const done = setTimeout(() => setPhase("done"), 700);
    timers.current = [done];
  }, []);

  useEffect(() => {
    if (!armed || phase === "done") return;
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "wheel", "touchstart"];
    events.forEach((e) => window.addEventListener(e, skip, { passive: true, once: true }));
    return () => events.forEach((e) => window.removeEventListener(e, skip));
  }, [armed, phase, skip]);

  // Hold the page still underneath, and keep the curtain out of the tab order.
  useEffect(() => {
    if (phase === "done" || !armed) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [phase, armed]);

  if (phase === "done" || !intro.enabled) return null;

  const closed = phase !== "gallery";
  const lifting = phase === "lifting";

  return (
    <AnimatePresence>
      <m.div
        key="curtain"
        aria-hidden
        onClick={skip}
        className="fixed inset-0 z-[9998] overflow-hidden bg-space-deep"
        initial={false}
        animate={lifting ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.85, ease: EASE_EDITORIAL }}
      >
        {/* --- the sliding photograph columns ------------------------------- */}
        <div className="absolute inset-0 flex">
          {columns.map((column, i) => {
            const fromCenter = i - (columns.length - 1) / 2;
            return (
              <m.div
                key={i}
                className="relative h-full flex-1 overflow-hidden"
                initial={false}
                animate={
                  closed
                    ? {
                        // Columns draw inward toward the middle and dim out,
                        // which is what "reveals" the mark sitting behind them.
                        x: `${fromCenter * -14}%`,
                        scaleX: 0.82,
                        opacity: 0,
                        filter: "blur(6px)",
                      }
                    : { x: "0%", scaleX: 1, opacity: 1, filter: "blur(0px)" }
                }
                transition={{
                  duration: 0.9,
                  ease: EASE_EDITORIAL,
                  delay: closed ? Math.abs(fromCenter) * 0.045 : 0,
                }}
              >
                <ColumnStrip
                  pictures={column.pictures}
                  seconds={column.seconds}
                  up={column.up}
                  paused={closed || Boolean(reduced)}
                  eager={i < 3}
                />
                {/* A wash over the photography so the mark always has contrast. */}
                <div className="pointer-events-none absolute inset-0 bg-space-deep/45" />
              </m.div>
            );
          })}
        </div>

        {/* --- the mark the panels close onto ------------------------------- */}
        <div className="absolute inset-0 grid place-items-center">
          <m.div
            className="relative"
            initial={false}
            animate={
              closed
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, scale: 0.86, filter: "blur(10px)" }
            }
            transition={{ duration: 0.75, ease: EASE_EDITORIAL, delay: closed ? 0.18 : 0 }}
          >
            <m.div
              animate={
                phase === "holding" && !reduced ? { scale: [1, 1.035, 1] } : { scale: 1 }
              }
              transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
            >
              <Image
                src={intro.logo}
                alt=""
                width={132}
                height={132}
                priority
                className="h-[112px] w-auto max-md:h-[84px]"
              />
            </m.div>
          </m.div>
        </div>
      </m.div>
    </AnimatePresence>
  );
}

/**
 * A single column of photographs travelling vertically. The list is rendered
 * twice back-to-back and animated exactly one half-height, so the loop closes on
 * itself with no visible seam.
 */
function ColumnStrip({
  pictures,
  seconds,
  up,
  paused,
  eager,
}: {
  pictures: Picture[];
  seconds: number;
  up: boolean;
  paused: boolean;
  eager: boolean;
}) {
  const doubled = [...pictures, ...pictures];

  return (
    <m.div
      className="absolute inset-x-0 top-0 flex flex-col"
      style={{ willChange: "transform" }}
      initial={{ y: up ? "0%" : "-50%" }}
      animate={paused ? undefined : { y: up ? "-50%" : "0%" }}
      transition={{ duration: seconds, ease: "linear", repeat: Infinity }}
    >
      {doubled.map((picture, i) => (
        <div key={i} className="relative h-[42vh] w-full shrink-0">
          <Image
            src={picture.src}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
            priority={eager && i < 2}
          />
        </div>
      ))}
    </m.div>
  );
}

/**
 * Deal the photographs into columns — four on a phone would be too narrow to
 * read, so the count is fixed at the widest the layout supports and CSS hides
 * the overflow columns on small screens.
 *
 * Each column needs at least three frames or the loop is obvious, so short
 * libraries repeat rather than leaving gaps.
 */
function buildColumns(panels: Picture[]) {
  const COLUMNS = 5;
  const usable = panels.length > 0 ? panels : [];

  return Array.from({ length: COLUMNS }, (_, i) => {
    const pictures: Picture[] = [];
    for (let step = 0; pictures.length < 3; step++) {
      pictures.push(usable[(i + step * COLUMNS + step) % usable.length]);
    }
    return {
      pictures,
      // Staggered so no two columns ever line up — the drift is what sells it.
      seconds: 11 + (i % 3) * 3.5,
      up: i % 2 === 0,
    };
  });
}
