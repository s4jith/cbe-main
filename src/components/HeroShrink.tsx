"use client";

import { useRef, type ReactNode } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";

/** Sticky hero content that scales to 0.88 and fades out over the first ~500px of scroll. */
export default function HeroShrink({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 500], [1, 0.88]);
  const opacity = useTransform(scrollY, [0, 380], [1, 0]);

  if (reduced) return <div>{children}</div>;

  return (
    <div ref={ref} className="sticky top-28 z-10">
      <m.div style={{ scale, opacity }} className="will-change-transform">
        {children}
      </m.div>
    </div>
  );
}
