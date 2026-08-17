"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";

export type ShowcaseEvent = {
  title: string;
  kicker: string;
  year: string;
  venue: string;
  description: string;
  image: string;
  /** Poster background — one of the deck accents. */
  tone: string;
  toneInk: string;
};

/**
 * Events laid out along a horizontal track that advances as the page is
 * scrolled: the section pins itself for its own height and the row slides
 * sideways underneath.
 *
 * The wrapper's height is what sets how long the pin lasts, so it is derived
 * from the number of events rather than hardcoded — adding a sixth event
 * lengthens the scroll instead of speeding the track up.
 */
export default function EventsScroller({
  events,
  backdrop,
}: {
  events: ShowcaseEvent[];
  /** The hollow words behind the track. */
  backdrop: string[];
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Travel the full track width minus one screen. 82vw per card matches the
  // card width set below.
  const distance = Math.max(0, events.length * 82 - 100);
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${distance}vw`]);

  if (events.length === 0) return null;

  // On a phone the pinned track is more trouble than it is worth — the row
  // becomes an ordinary swipeable strip instead.
  if (reduced) {
    return (
      <section className="bg-space-deep py-20">
        <Header />
        <div className="flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-6">
          {events.map((e, i) => (
            <EventCard key={e.title} event={e} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div ref={ref} style={{ height: `${events.length * 90}vh` }} className="relative bg-space-deep">
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        {/* --- hollow backdrop ------------------------------------------- */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {backdrop.map((line) => (
              <span
                key={line}
                className="block select-none font-sans font-extrabold uppercase leading-[1.05] tracking-[-0.01em]"
                style={{
                  fontSize: "clamp(30px, 5.4vw, 86px)",
                  color: "transparent",
                  WebkitTextStroke: "1.2px rgba(247, 244, 238, 0.14)",
                }}
              >
                {line}
              </span>
            ))}
          </div>
        </div>

        <Header />

        <m.div className="relative flex items-center gap-[6vw] pl-[9vw] will-change-transform" style={{ x }}>
          {events.map((e, i) => (
            <EventCard key={e.title} event={e} index={i} />
          ))}
        </m.div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="relative mb-10 pl-[9vw] max-md:mb-6 max-md:pl-6">
      <span className="inline-block bg-cranberry px-6 py-2.5 text-[clamp(18px,2vw,30px)] font-extrabold uppercase tracking-[0.04em] text-paper shadow-[6px_6px_0_0_var(--color-space)]">
        Events
      </span>
    </div>
  );
}

function EventCard({ event, index }: { event: ShowcaseEvent; index: number }) {
  return (
    <article className="flex w-[82vw] shrink-0 snap-start items-start gap-[3vw] max-lg:w-[88vw] max-lg:flex-col">
      {/* --- the numeral ------------------------------------------------- */}
      <span
        aria-hidden
        className="numeric shrink-0 select-none font-sans font-extrabold leading-none"
        style={{
          fontSize: "clamp(40px, 5vw, 92px)",
          color: "transparent",
          WebkitTextStroke: "1.4px rgba(247, 244, 238, 0.3)",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* --- poster ------------------------------------------------------ */}
      <div
        className="w-[34vw] shrink-0 rounded-md p-5 max-lg:w-full max-lg:max-w-[420px]"
        style={{ background: event.tone, boxShadow: "8px 8px 0 0 rgb(22 21 15 / 0.55)" }}
      >
        <h3
          className="font-sans font-extrabold uppercase leading-none tracking-[-0.01em]"
          style={{ fontSize: "clamp(20px, 2.3vw, 40px)", color: event.toneInk }}
        >
          {event.title}
        </h3>
        <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden">
          <Image
            src={event.image}
            alt=""
            fill
            sizes="34vw"
            className="object-cover"
          />
        </div>
        <p
          className="mt-4 text-[13px] font-bold uppercase leading-tight"
          style={{ color: event.toneInk }}
        >
          {event.kicker}
        </p>
      </div>

      {/* --- facts ------------------------------------------------------- */}
      <div className="flex w-[30vw] shrink-0 flex-col gap-4 max-lg:w-full">
        <div className="rounded-md border border-line-invert bg-space/70 p-5">
          <p className="text-[clamp(15px,1.4vw,22px)] font-semibold text-paper">
            <span aria-hidden className="mr-2 text-cranberry">
              ▦
            </span>
            {event.year}
          </p>
          <p className="mt-2 text-[clamp(15px,1.4vw,22px)] font-semibold uppercase text-paper">
            <span aria-hidden className="mr-2 text-cranberry">
              ◉
            </span>
            {event.venue}
          </p>
        </div>
        <div className="rounded-md border border-line-invert bg-space/70 p-5">
          <p className="body-text text-paper/70">
            <span aria-hidden className="mr-1.5 text-cranberry">
              ›
            </span>
            {event.description}
          </p>
        </div>
      </div>
    </article>
  );
}
