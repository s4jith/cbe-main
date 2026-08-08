"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Rise-and-inflate card reveal (ref-site .cards-reveal). */
export default function Reveal({
  children,
  delay = 0,
  y = 60,
  scale = true,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  scale?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={reduced ? false : { y, scale: scale ? 0.92 : 1, opacity: 0 }}
      whileInView={{ y: 0, scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px 80px 0px" }}
      transition={{
        y: { duration: 0.9, ease: [0.4, 0.4, 0, 1], delay },
        opacity: { duration: 0.7, ease: [0.4, 0.4, 0, 1], delay },
        scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: delay + 0.2 },
      }}
    >
      {children}
    </m.div>
  );
}
