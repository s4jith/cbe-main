"use client";

import { m, useReducedMotion } from "framer-motion";

/**
 * The lit floor under the hero: a grid laid flat in 3D so it recedes toward the
 * horizon, with markers at the intersections.
 *
 * Built from two rotated gradient planes rather than a canvas — the shape is
 * static, only the drift moves, and CSS transforms give that for free on the
 * compositor.
 */
export default function PerspectiveGrid({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ perspective: "320px", perspectiveOrigin: "50% 0%" }}
    >
      <m.div
        className="absolute inset-x-[-60%] bottom-[-30%] top-[38%]"
        style={{
          transform: "rotateX(72deg)",
          transformOrigin: "50% 0%",
          backgroundImage: `
            linear-gradient(to right, rgba(181, 101, 79, 0.42) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(181, 101, 79, 0.42) 1px, transparent 1px)
          `,
          backgroundSize: "88px 88px",
          maskImage: "linear-gradient(to bottom, #000 0%, transparent 72%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 72%)",
        }}
        // The floor creeps toward the viewer, which is what makes it read as a
        // surface rather than a printed pattern.
        animate={reduced ? undefined : { backgroundPositionY: ["0px", "88px"] }}
        transition={{ duration: 6, ease: "linear", repeat: Infinity }}
      />

      {/* A warm bloom off the left edge, as in the reference composition. */}
      <div
        className="absolute -left-[18%] top-1/2 h-[80%] w-[42%] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(224, 161, 27, 0.30), rgba(181, 101, 79, 0.16) 55%, transparent)",
          filter: "blur(18px)",
        }}
      />
    </div>
  );
}
