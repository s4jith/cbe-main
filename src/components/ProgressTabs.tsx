"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useInView } from "framer-motion";

export type Tab = {
  label: string;
  title: string;
  body: string;
  image?: string;
  stat?: string;
};

const CYCLE = 9000;

/** Auto-advancing tabs with clip-path fill wipe; click to select. Pauses off-screen. */
export default function ProgressTabs({ tabs, dark = true }: { tabs: Tab[]; dark?: boolean }) {
  const [active, setActive] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "100px" });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      setActive((a) => (a + 1) % tabs.length);
      setCycleKey((k) => k + 1);
    }, CYCLE);
    return () => clearTimeout(t);
  }, [active, cycleKey, inView, tabs.length]);

  const select = (i: number) => {
    setActive(i);
    setCycleKey((k) => k + 1);
  };

  const textMain = dark ? "text-white" : "text-ink";
  const textDim = dark ? "text-white/60" : "text-ink/60";

  return (
    <div ref={wrapRef} className="flex gap-14 max-lg:flex-col">
      <div className="flex w-[38%] flex-col gap-2 max-lg:w-full">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => select(i)}
            className={`relative overflow-hidden rounded-xl px-6 py-5 text-left transition-opacity ${
              dark ? "bg-white/5" : "bg-ink/5"
            } ${i === active ? "" : "opacity-70 hover:opacity-100"}`}
          >
            {i === active && (
              <m.span
                key={cycleKey}
                className={`absolute inset-0 ${dark ? "bg-white/10" : "bg-ink/10"}`}
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: inView ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
                transition={{ duration: CYCLE / 1000, ease: "linear" }}
              />
            )}
            <span className={`relative text-[20px] font-extrabold ${textMain}`}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="relative min-h-[420px] flex-1">
        <AnimatePresence mode="wait">
          <m.div
            key={active}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          >
            {tabs[active].image && (
              <div className="relative mb-6 h-64 overflow-hidden rounded-2xl">
                <Image src={tabs[active].image!} alt={tabs[active].title} fill sizes="(max-width:1024px) 100vw, 700px" className="object-cover" />
                {tabs[active].stat && (
                  <span className="absolute bottom-4 left-4 rounded-full bg-starlight px-4 py-1.5 text-[14px] font-bold text-starlight-ink">
                    {tabs[active].stat}
                  </span>
                )}
              </div>
            )}
            <h3 className={`text-[28px] font-extrabold ${textMain}`}>{tabs[active].title}</h3>
            <p className={`mt-4 max-w-2xl text-[17px] font-medium leading-relaxed ${textDim}`}>{tabs[active].body}</p>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
