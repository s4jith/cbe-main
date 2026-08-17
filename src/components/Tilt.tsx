"use client";

import { useRef, type ReactNode } from "react";
import { m, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * Tips its contents toward the pointer, the way a card lifts when you lean over
 * it. The rotation runs through a spring rather than tracking the pointer
 * directly — direct tracking feels twitchy and reads as a gimmick.
 *
 * Pointer-only: on touch there is no hover, and a card that tilts on tap just
 * makes the tap feel unreliable.
 */
export default function Tilt({
  children,
  max = 7,
  className = "",
}: {
  children: ReactNode;
  /** Peak rotation in degrees at the corners. */
  max?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 190, damping: 18, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  function onPointerMove(e: React.PointerEvent) {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    px.set(0);
    py.set(0);
  }

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} onPointerMove={onPointerMove} onPointerLeave={reset} className={className}>
      <m.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 900 }}
      >
        {children}
      </m.div>
    </div>
  );
}
