"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import PhotoCard from "@/components/PhotoCard";
import type { Member } from "@/lib/types";

/** Scroll-jacked horizontal slider of member portrait cards. */
export default function TeamSlider({ members }: { members: Member[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // See HeroStrip: the reduced-motion branch never attaches this ref.
  const { scrollYProgress } = useScroll({
    target: reduced ? undefined : ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-58%"]);

  const cards = members.map((m) => (
    <PhotoCard key={m.name} image={m.image} title={m.name} sub={m.role} className="h-[380px] w-[270px] shrink-0" sizes="270px" />
  ));

  if (reduced) {
    return <div className="shell bleed-right flex gap-6 overflow-x-auto pb-8">{cards}</div>;
  }

  return (
    <div ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <m.div style={{ x }} className="shell bleed-right flex gap-6 will-change-transform">
          {cards}
        </m.div>
      </div>
    </div>
  );
}
