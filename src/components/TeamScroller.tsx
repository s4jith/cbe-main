"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Member } from "@/lib/types";

// One consistent portrait ratio, deliberately — varied shapes read as visual
// rhythm in the static team wall, but jump distractingly in a row that is
// already moving on its own.
const SHAPE = "aspect-[3/4]";

// Cards visible at once per breakpoint — kept in one place because both the pin
// height and the horizontal travel distance are computed from it.
const PER_VIEW = { mobile: 1.15, tablet: 2.4, desktop: 4 } as const;

/**
 * Horizontal, scroll-driven team filmstrip.
 *
 * Four portraits fill the viewport on arrival; continuing to scroll down (not
 * sideways) pins the section and advances the row until the last member clears
 * the right edge, then releases the page. This is the effect the club asked
 * for by name — "scroll down, it shows the next automatically."
 *
 * Below `sm`, and for anyone with reduced motion set, hijacking a vertical
 * gesture into horizontal movement is exactly the kind of interaction that
 * breaks on touch — both get a plain swipeable row instead, no pin at all.
 */
export default function TeamScroller({ members }: { members: Member[] }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [jack, setJack] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setJack(!reduced && mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);

  const count = members.length;
  // How far the row travels, as a percentage of its own width — derived once
  // from the desktop card count so the number of pinned "screens" matches what
  // desktop visitors actually see. (1 - perView/count) is exact; the
  // difference at other breakpoints only changes how much of the last card
  // peeks in mid-scroll, not whether the effect completes correctly.
  const xEnd = `-${Math.max(0, (1 - PER_VIEW.desktop / count) * 100).toFixed(2)}%`;
  const pinVh = 100 + Math.max(0, count / PER_VIEW.desktop - 1) * 70;

  const { scrollYProgress } = useScroll({
    target: jack ? ref : undefined,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", xEnd]);

  const cards = members.map((m1, i) => (
    <li
      key={`${m1.name}-${i}`}
      className="shrink-0 basis-[86%] snap-start sm:basis-[42%] lg:basis-1/4"
    >
      <div className={`grain relative overflow-hidden bg-mist ${SHAPE}`}>
        <Image
          src={m1.image}
          alt={m1.name}
          fill
          loading={i < 4 ? "eager" : "lazy"}
          sizes="(max-width: 640px) 86vw, (max-width: 1024px) 42vw, 25vw"
          className="object-cover"
        />
      </div>
      <h3 className="mt-4 text-[15px] font-medium tracking-[-0.01em] text-ink">{m1.name}</h3>
      <p className="mt-0.5 text-[13px] text-ink-soft">{m1.role}</p>
    </li>
  ));

  // `bleed-right`, not `.shell`: this is called from inside a page's existing
  // `.shell`, so it only needs to break the *right* edge out to the viewport —
  // re-adding `.shell` here would double the left inset.
  if (!jack) {
    return (
      <ul className="bleed-right flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
        {cards}
      </ul>
    );
  }

  return (
    <div ref={ref} className="relative" style={{ height: `${pinVh}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <m.ul style={{ x }} className="bleed-right flex gap-5 will-change-transform">
          {cards}
        </m.ul>
      </div>
    </div>
  );
}
