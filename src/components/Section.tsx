import type { CSSProperties, ReactNode } from "react";
import type { Surface } from "@/lib/types";
import { alpha, cssColor } from "@/lib/theme";

/**
 * One band of a page. Background colour, text tone, the starfield speckle and
 * "hide this section" all come from the CMS; the layout classes stay in code.
 */
export default function Section({
  surface,
  defaultBackground,
  className = "",
  style,
  id,
  children,
}: {
  surface: Surface;
  defaultBackground?: string;
  className?: string;
  style?: CSSProperties;
  /** Anchor target, for in-page links such as the hero's community CTA. */
  id?: string;
  children: ReactNode;
}) {
  if (surface.hidden) return null;
  const background = cssColor(surface.background, defaultBackground as string);
  return (
    <section
      {...(id ? { id } : {})}
      className={`${surface.starfield ? "starfield " : ""}${className}`}
      style={{ ...(background ? { backgroundColor: background } : {}), ...style }}
    >
      {children}
    </section>
  );
}

/** Muted text colour appropriate to a light or dark section. */
export function muted(tone: "light" | "dark", override?: string, opacity = 60): string {
  const base = cssColor(override, tone === "dark" ? "var(--color-paper)" : "var(--color-ink)");
  return alpha(base, opacity) as string;
}

/** Solid text colour appropriate to a light or dark section. */
export function solid(tone: "light" | "dark", override?: string): string {
  return cssColor(override, tone === "dark" ? "var(--color-paper)" : "var(--color-ink)");
}

/** The small lowercase label that sits above a headline. */
export function Eyebrow({
  children,
  tone,
  color,
  className = "",
}: {
  children: ReactNode;
  tone: "light" | "dark";
  color?: string;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      className={`text-[17px] font-medium lowercase ${className}`}
      style={{ color: muted(tone, color, 40) }}
    >
      {children}
    </p>
  );
}
