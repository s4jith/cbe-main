"use client";

import { useRef, type CSSProperties } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import type { Headline as HeadlineData } from "@/lib/types";
import { cssColor } from "@/lib/theme";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// Fluid type: interpolate between the mobile and desktop size across the viewport
// range rather than stepping at breakpoints. Returns the middle term of a clamp().
const MIN_VW = 375;
const MAX_VW = 1440;

function fluidTerm(min: number, max: number): string {
  if (max === min) return `${min}px`;
  const slope = (max - min) / (MAX_VW - MIN_VW);
  const intercept = min - slope * MIN_VW;
  return `calc(${intercept.toFixed(2)}px + ${(slope * 100).toFixed(3)}vw)`;
}

/**
 * Masked line-by-line reveal — the site's signature typographic move.
 *
 * `sizes` is [desktop, tablet, mobile] in px; desktop and mobile become the
 * clamp() bounds and the middle term interpolates between them. Words wrapped in
 * *asterisks* render in the accent colour.
 */
export default function Headline({
  data,
  sizes,
  as: Tag = "h2",
  font = "display",
  className = "",
  delay = 0,
  defaultColor,
  defaultAccent = "var(--color-starlight-deep)",
}: {
  data: HeadlineData;
  /** Design defaults in px: [desktop, tablet, mobile]. */
  sizes: [number, number, number];
  as?: "h1" | "h2" | "h3" | "p";
  /** Editorial serif (default) or the sans face for structural headings. */
  font?: "display" | "sans";
  className?: string;
  delay?: number;
  defaultColor?: string;
  defaultAccent?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -30px 0px" });
  const shown = reduced || inView;

  const [desktop, , mobile] = sizes;
  const scale = data.size ? data.size / desktop : 1;
  const min = Math.round(mobile * scale);
  const max = Math.round(desktop * scale);
  const accent = cssColor(data.accentColor, defaultAccent);

  const style: CSSProperties & Record<string, string> = {
    "--h-min": `${min}px`,
    "--h-max": `${max}px`,
    "--h-fluid": fluidTerm(min, max),
  };
  const color = cssColor(data.color, defaultColor as string);
  if (color) style.color = color;

  return (
    <Tag
      ref={ref}
      className={`headline ${font === "sans" ? "font-sans font-semibold" : ""} ${className}`}
      style={style}
    >
      {data.lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <m.span
            className="block will-change-transform"
            initial={reduced ? false : { y: "115%" }}
            animate={shown ? { y: "0%" } : undefined}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.11 }}
          >
            {renderLine(line, accent)}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}

/** `We lead *✦* we rise.` → the starred run rendered in the accent colour. */
export function renderLine(line: string, accent?: string) {
  const parts = line.split(/(\*[^*]+\*)/g).filter(Boolean);
  if (parts.length === 1) return line;
  return parts.map((part, i) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
      <span key={i} style={accent ? { color: accent } : undefined}>
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
