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
          // Red rulings, with a red dot dropped on every intersection — the same
          // dotted floor the reference runs under its globe.
          backgroundImage: `
            radial-gradient(circle at 0 0, rgba(236, 43, 33, 0.9) 0, rgba(236, 43, 33, 0.9) 2px, transparent 2.6px),
            linear-gradient(to right, rgba(236, 43, 33, 0.28) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(236, 43, 33, 0.28) 1px, transparent 1px)
          `,
          backgroundSize: "88px 88px, 88px 88px, 88px 88px",
          maskImage: "linear-gradient(to bottom, #000 0%, transparent 74%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 74%)",
        }}
        // The floor creeps toward the viewer, which is what makes it read as a
        // surface rather than a printed pattern.
        animate={reduced ? undefined : { backgroundPositionY: ["0px", "88px"] }}
        transition={{ duration: 6, ease: "linear", repeat: Infinity }}
      />

      {/* A hot orange-red bloom off the left edge, as in the reference. */}
      <div
        className="absolute -left-[16%] top-1/2 h-[85%] w-[44%] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(236, 43, 33, 0.34), rgba(245, 90, 40, 0.16) 55%, transparent)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}
