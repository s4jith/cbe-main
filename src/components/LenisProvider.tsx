"use client";

import { useEffect, type ReactNode } from "react";

type Lockable = {
  stop: () => void;
  start: () => void;
  scrollTo: (target: number, options?: { duration?: number }) => void;
};

let instance: Lockable | null = null;

/**
 * Pause/resume smooth scroll from anywhere — the mobile nav overlay needs the page
 * behind it to hold still. A module singleton rather than context: there is exactly
 * one Lenis on the page and this avoids a provider re-render on every toggle.
 */
export const smoothScroll = {
  stop: () => instance?.stop(),
  start: () => instance?.start(),
  /**
   * Scroll to the top. Returns false when Lenis is not running — reduced-motion
   * visitors never load it — so the caller can fall back to the native scroll
   * instead of silently doing nothing.
   */
  toTop: (duration = 1.2): boolean => {
    if (!instance) return false;
    instance.scrollTo(0, { duration });
    return true;
  },
};

/**
 * Smooth scroll, loaded off the critical path.
 *
 * Lenis is imported inside the effect rather than at module scope so it never
 * lands in the initial bundle — nothing can scroll before hydration anyway, and
 * visitors with reduced-motion set never download it at all.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let alive = true;
    let raf = 0;
    let destroy = () => {};

    import("lenis").then(({ default: Lenis }) => {
      if (!alive) return;

      const lenis = new Lenis({
        // 1.6 (the DESIGN.md figure) leaves the page visibly trailing the wheel;
        // 1.0 keeps the eased feel without the lag.
        duration: 1.0,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      instance = lenis;
      destroy = () => {
        instance = null;
        lenis.destroy();
      };
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      destroy();
    };
  }, []);

  return <>{children}</>;
}
