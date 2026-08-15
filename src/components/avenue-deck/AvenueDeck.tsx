"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { Accent, AvenueEntry } from "@/lib/types";
import DustTrail from "./DustTrail";

/** The one curve the whole interaction moves on: slow, then away, then settle. */
const SWEEP = [0.22, 1, 0.36, 1] as const;
const SWEEP_MS = 1150;

const ACCENT: Record<Accent, string> = {
  starlight: "var(--color-starlight)",
  cranberry: "var(--color-cranberry)",
  comet: "var(--color-comet)",
  nebula: "var(--color-nebula)",
};

type Geometry = { travel: number; compact: boolean };

/**
 * Five avenues held as one deck, drawn and turned over a card at a time.
 *
 * The pull and the turn are a single tween — `x`, `rotateY`, `y` and `scale` all
 * ride the same transition, so the card reads as being lifted and flipped in one
 * gesture rather than animated in stages. The `y` and `scale` keyframes are what
 * give it the arc; without them the card slides flat and the whole thing looks
 * like a carousel.
 *
 * Below `lg` there is nowhere to travel to, so the card turns over in place —
 * forcing the desktop sweep onto a phone just pushes the card off-screen.
 */
export default function AvenueDeck({ avenues }: { avenues: AvenueEntry[] }) {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [geometry, setGeometry] = useState<Geometry>({ travel: 0, compact: true });
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // How far right the card can go is a measurement, not a constant — the stage is
  // fluid and a hardcoded distance would overshoot on one breakpoint and barely
  // move on another.
  useEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const card = cardRef.current;
      if (!stage || !card) return;
      const compact = window.innerWidth < 1024;
      const travel = compact
        ? 0
        : Math.max(0, stage.offsetWidth - card.offsetWidth * 1.06 - card.offsetLeft - 8);
      setGeometry({ travel, compact });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (stageRef.current) observer.observe(stageRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => () => {
    if (unlockTimer.current) clearTimeout(unlockTimer.current);
  }, []);

  const lockFor = useCallback((ms: number) => {
    setLocked(true);
    if (unlockTimer.current) clearTimeout(unlockTimer.current);
    unlockTimer.current = setTimeout(() => setLocked(false), ms);
  }, []);

  const select = useCallback(
    (id: string) => {
      if (locked || activeId === id) return;
      setActiveId(id);
      lockFor(reduced ? 120 : SWEEP_MS);
    },
    [locked, activeId, lockFor, reduced],
  );

  const reset = useCallback(() => {
    if (locked) return;
    setActiveId(null);
    lockFor(reduced ? 120 : SWEEP_MS * 0.8);
  }, [locked, lockFor, reduced]);

  // Escape is the way out of any card, wherever focus happens to be.
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, reset]);

  if (avenues.length === 0) return null;

  const activeIndex = avenues.findIndex((a) => a.id === activeId);

  return (
    <div className="relative">
      <div
        ref={stageRef}
        className="relative h-[520px] max-lg:h-[480px] max-sm:h-[430px]"
        style={{ perspective: "1800px" }}
      >
        {avenues.map((avenue, i) => {
          const isActive = avenue.id === activeId;
          // Once a card leaves, everything behind it closes the gap.
          const rank = activeIndex >= 0 && i > activeIndex ? i - 1 : i;
          const accent = ACCENT[avenue.accent] ?? ACCENT.starlight;

          return (
            <Card
              key={avenue.id}
              ref={i === 0 ? cardRef : undefined}
              avenue={avenue}
              accent={accent}
              index={i}
              rank={rank}
              total={avenues.length}
              isActive={isActive}
              anyActive={activeIndex >= 0}
              geometry={geometry}
              reduced={Boolean(reduced)}
              locked={locked}
              onSelect={() => select(avenue.id)}
              onReset={reset}
            />
          );
        })}
      </div>

      {/* Inherits the section's text colour so the deck works on either surface. */}
      <p className="mt-6 text-[13px] font-medium opacity-45 max-lg:mt-4" aria-live="polite">
        {activeIndex >= 0
          ? "Press Escape, or use the link on the card, to return to the deck."
          : "Choose a card to turn it over."}
      </p>
    </div>
  );
}

function Card({
  ref,
  avenue,
  accent,
  index,
  rank,
  total,
  isActive,
  anyActive,
  geometry,
  reduced,
  locked,
  onSelect,
  onReset,
}: {
  ref?: React.Ref<HTMLDivElement>;
  avenue: AvenueEntry;
  accent: string;
  index: number;
  rank: number;
  total: number;
  isActive: boolean;
  anyActive: boolean;
  geometry: Geometry;
  reduced: boolean;
  locked: boolean;
  onSelect: () => void;
  onReset: () => void;
}) {
  const { travel, compact } = geometry;

  // Where this card sits when it is part of the deck: a shallow fan climbing to
  // the right, each card a little smaller and a little further back.
  const stacked = {
    x: rank * 26,
    y: rank * -16,
    rotate: (rank - (total - 1) / 2) * 1.6,
    rotateY: 0,
    scale: 1 - rank * 0.03,
    opacity: 1,
  };

  const active = {
    // Keyframes on y and scale are what make it an arc rather than a slide: the
    // card rises out of the deck, travels, and settles.
    x: travel,
    y: reduced ? 0 : [0, -54, -8],
    rotate: 0,
    rotateY: compact ? 180 : 180,
    scale: reduced ? 1.02 : [1, 1.07, 1.02],
    opacity: 1,
  };

  const target = isActive ? active : stacked;

  return (
    <m.div
      ref={ref}
      className="absolute left-0 top-0 h-[420px] w-[310px] max-lg:h-[380px] max-lg:w-[275px] max-sm:h-[340px] max-sm:w-[238px]"
      style={{
        transformStyle: "preserve-3d",
        zIndex: isActive ? 50 : total - rank,
      }}
      initial={false}
      animate={target}
      transition={
        reduced
          ? { duration: 0.001 }
          : {
              duration: SWEEP_MS / 1000,
              ease: SWEEP,
              // Cards closing the gap move a beat later than the card leaving,
              // so the deck settles behind the gesture instead of with it.
              delay: isActive ? 0 : anyActive ? 0.12 : 0,
            }
      }
    >
      {/* --- bloom + light streak, only while this card is the active one --- */}
      <AnimatePresence>
        {isActive && !reduced && (
          <>
            <m.div
              key="bloom"
              aria-hidden
              className="pointer-events-none absolute -inset-10 rounded-full"
              style={{
                background: `radial-gradient(closest-side, color-mix(in srgb, ${accent} 26%, transparent), transparent)`,
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: SWEEP }}
            />
            <m.div
              key="streak"
              aria-hidden
              className="pointer-events-none absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full blur-[3px]"
              style={{
                right: "58%",
                background: `linear-gradient(to left, ${accent}, transparent)`,
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: [0, Math.max(120, travel * 0.9), 0], opacity: [0, 0.75, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: SWEEP }}
            />
            <DustTrail seed={index} accent={accent} />
          </>
        )}
      </AnimatePresence>

      {/* --- face ---------------------------------------------------------- */}
      <button
        type="button"
        onClick={onSelect}
        disabled={locked || isActive}
        aria-hidden={isActive}
        tabIndex={isActive ? -1 : 0}
        className="absolute inset-0 block overflow-hidden rounded-md text-left disabled:cursor-default"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          boxShadow: isActive
            ? "0 40px 80px -30px rgb(22 21 15 / 0.6)"
            : "0 18px 40px -24px rgb(22 21 15 / 0.45)",
          transition: "box-shadow 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <Image
          src={avenue.image.src}
          alt=""
          fill
          sizes="(max-width: 640px) 240px, (max-width: 1024px) 275px, 310px"
          className="object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-space-deep via-space-deep/25 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 p-6 max-sm:p-5">
          <span className="mb-3 block h-[3px] w-10 rounded-full" style={{ background: accent }} />
          <span className="title-sans block text-[22px] leading-tight text-paper max-sm:text-[19px]">
            {avenue.name}
          </span>
        </span>
        {/* Only the card on top advertises that it can be turned. */}
        {rank === 0 && !anyActive && (
          <span className="absolute right-5 top-5 text-[11px] font-medium uppercase tracking-[0.16em] text-paper/70">
            Turn
          </span>
        )}
      </button>

      {/* --- back ---------------------------------------------------------- */}
      <div
        className="absolute inset-0 overflow-hidden rounded-md bg-paper"
        aria-hidden={!isActive}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          boxShadow: "0 40px 80px -30px rgb(22 21 15 / 0.55)",
        }}
      >
        <div className="flex h-full flex-col p-7 max-sm:p-5">
          <span className="mb-4 block h-[3px] w-12 rounded-full" style={{ background: accent }} />
          <h3 className="headline text-ink" style={{ "--h-min": "26px", "--h-max": "34px" } as React.CSSProperties}>
            {avenue.name}
          </h3>
          <p className="body-text mt-4 flex-1 text-ink-soft">{avenue.description}</p>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href={`/blog?avenue=${avenue.slug}`}
              className="wipe-link self-start text-[14px] font-semibold text-starlight-deep"
              tabIndex={isActive ? 0 : -1}
            >
              Read the stories
            </Link>
            <button
              type="button"
              onClick={onReset}
              tabIndex={isActive ? 0 : -1}
              className="self-start text-[13px] font-medium text-ink/50 underline underline-offset-4 hover:text-ink"
            >
              Back to the deck
            </button>
          </div>
        </div>
      </div>
    </m.div>
  );
}
