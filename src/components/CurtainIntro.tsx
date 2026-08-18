"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { HomeIntroData } from "@/lib/types";

const SEEN_KEY = "rcm:curtain";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Each event photo flashes for this long before the next one. */
const FRAME_MS = 150;
/** How long the logo card holds before the whole sheet lifts away. */
const LOGO_HOLD_MS = 550;
const LIFT_MS = 650;

/**
 * A quick title-card intro, in the spirit of a studio ident: the event
 * photographs riffle past full-bleed in about a second, land on the club mark
 * for a beat, then the whole sheet lifts to reveal the page.
 *
 * Runs once per session over the already-painted page, so it never sits on the
 * critical path, and any tap / key / scroll skips it.
 */
export default function CurtainIntro({ intro }: { intro: HomeIntroData }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"flashing" | "logo" | "lifting" | "done">("flashing");
  const [frame, setFrame] = useState(0);
  const [armed, setArmed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cap the riffle at seven frames so the intro stays around a second even when
  // the CMS holds a long gallery.
  const frames = useMemo(() => intro.panels.slice(0, 7), [intro.panels]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    if (!intro.enabled || frames.length === 0 || sessionStorage.getItem(SEEN_KEY)) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    setArmed(true);

    if (reduced) {
      // No riffle — straight to the mark, hold, lift.
      timers.current = [
        setTimeout(() => setPhase("logo"), 40),
        setTimeout(() => setPhase("lifting"), 700),
        setTimeout(() => setPhase("done"), 700 + LIFT_MS),
      ];
      return;
    }

    const schedule: ReturnType<typeof setTimeout>[] = [];
    frames.forEach((_, i) => {
      schedule.push(setTimeout(() => setFrame(i), i * FRAME_MS));
    });
    const flashEnd = frames.length * FRAME_MS;
    schedule.push(setTimeout(() => setPhase("logo"), flashEnd));
    schedule.push(setTimeout(() => setPhase("lifting"), flashEnd + LOGO_HOLD_MS));
    schedule.push(setTimeout(() => setPhase("done"), flashEnd + LOGO_HOLD_MS + LIFT_MS));
    timers.current = schedule;

    return clearTimers;
  }, [intro.enabled, frames, reduced]);

  // Hold the page still underneath until the sheet has lifted.
  useEffect(() => {
    if (phase === "done" || !armed) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [phase, armed]);

  // Any gesture skips straight to the logo-then-lift tail.
  const skip = useCallback(() => {
    clearTimers();
    setPhase("lifting");
    timers.current = [setTimeout(() => setPhase("done"), LIFT_MS)];
  }, []);

  useEffect(() => {
    if (!armed || phase === "done") return;
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "wheel", "touchstart"];
    events.forEach((e) => window.addEventListener(e, skip, { passive: true, once: true }));
    return () => events.forEach((e) => window.removeEventListener(e, skip));
  }, [armed, phase, skip]);

  if (phase === "done" || !intro.enabled) return null;

  const showLogo = phase === "logo" || phase === "lifting";

  return (
    <AnimatePresence>
      <m.div
        key="intro"
        aria-hidden
        onClick={skip}
        className="fixed inset-0 z-[9998] overflow-hidden bg-space-deep"
        initial={false}
        animate={phase === "lifting" ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: LIFT_MS / 1000, ease: EASE }}
      >
        {/* --- riffling photographs -------------------------------------- */}
        {!reduced &&
          frames.map((pic, i) => (
            <m.div
              key={i}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: !showLogo && i === frame ? 1 : 0 }}
              transition={{ duration: 0.12, ease: "linear" }}
            >
              <Image
                src={pic.src}
                alt=""
                fill
                priority={i < 2}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-space-deep/45" />
            </m.div>
          ))}

        {/* --- the mark -------------------------------------------------- */}
        <div className="absolute inset-0 grid place-items-center">
          <m.div
            initial={false}
            animate={
              showLogo
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, scale: 0.86, filter: "blur(8px)" }
            }
            transition={{ duration: 0.4, ease: EASE }}
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
        </div>
      </m.div>
    </AnimatePresence>
  );
}
