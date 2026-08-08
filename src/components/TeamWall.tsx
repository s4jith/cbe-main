"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import type { Member } from "@/lib/types";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// A repeating rhythm of portrait shapes. Varying the crop is what stops a wall of
// faces reading as a card grid — it is visual cadence, not a ranking.
const SHAPES = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[3/4]", "aspect-[1/1]"] as const;

/**
 * Portrait-driven team wall. Everyone reads as an equal; only the natural order of
 * the collection (its `order` field) decides sequence.
 */
export default function TeamWall({ members }: { members: Member[] }) {
  const reduced = useReducedMotion();
  if (!members.length) return null;

  return (
    <ul className="grid grid-cols-4 gap-x-6 gap-y-12 max-lg:grid-cols-3 max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-8">
      {members.map((m1, i) => (
        <m.li
          key={`${m1.name}-${i}`}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.65, ease: EASE, delay: Math.min(i % 4, 3) * 0.05 }}
          className="group"
        >
          <div className={`grain relative overflow-hidden bg-mist ${SHAPES[i % SHAPES.length]}`}>
            <Image
              src={m1.image}
              alt={m1.name}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]"
            />
          </div>
          <h3 className="mt-4 text-[15px] font-medium tracking-[-0.01em] text-ink max-md:mt-3 max-md:text-[14px]">
            {m1.name}
          </h3>
          <p className="mt-0.5 text-[13px] text-ink-soft">{m1.role}</p>
        </m.li>
      ))}
    </ul>
  );
}
