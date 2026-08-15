"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * The faint ruled grid behind the hero. Two things keep it from becoming noise:
 * it never exceeds a hairline's worth of contrast, and it is masked to fade out
 * before it reaches the headline's baseline.
 *
 * The drift follows the pointer through a spring rather than tracking it
 * directly — direct tracking reads as a gimmick, a lagging spring reads as depth.
 */
export default function GridBackdrop({
  cell = 68,
  className = "",
}: {
  cell?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 42, damping: 22, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 42, damping: 22, mass: 0.7 });
  const x = useTransform(sx, (v) => `${v}px`);
  const y = useTransform(sy, (v) => `${v}px`);

  // Pointer parallax is a fine-pointer affordance; on touch there is no hover
  // state to speak of and the listener would just cost battery.
  useEffect(() => {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      px.set(nx * -18);
      py.set(ny * -12);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, px, py]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        maskImage: "radial-gradient(120% 90% at 50% 0%, #000 25%, transparent 78%)",
        WebkitMaskImage: "radial-gradient(120% 90% at 50% 0%, #000 25%, transparent 78%)",
      }}
    >
      <m.div
        className="absolute -inset-24"
        style={{
          x: enabled ? x : 0,
          y: enabled ? y : 0,
          backgroundImage: `
            linear-gradient(to right, var(--color-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)
          `,
          backgroundSize: `${cell}px ${cell}px`,
          opacity: 0.55,
        }}
      />
    </div>
  );
}
