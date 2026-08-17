"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { BoardYear, Member } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The board: the whole cohort on the left, behind a large "BOARD" and the year,
 * with one member at a time on the right.
 *
 * The word, the photograph and the year deliberately overlap rather than stack.
 * That layering is the whole composition — laid out as separate blocks it reads
 * as a caption above a picture and loses all of its weight.
 */
export default function BoardShowcase({
  members,
  boardYears,
}: {
  members: Member[];
  boardYears: BoardYear[];
}) {
  const reduced = useReducedMotion();

  const years = useMemo(() => {
    const set = new Set<number>();
    for (const b of boardYears) set.add(b.year);
    for (const m of members) if (typeof m.year === "number") set.add(m.year);
    return [...set].sort((a, b) => b - a);
  }, [members, boardYears]);

  const [year, setYear] = useState<number | null>(years[0] ?? null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const cohort = useMemo(
    () => (year === null ? members : members.filter((m) => m.year === year)),
    [members, year],
  );
  const group = useMemo(() => boardYears.find((b) => b.year === year), [boardYears, year]);

  useEffect(() => {
    setIndex(0);
  }, [year]);

  const count = cohort.length;
  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setDirection(delta);
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  if (members.length === 0) return null;
  const active = cohort[index];
  const yearText = year !== null ? String(year) : "";

  return (
    <div>
      <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12 lg:items-center">
        {/* --- the cohort ------------------------------------------------- */}
        <div className="lg:col-span-7">
          <div className="relative">
            {/* The word sits at the back of the stack. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 select-none font-sans font-extrabold uppercase leading-[0.8] tracking-[-0.03em] text-paper"
              style={{ fontSize: "clamp(72px, 13vw, 190px)" }}
            >
              Board
            </span>

            {/* The photograph overlaps it, pushed down so the word's top half
                stays visible above the frame. */}
            <div className="relative pt-[clamp(46px,7vw,104px)]">
              <AnimatePresence mode="popLayout">
                <m.div
                  key={`group-${year}`}
                  className="relative aspect-[5/4] w-[86%] overflow-hidden rounded-md bg-space max-lg:w-full"
                  initial={reduced ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  {group?.photo.src ? (
                    <Image
                      src={group.photo.src}
                      alt={group.photo.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center px-8 text-center">
                      <p className="text-[14px] leading-relaxed text-paper/40">
                        Add a group photograph for {yearText} under Board Years in the admin.
                      </p>
                    </div>
                  )}
                </m.div>
              </AnimatePresence>

              {/* The year sits in front of everything, hanging off the photo's
                  bottom-right corner. */}
              {yearText && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-[26%] justify-end pr-[2%]">
                  <AnimatePresence mode="popLayout">
                    <m.span
                      key={`year-${year}`}
                      className="numeric select-none font-sans font-extrabold leading-[0.78] tracking-[-0.03em]"
                      style={{ fontSize: "clamp(64px, 11vw, 160px)" }}
                      initial={reduced ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <span className="text-paper">{yearText.slice(0, 2)}</span>
                      <span className="text-starlight">{yearText.slice(2)}</span>
                    </m.span>
                  </AnimatePresence>
                </div>
              )}
            </div>

            {group?.caption && (
              <p className="mt-[clamp(44px,6vw,88px)] text-[13px] text-paper/45">{group.caption}</p>
            )}
          </div>
        </div>

        {/* --- one member ------------------------------------------------- */}
        <div
          className="lg:col-span-5"
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-roledescription="carousel"
          aria-label="Board members"
        >
          {/* Counter sits above the card, as a quiet index. */}
          {count > 1 && (
            <p className="numeric mb-6 text-right text-[15px] font-medium text-paper/45" aria-live="polite">
              <span className="text-paper">{index + 1}</span> / {count}
            </p>
          )}

          {active && (
            <div className="flex items-center gap-4 max-sm:gap-2">
              {count > 1 && <ArrowControl label="Previous board member" onClick={() => go(-1)} flip />}

              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait">
                  <m.div
                    key={`${year}-${index}`}
                    initial={reduced ? false : { opacity: 0, x: direction * 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      reduced
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            x: direction * -20,
                            transition: { duration: 0.22, ease: "easeIn" },
                          }
                    }
                    transition={{ duration: 0.5, ease: EASE }}
                    className="text-center"
                  >
                    {/* The portrait sits on a warm panel, which is what stops a
                        cut-out headshot floating on the dark background. */}
                    <div
                      className="relative mx-auto aspect-[4/5] w-full max-w-[310px] overflow-hidden rounded-lg"
                      style={{
                        background:
                          "linear-gradient(150deg, var(--color-starlight), var(--color-cranberry))",
                      }}
                    >
                      {active.image && (
                        <Image
                          src={active.image}
                          alt={active.name}
                          fill
                          sizes="310px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <h3
                      className="mt-6 font-sans font-extrabold leading-none tracking-[-0.02em] text-paper"
                      style={{ fontSize: "clamp(22px, 2.4vw, 34px)" }}
                    >
                      {active.name}
                    </h3>
                    <p className="mt-3 inline-block rounded-md bg-cranberry px-5 py-2 text-[15px] font-bold text-paper">
                      {active.role}
                    </p>
                    {active.bio && (
                      <p className="body-text mx-auto mt-5 max-w-[40ch] text-paper/65">
                        {active.bio}
                      </p>
                    )}
                  </m.div>
                </AnimatePresence>
              </div>

              {count > 1 && <ArrowControl label="Next board member" onClick={() => go(1)} />}
            </div>
          )}
        </div>
      </div>

      {/* --- year tabs ---------------------------------------------------- */}
      {years.length > 1 && (
        <div className="mt-20 flex flex-wrap gap-4 max-lg:mt-14" role="tablist" aria-label="Board year">
          {years.map((y) => {
            const selected = y === year;
            return (
              <button
                key={y}
                role="tab"
                aria-selected={selected}
                onClick={() => setYear(y)}
                className={`relative rounded-md border px-9 py-3 text-[16px] font-bold transition-colors max-sm:px-6 ${
                  selected ? "border-cranberry text-paper" : "border-paper/25 text-paper/70 hover:border-paper/50 hover:text-paper"
                }`}
              >
                {selected && (
                  <m.span
                    layoutId="board-year-pill"
                    className="absolute inset-0 rounded-md bg-cranberry"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
                <span className="relative">{y}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArrowControl({
  label,
  onClick,
  flip = false,
}: {
  label: string;
  onClick: () => void;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper/12 text-paper transition-colors hover:bg-cranberry max-sm:h-8 max-sm:w-8"
    >
      <svg
        width="15"
        height="11"
        viewBox="0 0 17 12"
        fill="none"
        aria-hidden
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      >
        <path
          d="M11 1L16 6L11 11M16 6H1"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
