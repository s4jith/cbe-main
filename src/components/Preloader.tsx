"use client";

import { useEffect, useState } from "react";

const SEEN_KEY = "rcm:preloaded";

/**
 * A brief warm-paper veil on the first visit of a session — just enough to stop
 * the hero photograph popping in mid-decode, then never seen again.
 *
 * It deliberately does not block on `document.fonts.ready`: that put ~820ms of
 * guaranteed blank screen in front of every navigation and was the single largest
 * contributor to the site feeling slow.
 */
export default function Preloader() {
  // Server and first client render must agree, so start "solid" and skip straight
  // to "gone" in the effect when this session has already seen it.
  const [phase, setPhase] = useState<"solid" | "fading" | "gone">("solid");

  useEffect(() => {
    let alive = true;
    let done: ReturnType<typeof setTimeout>;

    if (sessionStorage.getItem(SEEN_KEY)) {
      setPhase("gone");
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");

    const start = requestAnimationFrame(() => {
      if (!alive) return;
      setPhase("fading");
      done = setTimeout(() => alive && setPhase("gone"), 460);
    });

    return () => {
      alive = false;
      cancelAnimationFrame(start);
      clearTimeout(done);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] bg-paper transition-opacity duration-[440ms] ease-out"
      style={{ opacity: phase === "fading" ? 0 : 1 }}
    />
  );
}
