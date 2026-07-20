"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Avenue, AvenueInfo, Project } from "@/lib/types";

const dotColor: Record<string, string> = {
  starlight: "bg-starlight",
  comet: "bg-comet",
  nebula: "bg-nebula",
  cranberry: "bg-cranberry",
};

/** Filterable project index with FLIP layout animation. */
export default function ProjectsGrid({
  projects,
  avenues,
  initialAvenue,
}: {
  projects: Project[];
  avenues: AvenueInfo[];
  initialAvenue?: string;
}) {
  const initial = avenues.find((a) => a.slug === initialAvenue)?.key ?? "All";
  const [filter, setFilter] = useState<Avenue | "All">(initial);
  const list = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.avenue === filter)),
    [filter, projects],
  );

  const pills: { label: string; value: Avenue | "All"; accent?: string; count: number }[] = [
    { label: "All", value: "All", count: projects.length },
    ...avenues.map((a) => ({
      label: a.key.replace(" Service", "").replace(" Priority", " Priority"),
      value: a.key,
      accent: a.accent,
      count: projects.filter((p) => p.avenue === a.key).length,
    })),
  ];

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 bg-white/85 px-4 py-4 backdrop-blur-md">
        <div className="flex flex-wrap gap-2">
          {pills.map((pill) => (
            <button
              key={pill.label}
              onClick={() => setFilter(pill.value)}
              className={`relative flex h-11 items-center gap-2.5 rounded-full px-5 text-[15px] font-bold transition-colors ${
                filter === pill.value ? "text-white" : "bg-ink/5 text-ink hover:bg-ink/10"
              }`}
            >
              {filter === pill.value && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              {pill.accent && <span className={`relative h-2 w-2 rounded-full ${dotColor[pill.accent]}`} />}
              <span className="relative">{pill.label}</span>
              <span className="relative text-[13px] opacity-50">{pill.count}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.ul layout className="mt-10 grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li
              layout
              key={`${p.avenue}-${p.title}`}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 390px"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/45" />
                <span className="absolute right-4 top-3 text-[64px] font-extrabold leading-none text-white/15">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full ${dotColor[avenues.find((a) => a.key === p.avenue)!.accent]}`} />
                <span className="text-[14px] font-semibold text-ink/50">{p.avenue}</span>
              </div>
              <h3 className="mt-1.5 text-[22px] font-extrabold text-ink">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-[16px] font-medium leading-relaxed text-ink/60">{p.description}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
