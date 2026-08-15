"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { BoardYear, Member } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The board: the whole cohort on the left behind a large "BOARD" and the year,
 * one member at a time on the right.
 *
 * Both halves are driven by the same year, so switching a tab swaps the group
 * photograph and the cohort together. Years come from the Board Years
 * collection, falling back to whatever years the members themselves carry — so
 * the tabs still work before anybody has uploaded a group photo.
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

  // A shorter board would otherwise leave the index pointing past its end.
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
  // "2026" reads as "20" + "26", the tail picked out in gold.
  const yearText = year !== null ? String(year) : "";

  return (
    <div>
      <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12 lg:items-center">
        {/* --- the cohort ------------------------------------------------- */}
        <div className="lg:col-span-6">
          <div className="relative">
            {/* The word sits behind the photograph, cropped by it — the same
                trick the reference uses to tie the two together. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-2 left-0 select-none font-display leading-none text-paper/12"
              style={{ fontSize: "clamp(64px, 11vw, 148px)" }}
            >
              BOARD
            </span>

            <div className="relative pt-10 max-lg:pt-6">
              <AnimatePresence mode="popLayout">
                <m.div
                  key={`group-${year}`}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-space-deep"
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
                      sizes="(max-width: 1024px) 100vw, 46vw"
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

              {/* The year, overlapping the foot of the photograph. */}
              {yearText && (
                <div className="pointer-events-none absolute inset-x-0 -bottom-6 flex justify-end pr-4 max-lg:-bottom-4">
                  <AnimatePresence mode="popLayout">
                    <m.span
                      key={`year-${year}`}
                      className="numeric select-none font-display leading-none tracking-tight"
                      style={{ fontSize: "clamp(56px, 9vw, 124px)" }}
                      initial={reduced ? false : { opacity: 0, y: 18 }}
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
              <p className="mt-10 text-[13px] text-paper/45 max-lg:mt-8">{group.caption}</p>
            )}
          </div>
        </div>

        {/* --- one member ------------------------------------------------- */}
        <div
          className="lg:col-span-6"
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-roledescription="carousel"
          aria-label="Board members"
        >
          {active && (
            <div className="flex items-center gap-5 max-sm:gap-3">
              {count > 1 && (
                <ArrowControl label="Previous board member" onClick={() => go(-1)} flip />
              )}

              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait">
                  <m.div
                    key={`${year}-${index}`}
                    initial={reduced ? false : { opacity: 0, x: direction * 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      reduced
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            x: direction * -24,
                            transition: { duration: 0.22, ease: "easeIn" },
                          }
                    }
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <div className="relative mx-auto aspect-[4/5] w-full max-w-[330px] overflow-hidden rounded-lg bg-space-deep">
                      {active.image && (
                        <Image
                          src={active.image}
                          alt={active.name}
                          fill
                          sizes="(max-width: 640px) 70vw, 330px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="mt-6 text-center">
                      <h3
                        className="headline text-paper"
                        style={{ "--h-min": "26px", "--h-max": "36px" } as React.CSSProperties}
                      >
                        {active.name}
                      </h3>
                      <p className="mt-3 inline-block rounded-full bg-starlight px-4 py-1.5 text-[13px] font-bold text-starlight-ink">
                        {active.role}
                      </p>
                      {active.bio && (
                        <p className="body-text mx-auto mt-5 max-w-[42ch] text-paper/65">
                          {active.bio}
                        </p>
                      )}
                    </div>
                  </m.div>
                </AnimatePresence>
              </div>

              {count > 1 && <ArrowControl label="Next board member" onClick={() => go(1)} />}
            </div>
          )}

          {count > 1 && (
            <p
              className="numeric mt-8 text-center text-[14px] font-medium text-paper/45"
              aria-live="polite"
            >
              <span className="text-paper">{String(index + 1).padStart(2, "0")}</span>
              {" / "}
              {String(count).padStart(2, "0")}
            </p>
          )}
        </div>
      </div>

      {/* --- year tabs ---------------------------------------------------- */}
      {years.length > 1 && (
        <div
          className="mt-16 flex flex-wrap gap-3 max-lg:mt-12"
          role="tablist"
          aria-label="Board year"
        >
          {years.map((y) => {
            const selected = y === year;
            return (
              <button
                key={y}
                role="tab"
                aria-selected={selected}
                onClick={() => setYear(y)}
                className={`relative rounded-md border px-7 py-3 text-[15px] font-bold transition-colors max-sm:px-5 ${
                  selected
                    ? "border-starlight text-starlight-ink"
                    : "border-paper/25 text-paper/70 hover:border-paper/50 hover:text-paper"
                }`}
              >
                {selected && (
                  <m.span
                    layoutId="board-year-pill"
                    className="absolute inset-0 rounded-md bg-starlight"
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
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-paper/25 text-paper transition-colors hover:border-starlight hover:text-starlight max-sm:h-9 max-sm:w-9"
    >
      <svg
        width="16"
        height="12"
        viewBox="0 0 17 12"
        fill="none"
        aria-hidden
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      >
        <path
          d="M11 1L16 6L11 11M16 6H1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
