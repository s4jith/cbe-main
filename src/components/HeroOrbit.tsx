"use client";

import { useEffect, useRef } from "react";

/**
 * A slowly turning wheel of light, drawn in three dimensions on a canvas.
 *
 * The form is a torus with spokes — the Rotary cogwheel abstracted to points
 * rather than a logo. Deliberately not a globe: the reference site turns a globe
 * here, and this needs to be the club's own mark rather than a copy of theirs.
 *
 * Written against the 2D context with the projection done by hand instead of
 * pulling in three.js. The whole file is a couple of kilobytes where three plus a
 * background plugin is several hundred, and the hero already carries the curtain
 * intro's budget.
 */

const TUBE_POINTS = 26; // points around the tube's cross-section
const RING_POINTS = 90; // cross-sections around the wheel
const SPOKES = 12;
const SPOKE_POINTS = 14;

type Point = { x: number; y: number; z: number; s: number };

/** The wheel, built once in model space and re-projected every frame. */
function buildWheel(): Point[] {
  const points: Point[] = [];
  const R = 1; // major radius
  const r = 0.22; // tube radius

  for (let i = 0; i < RING_POINTS; i++) {
    const u = (i / RING_POINTS) * Math.PI * 2;
    // Every third cross-section is drawn fully; the rest are sparse, which reads
    // as a rim with teeth rather than a solid doughnut.
    const density = i % 3 === 0 ? TUBE_POINTS : 6;
    for (let j = 0; j < density; j++) {
      const v = (j / density) * Math.PI * 2;
      points.push({
        x: (R + r * Math.cos(v)) * Math.cos(u),
        y: (R + r * Math.cos(v)) * Math.sin(u),
        z: r * Math.sin(v),
        s: i % 3 === 0 ? 1 : 0.6,
      });
    }
  }

  for (let k = 0; k < SPOKES; k++) {
    const a = (k / SPOKES) * Math.PI * 2;
    for (let t = 1; t <= SPOKE_POINTS; t++) {
      const d = (t / SPOKE_POINTS) * (R - r * 0.5);
      points.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, z: 0, s: 0.5 });
    }
  }

  return points;
}

export default function HeroOrbit({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    // Bound to non-null locals: the narrowing above does not survive into the
    // nested draw/resize closures.
    const canvas: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const points = buildWheel();

    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    // Pointer tilt, eased toward its target rather than snapped.
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr());
      canvas.height = Math.round(height * dpr());
      ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
    }

    function draw(time: number) {
      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.36;

      tiltX += (targetTiltX - tiltX) * 0.045;
      tiltY += (targetTiltY - tiltY) * 0.045;

      // A slow tumble on two axes; the wheel never returns to the same pose, so
      // the motion does not read as a loop.
      const ry = time * 0.00016 + tiltY;
      const rx = -0.62 + Math.sin(time * 0.00011) * 0.12 + tiltX;

      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const depth = 3.2;

      for (const p of points) {
        // rotate Y, then X
        const x1 = p.x * cosY - p.y * sinY;
        const y1 = p.x * sinY + p.y * cosY;
        const y2 = y1 * cosX - p.z * sinX;
        const z2 = y1 * sinX + p.z * cosX;

        const k = depth / (depth - z2);
        const sx = cx + x1 * scale * k;
        const sy = cy + y2 * scale * k;

        // Near points are larger and brighter; far ones recede.
        const fade = (k - 0.75) / 0.85;
        const alpha = Math.max(0, Math.min(1, fade)) * 0.55 * p.s;
        if (alpha <= 0.01) continue;

        const radius = Math.max(0.4, 1.5 * k * p.s);
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 161, 27, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    function loop(time: number) {
      draw(time);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (raf || reduced) return;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    resize();
    if (reduced) {
      // One frame, held — the shape without the motion.
      draw(0);
    } else {
      start();
    }

    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };
    window.addEventListener("resize", onResize);

    const onPointer = (e: PointerEvent) => {
      if (reduced || e.pointerType !== "mouse") return;
      targetTiltY = (e.clientX / window.innerWidth - 0.5) * 0.5;
      targetTiltX = (e.clientY / window.innerHeight - 0.5) * 0.35;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Stop drawing when scrolled away or the tab is in the background — a canvas
    // repainting behind a page nobody is looking at is pure battery cost.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden || !visible) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
