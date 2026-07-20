"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import PhotoCard from "@/components/PhotoCard";
import type { HeroCard } from "@/lib/types";

/** Scroll-jacked horizontal strip of flagship photo cards (pinned, translateX by progress). */
export default function HeroStrip({ items }: { items: HeroCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-52%"]);

  if (reduced) {
    return (
      <div className="shell bleed-right flex gap-6 overflow-x-auto pb-16">
        {items.map((c) => (
          <PhotoCard key={c.title} image={c.image} title={c.title} sub={c.stat} className="h-[440px] w-[312px] shrink-0 max-md:h-[360px] max-md:w-[260px]" />
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="shell bleed-right flex gap-6 will-change-transform">
          {items.map((c, i) => (
            <PhotoCard
              key={c.title}
              image={c.image}
              title={c.title}
              sub={c.stat}
              priority={i < 3}
              className="h-[440px] w-[312px] shrink-0 max-md:h-[360px] max-md:w-[260px]"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
