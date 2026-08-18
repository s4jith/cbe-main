"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A single crisp arrow pointer that stands in for the system cursor inside the
 * site — a filled coral arrow with a soft drop shadow, tip on the true point.
 *
 * The arrow tracks the mouse exactly; over anything clickable it lifts and
 * brightens (a `--hot` class) so the pointer itself carries the affordance
 * rather than a second ring chasing it. Only mounts on fine-pointer,
 * motion-allowed devices, and the native cursor is restored the moment the
 * pointer leaves the window.
 */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    setActive(true);
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    // Track the pointer synchronously — writing the transform in the event is
    // a single cheap composited property, and deferring it to the next frame is
    // exactly the lag that made the cursor feel behind the mouse.
    let hot = false;
    const onMove = (e: PointerEvent) => {
      const node = ref.current;
      if (node) node.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const el = e.target as Element | null;
      const interactive = !!el?.closest?.(
        'a, button, [role="button"], input, textarea, select, label, summary',
      );
      // Only touch the class list when the state actually flips.
      if (interactive !== hot) {
        hot = interactive;
        root.classList.toggle("cursor-hot", interactive);
      }
    };

    const hide = () => root.classList.add("cursor-hidden");
    const show = () => root.classList.remove("cursor-hidden");
    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      root.classList.remove("has-custom-cursor", "cursor-hidden", "cursor-down", "cursor-hot");
    };
  }, []);

  if (!active) return null;

  return (
    <div ref={ref} aria-hidden className="cursor-arrow">
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
        <path
          d="M3 2.2 L3 24.5 L9.1 18.7 L13.2 27.2 L17.2 25.3 L13.1 16.9 L21.6 16.4 Z"
          fill="var(--color-cranberry)"
          stroke="#fff5f2"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
