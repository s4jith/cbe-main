"use client";

import { LazyMotion, domMax } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Every animated component uses the lightweight `m` primitives instead of the
 * `motion` proxy, which pulls in a component for every DOM element plus the whole
 * feature set at import time. The features are declared once here.
 *
 * `domMax` rather than `domAnimation` because the nav highlight pill and the
 * project grid rely on layout animations (`layoutId` / `layout`), which
 * `domAnimation` does not include.
 *
 * `strict` makes a stray `motion.*` throw instead of silently re-inflating the
 * bundle it was removed from.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
