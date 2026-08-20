"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A red arrow pointer that stands in for the system cursor inside the site.
 *
 * Two nested elements on purpose. The outer one is *only* ever translated, and
 * the inner one is *only* ever scaled. Putting both on one element means the CSS
 * `scale` property multiplies the translation (transforms compose as
 * rotate × scale × transform), which throws the arrow hundreds of pixels off
 * once the pointer is far from the top-left corner.
 *
 * Position is written straight into the pointermove handler — one composited
 * property, no per-frame deferral — so the arrow sits exactly on the pointer.
 * The hover test runs on mouseover instead, which fires only when the element
 * under the pointer changes rather than on every pixel of travel.
 */
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hot"]';

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

    const onMove = (e: PointerEvent) => {
      const node = ref.current;
      if (node) node.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    let hot = false;
    const setHot = (next: boolean) => {
      if (next === hot) return;
      hot = next;
      root.classList.toggle("cursor-hot", next);
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      setHot(Boolean(el?.closest?.(INTERACTIVE)));
    };

    const hide = () => root.classList.add("cursor-hidden");
    const show = () => root.classList.remove("cursor-hidden");
    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onOver);
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
      <span className="cursor-arrow__inner">
        <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
          <path
            d="M3 2.2 L3 24.5 L9.1 18.7 L13.2 27.2 L17.2 25.3 L13.1 16.9 L21.6 16.4 Z"
            fill="var(--color-cranberry)"
            stroke="#fff5f2"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}
