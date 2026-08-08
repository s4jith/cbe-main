"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, m, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import type { AvenueInfo } from "@/lib/types";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * The five avenues as a vertical editorial index rather than five cards.
 *
 * This section also carries the site's one signature interaction: on a fine
 * pointer, hovering a row floats that avenue's photograph near the cursor. It is
 * gated on `(hover: hover) and (pointer: fine)` — touch devices get a plain
 * stacked list with the image inline, never a hover-dependent affordance.
 */
export default function AvenueList({
  avenues,
  counts,
  countLabel,
}: {
  avenues: AvenueInfo[];
  /** Project count per avenue key. */
  counts: Record<string, number>;
  countLabel: string;
}) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Raw pointer position feeds a spring so the preview trails the cursor with
  // weight instead of snapping to it.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 32, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 32, mass: 0.6 });

  // Resolved after mount: reading matchMedia during render would make the server
  // and first client render disagree.
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const track = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const preview = avenues.find((a) => a.key === hovered);

  return (
    <div ref={wrapRef} className="relative" onMouseMove={reduced ? undefined : track}>
      <ul className="border-t border-line-invert">
        {avenues.map((a, i) => (
          <li key={a.key} className="border-b border-line-invert">
            <Link
              href={`/projects?avenue=${a.slug}`}
              onMouseEnter={() => setHovered(a.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(a.key)}
              onBlur={() => setHovered(null)}
              className="group block py-6 transition-[padding] duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:pl-3 md:grid md:grid-cols-12 md:items-center md:gap-4 md:py-7"
            >
              <span className="numeric mb-2 block text-[13px] font-medium tabular-nums text-paper/35 transition-colors duration-300 group-hover:text-starlight md:col-span-1 md:mb-0">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="flex items-baseline gap-3 md:col-span-4 lg:col-span-4">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(--color-${a.accent})` }}
                  aria-hidden
                />
                <span
                  className="headline text-paper"
                  style={{ "--h-min": "24px", "--h-max": "34px" } as React.CSSProperties}
                >
                  {a.key}
                </span>
              </span>

              <span className="body-text mt-2 block text-[14px] text-paper/55 md:col-span-5 md:mt-0 md:text-[16px] lg:col-span-5">
                {a.blurb}
              </span>

              <span className="mt-3 flex items-center gap-4 md:col-span-2 md:mt-0 md:justify-end">
                <span className="text-[12px] uppercase tracking-[0.12em] text-paper/40">
                  {counts[a.key] ?? 0} {countLabel}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden
                  className="shrink-0 text-paper/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-starlight"
                >
                  <path
                    d="M2.5 11.5 11.5 2.5M11.5 2.5H4.75M11.5 2.5V9.25"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              {/* Touch/no-hover fallback: the photograph lives in the row itself. */}
              <span className="mt-4 block md:hidden">
                <span className="relative block aspect-[16/9] overflow-hidden bg-space-deep">
                  <Image
                    src={a.image}
                    alt=""
                    fill
                    sizes="100vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* The floating preview — desktop, fine pointer, motion allowed. */}
      {!reduced && canHover && (
        <AnimatePresence>
          {preview && (
            <m.div
              key={preview.key}
              aria-hidden
              className="pointer-events-none absolute z-10 hidden w-[280px] md:block"
              style={{ left: sx, top: sy, translateX: "-50%", translateY: "-50%" }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <div className="grain relative aspect-[4/3] overflow-hidden shadow-lift">
                <Image
                  src={preview.image}
                  alt=""
                  fill
                  sizes="280px"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
