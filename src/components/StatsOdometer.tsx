"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useInView, useReducedMotion, animate } from "framer-motion";
import type { Stat } from "@/lib/types";
import SplitHeadline from "@/components/SplitHeadline";
import { ArrowButton } from "@/components/Buttons";

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => (el.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, value, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

const tiles = ["bg-comet text-comet-ink", "bg-nebula text-nebula-ink", "bg-starlight text-starlight-ink", "bg-cranberry text-cranberry-ink", "bg-comet text-comet-ink"];

/** Pinned odometer: numerals roll through a masked band, text panel swaps in sync. Mobile → tile grid with CountUp. */
export default function StatsOdometer({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const tapeY = useTransform(scrollYProgress, [0.05, 0.95], ["0%", `-${(stats.length - 1) * (100 / stats.length)}%`]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(stats.length - 1, Math.max(0, Math.round(v * (stats.length - 1) + 0.0001)));
    setIndex(i);
  });

  return (
    <section className="bg-mist">
      <div className="shell py-18">
        <SplitHeadline
          lines={["Numbers that", "carry weight."]}
          className="max-w-xl text-[42px] font-extrabold leading-[1.1] text-ink max-md:text-[32px]"
        />
      </div>

      {/* mobile: tile grid */}
      <div className="shell grid grid-cols-2 gap-4 pb-20 lg:hidden">
        {stats.map((s, i) => (
          <div key={s.label} className={`flex flex-col rounded-2xl p-5 ${tiles[i]} ${i === stats.length - 1 ? "col-span-2" : ""}`}>
            <span className="text-[64px] font-extrabold leading-none">
              <CountUp value={s.value} suffix={s.suffix} />
            </span>
            <span className="mt-3 text-[15px] font-bold uppercase tracking-wide opacity-80">{s.label}</span>
          </div>
        ))}
      </div>

      {/* desktop: pinned scrollytelling */}
      {!reduced && (
        <div ref={ref} className="relative hidden lg:block" style={{ height: `${100 + stats.length * 34}vh` }}>
          <div className="sticky top-0 flex h-screen items-center">
            <div className="shell flex w-full items-stretch gap-10">
              <div className="relative aspect-square w-[30%] shrink-0 overflow-hidden rounded-2xl bg-comet">
                <motion.div style={{ y: tapeY }} className="absolute inset-x-0 top-0 will-change-transform" >
                  {stats.map((s) => (
                    <div key={s.label} className="flex aspect-square w-full items-center justify-center">
                      <span className="text-[116px] font-extrabold leading-none text-comet-ink">
                        {s.value}
                        {s.suffix}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
              <div className="relative flex-1 overflow-hidden rounded-2xl bg-white p-10">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="absolute inset-10 flex flex-col justify-between"
                    initial={false}
                    animate={{ y: i === index ? 0 : i < index ? -46 : 46, opacity: i === index ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div>
                      <h3 className="text-[42px] font-extrabold leading-[1.1] text-ink">{s.label}</h3>
                      <p className="mt-5 max-w-lg text-[17px] font-medium leading-relaxed text-ink/60">{s.body}</p>
                    </div>
                    <ArrowButton href="/projects" variant="dark" className="self-start">See the work</ArrowButton>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
