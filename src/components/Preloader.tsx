"use client";

import { useEffect, useState } from "react";

/** Solid space overlay; fades once fonts are ready (min 200ms), then unmounts. */
export default function Preloader() {
  const [phase, setPhase] = useState<"solid" | "fading" | "gone">("solid");

  useEffect(() => {
    let alive = true;
    const min = new Promise((r) => setTimeout(r, 200));
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.all([min, fonts]).then(() => {
      if (!alive) return;
      setPhase("fading");
      setTimeout(() => alive && setPhase("gone"), 620);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-space transition-opacity duration-[600ms] ease-out"
      style={{ opacity: phase === "fading" ? 0 : 1 }}
    >
      <span className="animate-pulse text-4xl text-starlight">✦</span>
    </div>
  );
}
