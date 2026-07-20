"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { fourWayTest } from "@/content/site";

const EASE = [0.23, 1, 0.32, 1] as const;

/** The Four-Way Test as sequential giant lines; key word gets an animated starlight underline. */
export default function FourWayTest() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const shown = reduced || inView;

  return (
    <section className="bg-mist py-24 max-md:py-16">
      <div className="shell">
        <p className="text-[17px] font-medium lowercase text-ink/40">of the things we think, say or do</p>
        <ol ref={ref} className="mt-10 space-y-8">
          {fourWayTest.map((item, i) => {
            const [before, after] = item.question.split(item.key);
            return (
              <li key={item.key} className="overflow-hidden">
                <motion.div
                  initial={reduced ? false : { y: "110%" }}
                  animate={shown ? { y: "0%" } : undefined}
                  transition={{ duration: 1.2, ease: EASE, delay: i * 0.12 }}
                  className="flex items-baseline gap-6 will-change-transform max-md:gap-3"
                >
                  <span className="text-[17px] font-bold text-ink/30">0{i + 1}</span>
                  <p className="text-[42px] font-extrabold leading-[1.15] text-ink max-md:text-[24px]">
                    {before}
                    <span className="relative whitespace-nowrap">
                      {item.key}
                      <motion.span
                        className="absolute inset-x-0 bottom-1 -z-10 h-[0.32em] bg-starlight"
                        initial={reduced ? false : { scaleX: 0 }}
                        animate={shown ? { scaleX: 1 } : undefined}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.7 + i * 0.12 }}
                        style={{ originX: 0 }}
                      />
                    </span>
                    {after}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
