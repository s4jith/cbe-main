"use client";

import { useMemo } from "react";
import { m } from "framer-motion";

/**
 * The specks that come off a card as it is drawn out of the deck.
 *
 * Restraint is the whole brief here: a fixed 18 motes, sub-pixel sizes, and
 * opacity that never crosses 0.7. They are seeded deterministically from the
 * card index so a given card always throws the same dust — random-per-render
 * looked like noise flickering between frames.
 */
const COUNT = 18;

/** Small deterministic PRNG — same card, same dust, every time. */
function seeded(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function DustTrail({ seed, accent }: { seed: number; accent: string }) {
  const motes = useMemo(() => {
    const rand = seeded(seed + 1);
    return Array.from({ length: COUNT }, () => {
      const r = [rand(), rand(), rand(), rand(), rand()];
      return {
        // Born along the card's trailing (left) edge.
        top: 8 + r[0] * 84,
        left: -4 + r[1] * 26,
        size: 1.5 + r[2] * 3,
        drift: -70 - r[3] * 130,
        rise: -30 + r[4] * 60,
        delay: r[0] * 0.34,
        duration: 0.85 + r[2] * 0.7,
      };
    });
  }, [seed]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
      {motes.map((mote, i) => (
        <m.span
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${mote.top}%`,
            left: `${mote.left}%`,
            width: mote.size,
            height: mote.size,
            background: accent,
            boxShadow: `0 0 ${mote.size * 3}px ${accent}`,
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 0.7, 0],
            x: mote.drift,
            y: mote.rise,
            scale: [0.4, 1, 0.2],
          }}
          transition={{
            duration: mote.duration,
            ease: [0.22, 1, 0.36, 1],
            delay: mote.delay,
          }}
        />
      ))}
    </div>
  );
}
