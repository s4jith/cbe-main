"use client";

import { smoothScroll } from "@/components/LenisProvider";

/**
 * Returns to the top of the page.
 *
 * Lenis owns the page's scroll position, and calling `window.scrollTo` while it
 * is running fights its animation loop — so ask Lenis first and only fall back
 * to the native scroll when it is not on the page.
 */
export default function BackToTop() {
  function toTop() {
    if (smoothScroll.toTop()) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      className="wipe-link inline-flex items-center gap-2 text-[13px] font-bold text-paper/70 transition-colors hover:text-paper"
    >
      Back to top
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M6 11V1M6 1L1.5 5.5M6 1l4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
